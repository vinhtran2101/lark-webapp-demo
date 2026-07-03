import { withTransaction } from "../server/lib/db.js";
import { getBearerToken, readJsonBody, sendJson, sendMethodNotAllowed } from "../server/lib/http.js";
import { requireModulePermission } from "../server/lib/auth.js";
import { assignTaskAsms } from "../server/lib/forecastService.js";
import { createUploadIntent, getFileDownloadIntent, saveFileMetadata } from "../server/lib/fileService.js";
import { submitTaskForApproval, syncApprovalRequest, syncPendingApprovalRequests } from "../server/lib/approvalService.js";

function getQuery(req) {
  const url = new URL(req.url || "", "http://localhost");
  return Object.fromEntries(url.searchParams.entries());
}

function getRoute(req) {
  const query = req.query || getQuery(req);
  return query.route || query.action || "";
}

function hasSetupToken(req) {
  const configuredToken = process.env.ADMIN_SETUP_TOKEN;
  if (!configuredToken) return false;
  const requestToken = req.headers["x-setup-token"] || getBearerToken(req);
  return requestToken === configuredToken;
}

async function guardModule(req, res, moduleName, levels = ["full", "scoped"]) {
  const guard = await requireModulePermission(req, res, moduleName, levels);
  return guard.ok ? guard : null;
}

async function handleAssignTask(req, res) {
  if (req.method !== "POST") return sendMethodNotAllowed(res, ["POST"]);
  const guard = await guardModule(req, res, "task_assignment");
  if (!guard) return;
  const body = await readJsonBody(req);
  const task = await withTransaction((client) =>
    assignTaskAsms(client, {
      taskId: body.taskId,
      asmUserIds: body.asmUserIds || (body.asmUserId ? [body.asmUserId] : []),
      actorId: guard.auth?.user?.id || null,
      note: body.note || "",
    })
  );
  return sendJson(res, 200, { ok: true, task });
}

async function handleCreateUploadIntent(req, res) {
  if (req.method !== "POST") return sendMethodNotAllowed(res, ["POST"]);
  const guard = await guardModule(req, res, "forecast_submit");
  if (!guard) return;
  const body = await readJsonBody(req);
  const intent = await withTransaction((client) =>
    createUploadIntent(client, {
      taskId: body.taskId,
      fileName: body.fileName,
      mimeType: body.mimeType || "",
      actorId: guard.auth?.user?.id || null,
    })
  );
  return sendJson(res, 200, { ok: true, intent });
}

async function handleSaveFile(req, res) {
  if (req.method !== "POST") return sendMethodNotAllowed(res, ["POST"]);
  const guard = await guardModule(req, res, "forecast_submit");
  if (!guard) return;
  const body = await readJsonBody(req);
  const file = await withTransaction((client) =>
    saveFileMetadata(client, {
      ...body,
      actorId: guard.auth?.user?.id || null,
    })
  );
  return sendJson(res, 200, { ok: true, file });
}

async function handleSubmitTask(req, res) {
  if (req.method !== "POST") return sendMethodNotAllowed(res, ["POST"]);
  const guard = await guardModule(req, res, "forecast_submit");
  if (!guard) return;
  const body = await readJsonBody(req);
  const result = await submitTaskForApproval({
    taskId: body.taskId,
    fileIds: body.fileIds || [],
    actorId: guard.auth?.user?.id || null,
    req,
  });
  return sendJson(res, 200, { ok: true, approval: result });
}

async function handleSyncApproval(req, res) {
  if (!["POST", "GET"].includes(req.method)) return sendMethodNotAllowed(res, ["POST", "GET"]);
  if (!hasSetupToken(req)) {
    const guard = await guardModule(req, res, "sales_approval", ["full", "scoped"]);
    if (!guard) return;
  }

  const query = req.query || getQuery(req);
  const body = req.method === "POST" ? await readJsonBody(req) : {};
  const approvalRequestId = body.approvalRequestId || query.approvalRequestId || "";
  const result = approvalRequestId
    ? await syncApprovalRequest(approvalRequestId)
    : await syncPendingApprovalRequests({ limit: Number(body.limit || query.limit || 20) });
  return sendJson(res, 200, { ok: true, result });
}

async function handleDownloadIntent(req, res) {
  if (req.method !== "GET") return sendMethodNotAllowed(res, ["GET"]);
  const guard = await guardModule(req, res, "forecast_submit", ["full", "scoped", "view"]);
  if (!guard) return;
  const query = req.query || getQuery(req);
  const intent = await getFileDownloadIntent(query.fileId);
  return sendJson(res, 200, { ok: true, intent });
}

export default async function handler(req, res) {
  const route = getRoute(req);

  try {
    if (route === "assign-task") return handleAssignTask(req, res);
    if (route === "create-upload-intent") return handleCreateUploadIntent(req, res);
    if (route === "save-file") return handleSaveFile(req, res);
    if (route === "submit-task") return handleSubmitTask(req, res);
    if (route === "sync-approval") return handleSyncApproval(req, res);
    if (route === "download-intent") return handleDownloadIntent(req, res);

    return sendJson(res, 404, {
      ok: false,
      error: "forecast_route_not_found",
      routes: ["assign-task", "create-upload-intent", "save-file", "submit-task", "sync-approval", "download-intent"],
    });
  } catch (error) {
    return sendJson(res, error.statusCode || 500, {
      ok: false,
      error: "forecast_api_failed",
      message: error.message,
      details: error.details || undefined,
    });
  }
}
