import { query } from "./db.js";
import { getTaskContext, TASK_STATUSES, normalizeTaskStatus, taskStatusTone } from "./forecastService.js";

const DEFAULT_BUCKET = "forecast-files";

function getStorageConfig() {
  const supabaseUrl = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || "";
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || DEFAULT_BUCKET;
  return { supabaseUrl, serviceRoleKey, bucket };
}

export function isStorageConfigured() {
  const { supabaseUrl, serviceRoleKey } = getStorageConfig();
  return Boolean(supabaseUrl && serviceRoleKey);
}

function safeFileName(value = "forecast.xlsx") {
  const normalized = String(value || "forecast.xlsx")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
  return normalized || "forecast.xlsx";
}

function buildStoragePath({ cycleCode, taskId, version, fileName }) {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  return `forecast/${cycleCode || "cycle"}/${taskId}/v${version}/${stamp}-${safeFileName(fileName)}`;
}

async function supabaseStorageFetch(path, options = {}) {
  const { supabaseUrl, serviceRoleKey } = getStorageConfig();
  const response = await fetch(`${supabaseUrl}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${serviceRoleKey}`,
      apikey: serviceRoleKey,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.error) {
    throw new Error(payload.message || payload.error || `Supabase Storage error ${response.status}`);
  }
  return payload;
}

async function createSignedUploadUrl(storagePath) {
  const { bucket } = getStorageConfig();
  return supabaseStorageFetch(`/storage/v1/object/upload/sign/${bucket}/${encodeStoragePath(storagePath)}`, {
    method: "POST",
    body: JSON.stringify({}),
  });
}

function encodeStoragePath(storagePath = "") {
  return String(storagePath)
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
}

export async function createSignedDownloadUrl(storagePath, expiresIn = 60 * 10) {
  if (!isStorageConfigured()) {
    return { mode: "metadata-only", signedUrl: storagePath || "" };
  }

  const { bucket, supabaseUrl } = getStorageConfig();
  const payload = await supabaseStorageFetch(`/storage/v1/object/sign/${bucket}/${encodeStoragePath(storagePath)}`, {
    method: "POST",
    body: JSON.stringify({ expiresIn }),
  });
  const signedUrl = payload.signedURL || payload.signedUrl || payload.url || "";
  return {
    mode: "signed-url",
    signedUrl: signedUrl.startsWith("http") ? signedUrl : `${supabaseUrl}/storage/v1${signedUrl}`,
    expiresIn,
  };
}

export async function getNextFileVersion(client, taskId) {
  const result = await client.query(
    "select coalesce(max(version), 0)::int + 1 as version from forecast_files where forecast_task_id = $1",
    [taskId]
  );
  return result.rows[0]?.version || 1;
}

export async function createUploadIntent(client, { taskId, fileName, mimeType = "", actorId = null }) {
  const { task } = await getTaskContext(client, taskId);
  const status = normalizeTaskStatus(task.status);
  if ([TASK_STATUSES.SUBMITTED, TASK_STATUSES.IN_APPROVAL].includes(status)) {
    const error = new Error("Task đang trong vòng duyệt, không thể upload file mới.");
    error.statusCode = 409;
    throw error;
  }

  const version = await getNextFileVersion(client, task.id);
  const storagePath = buildStoragePath({
    cycleCode: task.cycle_code,
    taskId: task.id,
    version,
    fileName,
  });

  if (!isStorageConfigured()) {
    return {
      mode: "metadata-only",
      bucket: getStorageConfig().bucket,
      storagePath,
      version,
      fileName,
      mimeType,
      message: "SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY chưa cấu hình, chỉ trả về metadata upload intent.",
    };
  }

  const signed = await createSignedUploadUrl(storagePath);
  const { supabaseUrl } = getStorageConfig();
  const signedUrl = signed.url || signed.signedURL || signed.signedUrl || "";
  return {
    mode: "signed-upload",
    bucket: getStorageConfig().bucket,
    storagePath,
    version,
    fileName,
    mimeType,
    upload: signed,
    signedUrl: signedUrl.startsWith("http") ? signedUrl : `${supabaseUrl}/storage/v1${signedUrl}`,
    token: signed.token || "",
  };
}

export async function saveFileMetadata(client, {
  taskId,
  fileName,
  fileSize = "",
  mimeType = "",
  storagePath = "",
  fileUrl = "",
  version,
  asmUserId = null,
  actorId = null,
  note = "",
}) {
  const { task } = await getTaskContext(client, taskId);
  const status = normalizeTaskStatus(task.status);
  if ([TASK_STATUSES.SUBMITTED, TASK_STATUSES.IN_APPROVAL].includes(status)) {
    const error = new Error("Task đang trong vòng duyệt, không thể thay file.");
    error.statusCode = 409;
    throw error;
  }

  const nextVersion = version || (await getNextFileVersion(client, task.id));
  const finalStoragePath = storagePath || buildStoragePath({
    cycleCode: task.cycle_code,
    taskId: task.id,
    version: nextVersion,
    fileName,
  });
  const finalUrl = fileUrl || finalStoragePath || `/mock/files/${safeFileName(fileName)}`;
  const uploader = asmUserId || actorId || task.owner_id || null;

  const result = await client.query(
    `
      insert into forecast_files
        (forecast_task_id, channel_id, asm_user_id, file_name, file_url, storage_path, file_size, mime_type, version, uploaded_by, note, status)
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $3, $10, 'draft')
      on conflict (forecast_task_id, version) do update set
        channel_id = excluded.channel_id,
        asm_user_id = excluded.asm_user_id,
        file_name = excluded.file_name,
        file_url = excluded.file_url,
        storage_path = excluded.storage_path,
        file_size = excluded.file_size,
        mime_type = excluded.mime_type,
        uploaded_by = excluded.uploaded_by,
        uploaded_at = now(),
        note = excluded.note,
        status = 'draft'
      returning *
    `,
    [
      task.id,
      task.channel_id,
      uploader,
      fileName,
      finalUrl,
      finalStoragePath,
      fileSize,
      mimeType,
      nextVersion,
      note,
    ]
  );

  await client.query(
    `
      update forecast_tasks
      set current_file_version = $2,
          status = case when status in ('draft', 'need_revision') then 'assigned' else status end,
          status_tone = $3,
          due_text = $4,
          progress = greatest(progress, 40),
          updated_at = now()
      where id = $1
    `,
    [task.id, nextVersion, taskStatusTone(TASK_STATUSES.ASSIGNED), "Đã có file nháp, chờ ASM submit"]
  );

  await client.query(
    `
      insert into activity_logs (actor_id, entity_type, entity_id, action, message, metadata)
      values ($1, 'forecast_task', $2, 'file_metadata_saved', $3, $4::jsonb)
    `,
    [
      actorId || uploader,
      task.id,
      `${task.channel_name} đã upload file Forecast`,
      JSON.stringify({
        detail: `${fileName} v${nextVersion}`,
        tone: "green",
        iconKey: "fileText",
        createdAtLabel: "Vừa xong",
      }),
    ]
  );

  return result.rows[0];
}

export async function deleteDraftFileMetadata(client, { fileId, actorId = null }) {
  const result = await client.query(
    `
      select ff.*, ft.id as task_id, ft.current_file_version, sc.name as channel_name
      from forecast_files ff
      join forecast_tasks ft on ft.id = ff.forecast_task_id
      left join sales_channels sc on sc.id = ff.channel_id
      where ff.id::text = $1
      limit 1
    `,
    [fileId]
  );
  const file = result.rows[0];
  if (!file) {
    const error = new Error("Khong tim thay file Forecast.");
    error.statusCode = 404;
    throw error;
  }

  if (file.status !== "draft") {
    const error = new Error("Chi duoc xoa file nhap. File da submit/duyet can giu lai de doi soat lich su.");
    error.statusCode = 409;
    throw error;
  }

  await client.query("delete from forecast_files where id = $1", [file.id]);

  const latest = await client.query(
    "select max(version)::int as version from forecast_files where forecast_task_id = $1",
    [file.forecast_task_id]
  );
  const nextVersion = latest.rows[0]?.version || null;

  await client.query(
    `
      update forecast_tasks
      set current_file_version = $2,
          due_text = case when $2 is null then 'Cho ASM cap nhat file' else due_text end,
          progress = case when $2 is null then least(progress, 30) else progress end,
          updated_at = now()
      where id = $1
    `,
    [file.forecast_task_id, nextVersion]
  );

  await client.query(
    `
      insert into activity_logs (actor_id, entity_type, entity_id, action, message, metadata)
      values ($1, 'forecast_task', $2, 'file_metadata_deleted', $3, $4::jsonb)
    `,
    [
      actorId || file.uploaded_by || file.asm_user_id,
      file.forecast_task_id,
      `${file.channel_name || "Task Forecast"} da xoa file nhap`,
      JSON.stringify({
        detail: `${file.file_name} v${file.version}`,
        tone: "red",
        iconKey: "trash",
        createdAtLabel: "Vua xong",
      }),
    ]
  );

  return {
    id: file.id,
    taskId: file.forecast_task_id,
    fileName: file.file_name,
    version: file.version,
    nextFileVersion: nextVersion,
  };
}

export async function getFileDownloadIntent(fileId) {
  const result = await query("select * from forecast_files where id::text = $1 limit 1", [fileId]);
  const file = result.rows[0];
  if (!file) {
    const error = new Error("Không tìm thấy file Forecast.");
    error.statusCode = 404;
    throw error;
  }
  const signed = await createSignedDownloadUrl(file.storage_path || file.file_url);
  return { file, ...signed };
}
