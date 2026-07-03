import { mockDatabase } from "../../src/data/mockDatabase.js";
import { withTransaction } from "../../server/lib/db.js";
import { assertSetupToken, sendJson, sendMethodNotAllowed } from "../../server/lib/http.js";

function normalizeUserStatus(status) {
  const value = String(status || "active").toLowerCase();
  if (value.includes("inactive")) return "inactive";
  if (value.includes("locked") || value.includes("blocked")) return "locked";
  return "active";
}

function normalizeForecastStatus(status, tone) {
  const value = `${status || ""} ${tone || ""}`.toLowerCase();
  if (value.includes("published") || value.includes("ended") || value.includes("phat")) return "published";
  if (value.includes("reject") || value.includes("khong")) return "rejected";
  if (value.includes("ceo") || value.includes("approval")) return "approval";
  if (value.includes("appraisal")) return "appraisal";
  return "active";
}

async function upsertRole(client, role) {
  const result = await client.query(
    `
      insert into roles (code, name, description, scope_type, scope_label, risk, is_system)
      values ($1, $2, $3, $4, $5, $6, $7)
      on conflict (code) do update set
        name = excluded.name,
        description = excluded.description,
        scope_type = excluded.scope_type,
        scope_label = excluded.scope_label,
        risk = excluded.risk,
        is_system = excluded.is_system,
        updated_at = now()
      returning id
    `,
    [role.code, role.name, role.description, role.scopeType, role.scopeLabel, role.risk, Boolean(role.isSystem)]
  );
  return result.rows[0].id;
}

async function upsertUser(client, user) {
  const result = await client.query(
    `
      insert into users (employee_code, full_name, email, phone, department, title, status, initials, tone)
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      on conflict (email) do update set
        employee_code = excluded.employee_code,
        full_name = excluded.full_name,
        phone = excluded.phone,
        department = excluded.department,
        title = excluded.title,
        status = excluded.status,
        initials = excluded.initials,
        tone = excluded.tone,
        updated_at = now()
      returning id
    `,
    [
      user.employeeCode,
      user.fullName,
      user.email,
      user.phone || null,
      user.department,
      user.title,
      normalizeUserStatus(user.status),
      user.initials,
      user.tone,
    ]
  );
  return result.rows[0].id;
}

async function upsertModule(client, module) {
  const result = await client.query(
    `
      insert into modules (code, name, data_label, sort_order)
      values ($1, $2, $3, $4)
      on conflict (code) do update set
        name = excluded.name,
        data_label = excluded.data_label,
        sort_order = excluded.sort_order
      returning id
    `,
    [module.code, module.name, module.dataLabel, module.sortOrder]
  );
  return result.rows[0].id;
}

async function upsertSalesChannel(client, channel) {
  const result = await client.query(
    `
      insert into sales_channels (code, name, short_name, region, status, icon_key, icon_tone, marker)
      values ($1, $2, $3, $4, $5, $6, $7, $8)
      on conflict (code) do update set
        name = excluded.name,
        short_name = excluded.short_name,
        region = excluded.region,
        status = excluded.status,
        icon_key = excluded.icon_key,
        icon_tone = excluded.icon_tone,
        marker = excluded.marker,
        updated_at = now()
      returning id
    `,
    [
      channel.code,
      channel.name,
      channel.shortName,
      channel.region,
      channel.status || "active",
      channel.iconKey,
      channel.iconTone,
      channel.marker,
    ]
  );
  return result.rows[0].id;
}

async function upsertForecastCycle(client, cycle, userIds) {
  const result = await client.query(
    `
      insert into forecast_cycles
        (code, month, year, title, total_deadline_at, status, tone, note, template_file_name, created_by, created_at)
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      on conflict (code) do update set
        month = excluded.month,
        year = excluded.year,
        title = excluded.title,
        total_deadline_at = excluded.total_deadline_at,
        status = excluded.status,
        tone = excluded.tone,
        note = excluded.note,
        template_file_name = excluded.template_file_name,
        created_by = excluded.created_by,
        updated_at = now()
      returning id
    `,
    [
      cycle.code,
      cycle.month,
      cycle.year,
      cycle.title,
      cycle.totalDeadlineAt,
      normalizeForecastStatus(cycle.status, cycle.tone),
      cycle.tone,
      cycle.note,
      cycle.template,
      userIds.get(cycle.createdBy) || null,
      cycle.createdAt,
    ]
  );
  return result.rows[0].id;
}

async function upsertForecastTask(client, task, ids) {
  const result = await client.query(
    `
      insert into forecast_tasks
        (forecast_cycle_id, channel_id, owner_id, rsm_id, director_id, deadline_at, status, status_tone, due_text, progress)
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      on conflict (forecast_cycle_id, channel_id) do update set
        owner_id = excluded.owner_id,
        rsm_id = excluded.rsm_id,
        director_id = excluded.director_id,
        deadline_at = excluded.deadline_at,
        status = excluded.status,
        status_tone = excluded.status_tone,
        due_text = excluded.due_text,
        progress = excluded.progress,
        updated_at = now()
      returning id
    `,
    [
      ids.forecastCycles.get(task.forecastCycleId),
      ids.salesChannels.get(task.channelId),
      ids.users.get(task.ownerId) || null,
      ids.users.get(task.rsmId) || null,
      ids.users.get(task.directorId) || null,
      task.deadlineAt,
      task.status,
      task.statusTone,
      task.dueText,
      task.progress,
    ]
  );
  return result.rows[0].id;
}

async function countRows(client, table) {
  const result = await client.query(`select count(*)::int as count from ${table}`);
  return result.rows[0].count;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return sendMethodNotAllowed(res, ["POST"]);
  if (!assertSetupToken(req, res)) return undefined;

  try {
    const summary = await withTransaction(async (client) => {
      const ids = {
        roles: new Map(),
        users: new Map(),
        modules: new Map(),
        salesChannels: new Map(),
        forecastCycles: new Map(),
        forecastTasks: new Map(),
      };

      for (const role of mockDatabase.roles) {
        ids.roles.set(role.id, await upsertRole(client, role));
      }

      for (const user of mockDatabase.users) {
        ids.users.set(user.id, await upsertUser(client, user));
      }

      for (const module of mockDatabase.modules) {
        ids.modules.set(module.id, await upsertModule(client, module));
      }

      for (const userRole of mockDatabase.userRoles) {
        await client.query(
          `
            insert into user_roles (user_id, role_id, scope_note)
            values ($1, $2, $3)
            on conflict (user_id) do update set
              role_id = excluded.role_id,
              scope_note = excluded.scope_note
          `,
          [ids.users.get(userRole.userId), ids.roles.get(userRole.roleId), userRole.scopeNote]
        );
      }

      for (const permission of mockDatabase.rolePermissions) {
        await client.query(
          `
            insert into role_permissions (role_id, module_id, permission_level, data_scope)
            values ($1, $2, $3, $4)
            on conflict (role_id, module_id) do update set
              permission_level = excluded.permission_level,
              data_scope = excluded.data_scope,
              updated_at = now()
          `,
          [
            ids.roles.get(permission.roleId),
            ids.modules.get(permission.moduleId),
            permission.permissionLevel,
            permission.dataScope,
          ]
        );
      }

      for (const channel of mockDatabase.salesChannels) {
        ids.salesChannels.set(channel.id, await upsertSalesChannel(client, channel));
      }

      for (const assignment of mockDatabase.channelAssignments) {
        await client.query(
          `
            insert into channel_assignments (channel_id, user_id, role_code, effective_from)
            values ($1, $2, $3, $4)
            on conflict (channel_id, user_id, role_code, effective_from) do update set
              effective_to = excluded.effective_to
          `,
          [
            ids.salesChannels.get(assignment.channelId),
            ids.users.get(assignment.userId),
            assignment.roleCode,
            assignment.effectiveFrom,
          ]
        );
      }

      for (const cycle of mockDatabase.forecastCycles) {
        ids.forecastCycles.set(cycle.id, await upsertForecastCycle(client, cycle, ids.users));
      }

      for (const task of mockDatabase.forecastTasks) {
        ids.forecastTasks.set(task.id, await upsertForecastTask(client, task, ids));
        if (task.ownerId && ids.users.get(task.ownerId)) {
          await client.query(
            `
              insert into task_assignments (forecast_task_id, user_id, role_code, status, assigned_at)
              values ($1, $2, 'ASM', 'active', $3)
              on conflict (forecast_task_id, user_id, role_code) do update set
                status = 'active',
                updated_at = now()
            `,
            [ids.forecastTasks.get(task.id), ids.users.get(task.ownerId), task.deadlineAt]
          );
        }
      }

      for (const file of mockDatabase.forecastFiles) {
        const sourceTask = mockDatabase.forecastTasks.find((item) => item.id === file.forecastTaskId);
        await client.query(
          `
            insert into forecast_files
              (forecast_task_id, channel_id, asm_user_id, file_name, file_url, storage_path, file_size, version, uploaded_by, uploaded_at, note, status)
            values ($1, $2, $3, $4, $5, $5, $6, $7, $3, $8, $9, 'approved')
            on conflict (forecast_task_id, version) do update set
              channel_id = excluded.channel_id,
              asm_user_id = excluded.asm_user_id,
              file_name = excluded.file_name,
              file_url = excluded.file_url,
              storage_path = excluded.storage_path,
              file_size = excluded.file_size,
              uploaded_by = excluded.uploaded_by,
              uploaded_at = excluded.uploaded_at,
              note = excluded.note,
              status = excluded.status
          `,
          [
            ids.forecastTasks.get(file.forecastTaskId),
            ids.salesChannels.get(sourceTask?.channelId),
            ids.users.get(file.uploadedBy) || null,
            file.fileName,
            file.fileUrl,
            file.fileSize,
            file.version,
            file.uploadedAt,
            file.note,
          ]
        );
      }

      const activityLogs = [
        ...mockDatabase.activityLogs,
        ...mockDatabase.permissionActivityLogs.map((item) => ({
          id: item.id,
          actorId: "u-01",
          entityType: "permission",
          entityId: null,
          action: "permission_update",
          message: item.title,
          detail: item.detail,
          tone: item.tone,
          createdAtLabel: item.time,
        })),
      ];

      for (const log of activityLogs) {
        const existing = await client.query(
          "select id from activity_logs where metadata->>'sourceId' = $1 limit 1",
          [log.id]
        );
        if (existing.rowCount) continue;

        const entityId =
          log.entityType === "forecast_cycle"
            ? ids.forecastCycles.get(log.entityId)
            : log.entityType === "forecast_task"
              ? ids.forecastTasks.get(log.entityId)
              : null;

        await client.query(
          `
            insert into activity_logs (actor_id, entity_type, entity_id, action, message, metadata)
            values ($1, $2, $3, $4, $5, $6::jsonb)
          `,
          [
            ids.users.get(log.actorId) || null,
            log.entityType,
            entityId,
            log.action,
            log.message,
            JSON.stringify({
              sourceId: log.id,
              sourceEntityId: log.entityId,
              detail: log.detail,
              tone: log.tone,
              iconKey: log.iconKey,
              createdAtLabel: log.createdAtLabel,
            }),
          ]
        );
      }

      const tables = [
        "users",
        "roles",
        "user_roles",
        "modules",
        "role_permissions",
        "sales_channels",
        "channel_assignments",
        "forecast_cycles",
        "forecast_tasks",
        "forecast_files",
        "task_assignments",
        "approval_requests",
        "approval_request_files",
        "approval_events",
        "activity_logs",
      ];

      const counts = {};
      for (const table of tables) {
        counts[table] = await countRows(client, table);
      }

      return counts;
    });

    return sendJson(res, 200, {
      ok: true,
      message: "Mock data seeded into PostgreSQL.",
      counts: summary,
    });
  } catch (error) {
    return sendJson(res, 500, {
      ok: false,
      error: "seed_failed",
      message: error.message,
    });
  }
}

