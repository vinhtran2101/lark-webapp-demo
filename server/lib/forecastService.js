export const TASK_STATUSES = {
  DRAFT: "draft",
  ASSIGNED: "assigned",
  SUBMITTED: "submitted",
  IN_APPROVAL: "in_approval",
  NEED_REVISION: "need_revision",
  REJECTED: "rejected",
  APPROVED: "approved",
  COMPLETED: "completed",
};

export const TASK_STATUS_LABELS = {
  draft: "Chưa đủ thông tin",
  assigned: "Chờ ASM cập nhật",
  submitted: "Đang gửi duyệt",
  in_approval: "Đang duyệt trên Lark",
  need_revision: "Cần chỉnh sửa",
  rejected: "Đã từ chối",
  approved: "Đã duyệt",
  completed: "Hoàn tất",
};

export function taskStatusTone(status) {
  const value = String(status || "").toLowerCase();
  if (["approved", "completed"].includes(value)) return "success";
  if (["rejected", "need_revision"].includes(value)) return "danger";
  if (["submitted", "in_approval"].includes(value)) return "warning";
  if (value === "assigned") return "neutral";
  return "slate";
}

export function toTaskStatusLabel(status) {
  return TASK_STATUS_LABELS[String(status || "").toLowerCase()] || status || TASK_STATUS_LABELS.draft;
}

export function normalizeTaskStatus(status) {
  const value = String(status || "").toLowerCase();
  const plain = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (Object.values(TASK_STATUSES).includes(value)) return value;
  if (plain.includes("phat") || plain.includes("hoan")) return TASK_STATUSES.COMPLETED;
  if (plain.includes("gdkd") || plain.includes("duyet")) return TASK_STATUSES.APPROVED;
  if (plain.includes("rsm") || plain.includes("submitted")) return TASK_STATUSES.IN_APPROVAL;
  if (plain.includes("asm") || plain.includes("assigned")) return TASK_STATUSES.ASSIGNED;
  if (plain.includes("reject") || plain.includes("tu choi")) return TASK_STATUSES.REJECTED;
  return TASK_STATUSES.DRAFT;
}

export async function getActiveTaskAssignments(client, taskId) {
  const result = await client.query(
    `
      select
        ta.id,
        ta.forecast_task_id,
        ta.user_id,
        ta.role_code,
        ta.status,
        ta.assigned_at,
        ta.note,
        u.full_name,
        u.email,
        u.title,
        u.department,
        u.lark_open_id,
        u.lark_user_id,
        u.status as user_status
      from task_assignments ta
      join users u on u.id = ta.user_id
      where ta.forecast_task_id = $1
        and ta.status = 'active'
      order by ta.assigned_at asc
    `,
    [taskId]
  );
  return result.rows;
}

export async function getTaskContext(client, taskId) {
  const taskResult = await client.query(
    `
      select
        ft.*,
        fc.code as cycle_code,
        fc.title as cycle_title,
        fc.month,
        fc.year,
        fc.total_deadline_at,
        sc.code as channel_code,
        sc.name as channel_name,
        sc.short_name as channel_short_name,
        sc.region as channel_region,
        owner.full_name as owner_name,
        owner.lark_open_id as owner_lark_open_id,
        owner.lark_user_id as owner_lark_user_id,
        rsm.full_name as rsm_name,
        rsm.lark_open_id as rsm_lark_open_id,
        rsm.lark_user_id as rsm_lark_user_id,
        director.full_name as director_name,
        director.lark_open_id as director_lark_open_id,
        director.lark_user_id as director_lark_user_id
      from forecast_tasks ft
      join forecast_cycles fc on fc.id = ft.forecast_cycle_id
      join sales_channels sc on sc.id = ft.channel_id
      left join users owner on owner.id = ft.owner_id
      left join users rsm on rsm.id = ft.rsm_id
      left join users director on director.id = ft.director_id
      where ft.id::text = $1
      limit 1
    `,
    [taskId]
  );
  const task = taskResult.rows[0];
  if (!task) {
    const error = new Error("Không tìm thấy task Forecast.");
    error.statusCode = 404;
    throw error;
  }

  const assignments = await getActiveTaskAssignments(client, task.id);
  return { task, assignments };
}

export async function getRoleApprovers(client, roleCode) {
  const result = await client.query(
    `
      select
        u.id,
        u.full_name,
        u.email,
        u.title,
        u.department,
        u.lark_open_id,
        u.lark_user_id,
        r.code as role_code,
        r.name as role_name
      from users u
      join user_roles ur on ur.user_id = u.id
      join roles r on r.id = ur.role_id
      where r.code = $1
        and u.status = 'active'
      order by u.employee_code nulls last, u.full_name
    `,
    [roleCode]
  );
  return result.rows;
}

function compactUser(user, fallback = {}) {
  if (!user) return null;
  return {
    id: user.id || user.user_id || fallback.id || null,
    name: user.full_name || user.name || fallback.name || "",
    email: user.email || fallback.email || "",
    title: user.title || fallback.title || "",
    department: user.department || fallback.department || "",
    larkOpenId: user.lark_open_id || user.larkOpenId || fallback.larkOpenId || "",
    larkUserId: user.lark_user_id || user.larkUserId || fallback.larkUserId || "",
  };
}

export async function buildApprovalSnapshot(client, taskId) {
  const { task, assignments } = await getTaskContext(client, taskId);
  const [supply, finance, bi, ceo] = await Promise.all([
    getRoleApprovers(client, "supply"),
    getRoleApprovers(client, "finance"),
    getRoleApprovers(client, "bi"),
    getRoleApprovers(client, "ceo"),
  ]);

  const asmUsers = assignments
    .filter((assignment) => assignment.role_code === "ASM")
    .map((assignment) => compactUser(assignment));

  return {
    task: {
      id: task.id,
      status: normalizeTaskStatus(task.status),
      deadlineAt: task.deadline_at,
      currentApprovalRequestId: task.current_approval_request_id,
      currentFileVersion: task.current_file_version,
    },
    cycle: {
      id: task.forecast_cycle_id,
      code: task.cycle_code,
      title: task.cycle_title,
      month: task.month,
      year: task.year,
      totalDeadlineAt: task.total_deadline_at,
    },
    channel: {
      id: task.channel_id,
      code: task.channel_code,
      name: task.channel_name,
      shortName: task.channel_short_name,
      region: task.channel_region,
    },
    asmUsers,
    rsm: compactUser({
      id: task.rsm_id,
      full_name: task.rsm_name,
      lark_open_id: task.rsm_lark_open_id,
      lark_user_id: task.rsm_lark_user_id,
    }),
    gdkd: compactUser({
      id: task.director_id,
      full_name: task.director_name,
      lark_open_id: task.director_lark_open_id,
      lark_user_id: task.director_lark_user_id,
    }),
    appraisal: {
      supply: supply.map((user) => compactUser(user)),
      finance: finance.map((user) => compactUser(user)),
      bi: bi.map((user) => compactUser(user)),
    },
    ceo: ceo.map((user) => compactUser(user)),
  };
}

export function validateApprovalSnapshot(snapshot) {
  const errors = [];
  const requireOpenId = (label, user) => {
    if (!user) {
      errors.push(`Thiếu ${label}.`);
      return;
    }
    if (!user.larkOpenId) errors.push(`${label} chưa có lark_open_id.`);
  };
  const requireOpenIdList = (label, users) => {
    if (!users?.length) {
      errors.push(`Thiếu người duyệt ${label}.`);
      return;
    }
    users.forEach((user) => requireOpenId(`${label}: ${user.name || user.email || user.id}`, user));
  };

  if (!snapshot.asmUsers?.length) errors.push("Task chưa có ASM phụ trách.");
  requireOpenId("RSM", snapshot.rsm);
  requireOpenId("GĐKD", snapshot.gdkd);
  requireOpenIdList("Cung ứng", snapshot.appraisal?.supply);
  requireOpenIdList("Tài chính", snapshot.appraisal?.finance);
  requireOpenIdList("BI", snapshot.appraisal?.bi);
  requireOpenIdList("CEO", snapshot.ceo);

  return errors;
}

export async function assignTaskAsms(client, { taskId, asmUserIds = [], actorId = null, note = "" }) {
  const { task } = await getTaskContext(client, taskId);
  const status = normalizeTaskStatus(task.status);
  if ([TASK_STATUSES.SUBMITTED, TASK_STATUSES.IN_APPROVAL].includes(status)) {
    const error = new Error("Task đang trong vòng duyệt, không thể đổi ASM. Hãy cancel/reject approval trước.");
    error.statusCode = 409;
    throw error;
  }

  const uniqueUserIds = [...new Set(asmUserIds.filter(Boolean))];
  await client.query(
    "update task_assignments set status = 'inactive', updated_at = now() where forecast_task_id = $1 and role_code = 'ASM'",
    [task.id]
  );

  for (const userId of uniqueUserIds) {
    await client.query(
      `
        insert into task_assignments (forecast_task_id, user_id, role_code, status, assigned_by, note)
        values ($1, $2, 'ASM', 'active', $3, $4)
        on conflict (forecast_task_id, user_id, role_code) do update set
          status = 'active',
          assigned_by = excluded.assigned_by,
          note = excluded.note,
          assigned_at = now(),
          updated_at = now()
      `,
      [task.id, userId, actorId, note]
    );
  }

  const nextStatus = uniqueUserIds.length ? TASK_STATUSES.ASSIGNED : TASK_STATUSES.DRAFT;
  const updated = await client.query(
    `
      update forecast_tasks
      set owner_id = $2,
          status = $3,
          status_tone = $4,
          due_text = $5,
          progress = greatest(progress, $6),
          updated_at = now()
      where id = $1
      returning *
    `,
    [
      task.id,
      uniqueUserIds[0] || null,
      nextStatus,
      taskStatusTone(nextStatus),
      uniqueUserIds.length ? "Đã phân công ASM, chờ upload file Forecast" : "Chưa phân công ASM",
      uniqueUserIds.length ? 10 : 0,
    ]
  );

  await client.query(
    `
      insert into activity_logs (actor_id, entity_type, entity_id, action, message, metadata)
      values ($1, 'forecast_task', $2, 'task_assign_asm', $3, $4::jsonb)
    `,
    [
      actorId,
      task.id,
      `Cập nhật ASM phụ trách ${task.channel_name}`,
      JSON.stringify({
        detail: uniqueUserIds.length ? `Gán ${uniqueUserIds.length} ASM vào task.` : "Gỡ toàn bộ ASM khỏi task.",
        tone: "blue",
        iconKey: "users",
        createdAtLabel: "Vừa xong",
      }),
    ]
  );

  return updated.rows[0];
}
