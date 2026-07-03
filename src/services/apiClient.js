export async function requestJson(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.ok === false) {
    throw new Error(payload.message || `request_failed_${response.status}`);
  }
  return payload;
}

export async function fetchAuthState() {
  const payload = await requestJson(`/api/auth/me?t=${Date.now()}`, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  return payload.auth || {
    required: false,
    configured: false,
    authenticated: false,
    mode: "mock",
  };
}

export async function fetchBootstrapData() {
  const payload = await requestJson(`/api/data/bootstrap?t=${Date.now()}`, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  return payload.data;
}

export async function assignForecastTask(taskId, asmUserIds, note = "") {
  return requestJson("/api/forecast?route=assign-task", {
    method: "POST",
    body: JSON.stringify({ taskId, asmUserIds, note }),
  });
}

export async function createForecastUploadIntent({ taskId, fileName, mimeType = "" }) {
  return requestJson("/api/forecast?route=create-upload-intent", {
    method: "POST",
    body: JSON.stringify({ taskId, fileName, mimeType }),
  });
}

export async function saveForecastFileMetadata(payload) {
  return requestJson("/api/forecast?route=save-file", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function deleteForecastFileMetadata(fileId) {
  return requestJson("/api/forecast?route=delete-file", {
    method: "POST",
    body: JSON.stringify({ fileId }),
  });
}

export async function submitForecastTask(taskId, fileIds = []) {
  return requestJson("/api/forecast?route=submit-task", {
    method: "POST",
    body: JSON.stringify({ taskId, fileIds }),
  });
}

export async function syncForecastApprovals(approvalRequestId = "") {
  return requestJson("/api/forecast?route=sync-approval", {
    method: "POST",
    body: JSON.stringify({ approvalRequestId }),
  });
}
