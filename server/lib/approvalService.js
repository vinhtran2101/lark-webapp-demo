import { query, withTransaction } from "./db.js";
import { getBaseUrl } from "./auth.js";
import {
  TASK_STATUSES,
  buildApprovalSnapshot,
  normalizeTaskStatus,
  taskStatusTone,
  validateApprovalSnapshot,
} from "./forecastService.js";
import {
  buildForecastApprovalForm,
  buildForecastNodeApprovers,
  createForecastApprovalInstance,
  getForecastApprovalInstance,
  mapLarkApprovalStatus,
} from "./larkApprovalService.js";

function asJson(value) {
  return JSON.stringify(value || {});
}

function errorWithDetails(message, details, statusCode = 422) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.details = details;
  return error;
}

async function getActor(client, actorId) {
  if (!actorId) return null;
  const result = await client.query("select * from users where id = $1 limit 1", [actorId]);
  return result.rows[0] || null;
}

async function getSubmittedFiles(client, taskId, fileIds = []) {
  if (fileIds.length) {
    const result = await client.query(
      `
        select *
        from forecast_files
        where forecast_task_id = $1
          and id = any($2::uuid[])
        order by version asc, uploaded_at asc
      `,
      [taskId, fileIds]
    );
    return result.rows;
  }

  const latest = await client.query(
    "select coalesce(max(version), 0)::int as version from forecast_files where forecast_task_id = $1",
    [taskId]
  );
  const version = latest.rows[0]?.version || 0;
  if (!version) return [];

  const result = await client.query(
    `
      select *
      from forecast_files
      where forecast_task_id = $1
        and version = $2
      order by uploaded_at asc
    `,
    [taskId, version]
  );
  return result.rows;
}

function validateFiles(files) {
  const errors = [];
  if (!files.length) {
    errors.push("Task chưa có file version hợp lệ để submit.");
    return errors;
  }
  files.forEach((file) => {
    if (!file.file_name) errors.push(`File ${file.id} thiếu tên file.`);
    if (!file.storage_path && !file.file_url) errors.push(`${file.file_name || file.id} thiếu storage_path/file_url.`);
    if (["locked", "submitted", "approved"].includes(file.status)) {
      errors.push(`${file.file_name} đã bị khóa hoặc đã submit ở vòng khác.`);
    }
  });
  return errors;
}

function getRequester(snapshot, actor) {
  if (actor?.lark_open_id || actor?.lark_user_id) {
    return {
      id: actor.id,
      name: actor.full_name,
      larkOpenId: actor.lark_open_id,
      larkUserId: actor.lark_user_id,
    };
  }
  return snapshot.asmUsers?.find((user) => user.larkOpenId || user.larkUserId) || null;
}

function buildTaskUrl(baseUrl, taskId) {
  const cleanBase = String(baseUrl || "").replace(/\/$/, "");
  return `${cleanBase}/?task=${encodeURIComponent(taskId)}`;
}

async function prepareApprovalRequest({ taskId, fileIds = [], actorId = null, baseUrl }) {
  return withTransaction(async (client) => {
    const snapshot = await buildApprovalSnapshot(client, taskId);
    const status = normalizeTaskStatus(snapshot.task.status);
    const errors = validateApprovalSnapshot(snapshot);
    const actor = await getActor(client, actorId);
    const requester = getRequester(snapshot, actor);
    const files = await getSubmittedFiles(client, snapshot.task.id, fileIds);
    errors.push(...validateFiles(files));

    const isApprovalDryRun = String(process.env.LARK_APPROVAL_DRY_RUN || "").toLowerCase() === "true";
    if (!process.env.LARK_FORECAST_APPROVAL_CODE && !isApprovalDryRun) {
      errors.push("Thiếu LARK_FORECAST_APPROVAL_CODE.");
    }
    if (!requester?.larkOpenId && !requester?.larkUserId) {
      errors.push("Người submit/ASM chưa có Lark open_id hoặc user_id.");
    }
    if ([TASK_STATUSES.SUBMITTED, TASK_STATUSES.IN_APPROVAL].includes(status)) {
      errors.push("Task đang có approval pending/in_approval, không thể submit thêm.");
    }
    if ([TASK_STATUSES.REJECTED, TASK_STATUSES.COMPLETED].includes(status)) {
      errors.push("Task đã kết thúc, không thể submit lại.");
    }

    const pending = await client.query(
      "select id from approval_requests where forecast_task_id = $1 and status = 'pending' order by created_at desc limit 1",
      [snapshot.task.id]
    );
    if (pending.rowCount) {
      errors.push("Task đang có approval request pending.");
    }

    if (errors.length) {
      throw errorWithDetails("Không thể tạo approval vì thiếu dữ liệu bắt buộc.", errors);
    }

    const maxFileVersion = Math.max(...files.map((file) => file.version || 1));
    const appUrl = buildTaskUrl(baseUrl, snapshot.task.id);
    const formValues = buildForecastApprovalForm({ snapshot, files, appUrl });
    const nodeApprovers = buildForecastNodeApprovers(snapshot);
    const channelConfigSnapshot = {
      channel: snapshot.channel,
      rsm: snapshot.rsm,
      gdkd: snapshot.gdkd,
      asmUsers: snapshot.asmUsers,
      capturedAt: new Date().toISOString(),
    };

    const requestResult = await client.query(
      `
        insert into approval_requests
          (forecast_cycle_id, forecast_task_id, channel_id, requester_id, submitted_by, lark_approval_code,
           status, approver_snapshot, channel_config_snapshot, approval_payload)
        values ($1, $2, $3, $4, $5, $6, 'pending', $7::jsonb, $8::jsonb, $9::jsonb)
        returning *
      `,
      [
        snapshot.cycle.id,
        snapshot.task.id,
        snapshot.channel.id,
        requester.id || actor?.id || null,
        actor?.id || requester.id || null,
        process.env.LARK_FORECAST_APPROVAL_CODE,
        asJson(snapshot),
        asJson(channelConfigSnapshot),
        asJson({ formValues, nodeApprovers, appUrl }),
      ]
    );
    const approvalRequest = requestResult.rows[0];

    await client.query(
      `
        update forecast_files
        set status = 'locked',
            locked_at = now()
        where id = any($1::uuid[])
      `,
      [files.map((file) => file.id)]
    );

    for (const file of files) {
      await client.query(
        `
          insert into approval_request_files (approval_request_id, forecast_file_id)
          values ($1, $2)
          on conflict (approval_request_id, forecast_file_id) do nothing
        `,
        [approvalRequest.id, file.id]
      );
    }

    await client.query(
      `
        update forecast_tasks
        set status = 'submitted',
            status_tone = $2,
            due_text = 'ASM đã submit file, đang tạo Lark Approval',
            current_approval_request_id = $3,
            current_file_version = $4,
            assignment_snapshot = $5::jsonb,
            channel_config_snapshot = $6::jsonb,
            progress = greatest(progress, 55),
            updated_at = now()
        where id = $1
      `,
      [
        snapshot.task.id,
        taskStatusTone(TASK_STATUSES.SUBMITTED),
        approvalRequest.id,
        maxFileVersion,
        asJson(snapshot.asmUsers),
        asJson(channelConfigSnapshot),
      ]
    );

    await client.query(
      `
        insert into approval_events (approval_request_id, event_key, event_type, status, payload)
        values ($1, $2, 'approval_prepared', 'pending', $3::jsonb)
        on conflict (event_key) do nothing
      `,
      [
        approvalRequest.id,
        `prepared:${approvalRequest.id}`,
        asJson({ files: files.map((file) => file.id), requester }),
      ]
    );

    return {
      approvalRequest,
      files,
      snapshot,
      requester,
      formValues,
      nodeApprovers,
      title: `${snapshot.cycle.title} - ${snapshot.channel.shortName || snapshot.channel.name}`,
    };
  });
}

export async function submitTaskForApproval({ taskId, fileIds = [], actorId = null, req = null, baseUrl = "" }) {
  const resolvedBaseUrl = baseUrl || (req ? getBaseUrl(req) : process.env.APP_BASE_URL || "");
  const prepared = await prepareApprovalRequest({ taskId, fileIds, actorId, baseUrl: resolvedBaseUrl });

  try {
    const created = await createForecastApprovalInstance({
      requesterOpenId: prepared.requester.larkOpenId,
      requesterUserId: prepared.requester.larkUserId,
      formValues: prepared.formValues,
      nodeApprovers: prepared.nodeApprovers,
      title: prepared.title,
    });

    await withTransaction(async (client) => {
      await client.query(
        `
          update approval_requests
          set lark_instance_code = $2,
              external_approval_url = $3,
              status = 'pending',
              approval_payload = approval_payload || $4::jsonb,
              updated_at = now()
          where id = $1
        `,
        [
          prepared.approvalRequest.id,
          created.instanceCode,
          created.appLink,
          asJson({ larkCreateResponse: created.raw }),
        ]
      );
      await client.query(
        `
          update forecast_tasks
          set status = 'in_approval',
              status_tone = $2,
              due_text = 'Đang duyệt trên Lark Approval',
              progress = greatest(progress, 65),
              updated_at = now()
          where id = $1
        `,
        [prepared.snapshot.task.id, taskStatusTone(TASK_STATUSES.IN_APPROVAL)]
      );
      await client.query(
        `
          insert into approval_events (approval_request_id, event_key, event_type, status, payload)
          values ($1, $2, 'lark_instance_created', 'pending', $3::jsonb)
          on conflict (event_key) do nothing
        `,
        [
          prepared.approvalRequest.id,
          `lark_created:${created.instanceCode}`,
          asJson(created),
        ]
      );
    });

    return {
      approvalRequestId: prepared.approvalRequest.id,
      larkInstanceCode: created.instanceCode,
      approvalUrl: created.appLink,
      status: "pending",
    };
  } catch (error) {
    await withTransaction(async (client) => {
      await client.query(
        `
          update approval_requests
          set status = 'failed_sync',
              sync_error = $2,
              updated_at = now()
          where id = $1
        `,
        [prepared.approvalRequest.id, error.message]
      );
      await client.query(
        `
          update forecast_tasks
          set status = 'need_revision',
              status_tone = $2,
              due_text = 'Tạo Lark Approval thất bại, cần kiểm tra lại cấu hình',
              updated_at = now()
          where id = $1
        `,
        [prepared.snapshot.task.id, taskStatusTone(TASK_STATUSES.NEED_REVISION)]
      );
      await client.query(
        "update forecast_files set status = 'draft', locked_at = null where id = any($1::uuid[])",
        [prepared.files.map((file) => file.id)]
      );
      await client.query(
        `
          insert into approval_events (approval_request_id, event_key, event_type, status, payload)
          values ($1, $2, 'lark_create_failed', 'failed_sync', $3::jsonb)
          on conflict (event_key) do nothing
        `,
        [
          prepared.approvalRequest.id,
          `lark_failed:${prepared.approvalRequest.id}`,
          asJson({ message: error.message, details: error.details || null }),
        ]
      );
    });
    throw error;
  }
}

function taskStatusFromApprovalStatus(status) {
  if (status === "approved") return TASK_STATUSES.APPROVED;
  if (status === "rejected" || status === "canceled") return TASK_STATUSES.NEED_REVISION;
  return TASK_STATUSES.IN_APPROVAL;
}

export async function syncApprovalRequest(approvalRequestId) {
  const requestResult = await query("select * from approval_requests where id::text = $1 limit 1", [approvalRequestId]);
  const approvalRequest = requestResult.rows[0];
  if (!approvalRequest) {
    const error = new Error("Không tìm thấy approval request.");
    error.statusCode = 404;
    throw error;
  }
  if (!approvalRequest.lark_instance_code) {
    const error = new Error("Approval request chưa có lark_instance_code.");
    error.statusCode = 422;
    throw error;
  }

  if (String(approvalRequest.lark_instance_code).startsWith("dry_")) {
    await query(
      `
        insert into approval_events (approval_request_id, event_key, event_type, status, payload)
        values ($1, $2, 'dry_run_status_sync', $3, $4::jsonb)
        on conflict (event_key) do nothing
      `,
      [
        approvalRequest.id,
        `dry_sync:${approvalRequest.lark_instance_code}:${Date.now()}`,
        approvalRequest.status,
        asJson({ dryRun: true, message: "Dry-run approval instance, skipped Lark OpenAPI sync." }),
      ]
    );
    return { approvalRequestId: approvalRequest.id, status: approvalRequest.status, dryRun: true };
  }

  const detail = await getForecastApprovalInstance(approvalRequest.lark_instance_code);
  const mappedStatus = mapLarkApprovalStatus(detail.status || detail.instance_status || "PENDING");
  const resolvedAt = mappedStatus === "pending" ? null : new Date();
  const nextTaskStatus = taskStatusFromApprovalStatus(mappedStatus);

  await withTransaction(async (client) => {
    await client.query(
      `
        update approval_requests
        set status = $2,
            resolved_at = coalesce($3, resolved_at),
            approval_payload = approval_payload || $4::jsonb,
            updated_at = now()
        where id = $1
      `,
      [approvalRequest.id, mappedStatus, resolvedAt, asJson({ lastSyncAt: new Date().toISOString(), larkDetail: detail })]
    );
    await client.query(
      `
        update forecast_tasks
        set status = $2,
            status_tone = $3,
            due_text = $4,
            progress = case when $2 = 'approved' then 100 else progress end,
            updated_at = now()
        where id = $1
      `,
      [
        approvalRequest.forecast_task_id,
        nextTaskStatus,
        taskStatusTone(nextTaskStatus),
        mappedStatus === "approved"
          ? "Lark Approval đã duyệt xong"
          : mappedStatus === "pending"
            ? "Đang duyệt trên Lark Approval"
            : "Approval bị trả lại, cần chỉnh sửa và nộp lại",
      ]
    );

    if (mappedStatus === "approved") {
      await client.query(
        `
          update forecast_files
          set status = 'approved'
          where id in (
            select forecast_file_id
            from approval_request_files
            where approval_request_id = $1
          )
        `,
        [approvalRequest.id]
      );
    }
    if (mappedStatus === "rejected" || mappedStatus === "canceled") {
      await client.query(
        `
          update forecast_files
          set status = 'rejected'
          where id in (
            select forecast_file_id
            from approval_request_files
            where approval_request_id = $1
          )
        `,
        [approvalRequest.id]
      );
    }

    await client.query(
      `
        insert into approval_events (approval_request_id, event_key, event_type, status, payload)
        values ($1, $2, 'lark_status_sync', $3, $4::jsonb)
        on conflict (event_key) do nothing
      `,
      [
        approvalRequest.id,
        `sync:${approvalRequest.lark_instance_code}:${mappedStatus}:${Date.now()}`,
        mappedStatus,
        asJson(detail),
      ]
    );
  });

  return { approvalRequestId: approvalRequest.id, status: mappedStatus, larkDetail: detail };
}

export async function syncPendingApprovalRequests({ limit = 20 } = {}) {
  const result = await query(
    `
      select id
      from approval_requests
      where status = 'pending'
        and lark_instance_code is not null
      order by submitted_at asc
      limit $1
    `,
    [limit]
  );

  const results = [];
  for (const row of result.rows) {
    try {
      results.push(await syncApprovalRequest(row.id));
    } catch (error) {
      results.push({ approvalRequestId: row.id, ok: false, error: error.message });
    }
  }
  return results;
}
