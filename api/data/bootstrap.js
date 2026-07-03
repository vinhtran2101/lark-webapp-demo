import { query } from "../../server/lib/db.js";
import { requireAuth } from "../../server/lib/auth.js";
import { sendJson, sendMethodNotAllowed } from "../../server/lib/http.js";

async function getRows(sql, params = []) {
  const result = await query(sql, params);
  return result.rows;
}

export default async function handler(req, res) {
  if (req.method !== "GET") return sendMethodNotAllowed(res, ["GET"]);
  res.setHeader("Cache-Control", "no-store, max-age=0");
  const guard = await requireAuth(req, res);
  if (!guard.ok) return;

  try {
    const [
      users,
      roles,
      userRoles,
      modules,
      rolePermissions,
      salesChannels,
      channelAssignments,
      forecastCycles,
      forecastTasks,
      forecastFiles,
      taskAssignments,
      approvalRequests,
      approvalRequestFiles,
      approvalEvents,
      activityLogs,
    ] = await Promise.all([
      getRows("select * from users order by employee_code"),
      getRows("select * from roles order by code"),
      getRows("select * from user_roles order by created_at desc"),
      getRows("select * from modules order by sort_order"),
      getRows("select * from role_permissions order by created_at"),
      getRows("select * from sales_channels order by code"),
      getRows("select * from channel_assignments order by effective_from, role_code"),
      getRows("select * from forecast_cycles order by year desc, month desc"),
      getRows("select * from forecast_tasks order by deadline_at"),
      getRows("select * from forecast_files order by uploaded_at desc"),
      getRows("select * from task_assignments order by assigned_at desc"),
      getRows("select * from approval_requests order by submitted_at desc"),
      getRows("select * from approval_request_files order by created_at desc"),
      getRows("select * from approval_events order by occurred_at desc limit 100"),
      getRows("select * from activity_logs order by created_at desc limit 50"),
    ]);

    return sendJson(res, 200, {
      ok: true,
      data: {
        users,
        roles,
        userRoles,
        modules,
        rolePermissions,
        salesChannels,
        channelAssignments,
        forecastCycles,
        forecastTasks,
        forecastFiles,
        taskAssignments,
        approvalRequests,
        approvalRequestFiles,
        approvalEvents,
        activityLogs,
      },
    });
  } catch (error) {
    return sendJson(res, 500, {
      ok: false,
      error: "bootstrap_failed",
      message: error.message,
    });
  }
}

