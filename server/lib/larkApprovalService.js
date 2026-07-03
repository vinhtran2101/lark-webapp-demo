import crypto from "node:crypto";

function getOpenBaseUrl() {
  return (process.env.LARK_OPEN_BASE_URL || "https://open.larksuite.com").replace(/\/$/, "");
}

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    const error = new Error(`Thiếu biến môi trường ${name}.`);
    error.statusCode = 422;
    throw error;
  }
  return value;
}

async function readLarkJson(response, fallbackMessage) {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || (payload.code !== undefined && payload.code !== 0)) {
    const error = new Error(payload.msg || payload.message || fallbackMessage);
    error.statusCode = response.status || 502;
    error.payload = payload;
    throw error;
  }
  return payload;
}

export async function getTenantAccessToken() {
  const response = await fetch(`${getOpenBaseUrl()}/open-apis/auth/v3/tenant_access_token/internal`, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      app_id: requiredEnv("LARK_APP_ID"),
      app_secret: requiredEnv("LARK_APP_SECRET"),
    }),
  });
  const payload = await readLarkJson(response, "Không lấy được tenant_access_token từ Lark.");
  const token = payload.tenant_access_token || payload.data?.tenant_access_token;
  if (!token) throw new Error("Lark không trả tenant_access_token.");
  return token;
}

export function buildApprovalAppLink(instanceCode) {
  const appId = process.env.LARK_APPROVAL_APP_ID || "cli_9c90fc38e07a9101";
  const mobilePath = encodeURIComponent(`pages/detail/index?instanceId=${instanceCode}`);
  return `https://applink.larksuite.com/client/mini_program/open?appId=${appId}&path=${mobilePath}`;
}

export function mapLarkApprovalStatus(status) {
  const value = String(status || "PENDING").toUpperCase();
  const map = {
    PENDING: "pending",
    APPROVED: "approved",
    REJECTED: "rejected",
    CANCELED: "canceled",
    CANCELLED: "canceled",
    DELETED: "canceled",
  };
  return map[value] || "pending";
}

function nodeKey(name, fallback) {
  return process.env[name] || fallback;
}

export function getForecastNodeKeys() {
  return {
    rsm: nodeKey("LARK_FORECAST_NODE_RSM", "KD01_RSM_REVIEW"),
    gdkd: nodeKey("LARK_FORECAST_NODE_GDKD", "KD01_GDKD_REVIEW"),
    supply: nodeKey("LARK_FORECAST_NODE_SUPPLY", "KD01_SUPPLY_REVIEW"),
    finance: nodeKey("LARK_FORECAST_NODE_FINANCE", "KD01_FINANCE_REVIEW"),
    bi: nodeKey("LARK_FORECAST_NODE_BI", "KD01_BI_REVIEW"),
    ceo: nodeKey("LARK_FORECAST_NODE_CEO", "KD01_CEO_APPROVAL"),
  };
}

export function buildForecastNodeApprovers(snapshot) {
  const nodes = getForecastNodeKeys();
  const pick = (users) => (Array.isArray(users) ? users : [users]).filter(Boolean).map((user) => user.larkOpenId).filter(Boolean);
  return [
    { key: nodes.rsm, value: pick(snapshot.rsm) },
    { key: nodes.gdkd, value: pick(snapshot.gdkd) },
    { key: nodes.supply, value: pick(snapshot.appraisal?.supply) },
    { key: nodes.finance, value: pick(snapshot.appraisal?.finance) },
    { key: nodes.bi, value: pick(snapshot.appraisal?.bi) },
    { key: nodes.ceo, value: pick(snapshot.ceo) },
  ].filter((node) => node.value.length);
}

export function buildForecastApprovalForm({ snapshot, files, appUrl }) {
  const fileSummary = files.map((file) => `${file.file_name} (v${file.version})`).join("\n");
  return [
    { id: "forecast_cycle", type: "input", name: "Kỳ Forecast", value: snapshot.cycle.title },
    { id: "channel", type: "input", name: "Kênh", value: snapshot.channel.name },
    { id: "deadline", type: "input", name: "Deadline", value: new Date(snapshot.task.deadlineAt).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }) },
    { id: "asm", type: "input", name: "ASM phụ trách", value: snapshot.asmUsers.map((user) => user.name).join(", ") },
    { id: "files", type: "textarea", name: "File đã nộp", value: fileSummary },
    { id: "task_link", type: "input", name: "Link KD01", value: appUrl },
  ];
}

export async function createForecastApprovalInstance({ requesterOpenId, requesterUserId, formValues, nodeApprovers, title }) {
  const approvalCode = process.env.LARK_FORECAST_APPROVAL_CODE;
  const isDryRun = String(process.env.LARK_APPROVAL_DRY_RUN || "").toLowerCase() === "true";
  if (!approvalCode && !isDryRun) {
    const error = new Error("Thiếu LARK_FORECAST_APPROVAL_CODE để tạo Lark Approval.");
    error.statusCode = 422;
    throw error;
  }
  if (!requesterOpenId && !requesterUserId && !isDryRun) {
    const error = new Error("Người submit chưa có Lark open_id/user_id.");
    error.statusCode = 422;
    throw error;
  }

  if (isDryRun) {
    const instanceCode = `dry_${crypto.randomUUID()}`;
    return {
      approvalCode: approvalCode || "dry_run_forecast",
      instanceCode,
      status: "pending",
      appLink: buildApprovalAppLink(instanceCode),
      raw: { dryRun: true },
    };
  }

  const token = await getTenantAccessToken();
  const response = await fetch(`${getOpenBaseUrl()}/open-apis/approval/v4/instances?user_id_type=open_id`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      approval_code: approvalCode,
      ...(requesterOpenId ? { open_id: requesterOpenId } : { user_id: requesterUserId }),
      form: JSON.stringify(formValues),
      uuid: crypto.randomUUID(),
      ...(title
        ? {
            title: "@i18n@instance_title",
            title_display_method: 1,
            i18n_resources: [
              {
                locale: "en-US",
                is_default: true,
                texts: [{ key: "@i18n@instance_title", value: title }],
              },
            ],
          }
        : {}),
      node_approver_open_id_list: nodeApprovers,
    }),
  });
  const payload = await readLarkJson(response, "Tạo Lark Approval instance thất bại.");
  const instanceCode = payload.data?.instance_code || payload.instance_code;
  if (!instanceCode) throw new Error("Lark không trả instance_code.");

  return {
    approvalCode,
    instanceCode,
    status: "pending",
    appLink: buildApprovalAppLink(instanceCode),
    raw: payload.data || payload,
  };
}

export async function getForecastApprovalInstance(instanceCode) {
  if (String(instanceCode || "").startsWith("dry_")) {
    return { status: "PENDING", instance_code: instanceCode, dryRun: true };
  }

  const token = await getTenantAccessToken();
  const response = await fetch(`${getOpenBaseUrl()}/open-apis/approval/v4/instances/${encodeURIComponent(instanceCode)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const payload = await readLarkJson(response, "Không lấy được trạng thái Lark Approval.");
  return payload.data || payload;
}
