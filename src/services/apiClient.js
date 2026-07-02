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
