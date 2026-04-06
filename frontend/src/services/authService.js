import api from "./api";

export async function login(credentials) {
  const response = await api.post("auth/login", credentials);
  const payload = response.data?.data || response.data;

  if (payload?.access) {
    localStorage.setItem("access_token", payload.access);
  }
  if (payload?.refresh) {
    localStorage.setItem("refresh_token", payload.refresh);
  }
  if (payload?.user) {
    localStorage.setItem("current_user", JSON.stringify(payload.user));
  }

  return payload;
}

export async function register(data) {
  const response = await api.post("auth/register", data);
  return response.data?.data || response.data;
}

export async function refreshToken(refresh) {
  const response = await api.post("auth/refresh", { refresh });
  return response.data?.data || response.data;
}

export async function logout() {
  const refresh = localStorage.getItem("refresh_token");
  try {
    if (refresh) {
      await api.post("auth/logout", { refresh });
    }
  } finally {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("current_user");
  }
}

export function getCurrentUser() {
  const raw = localStorage.getItem("current_user");
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch (_error) {
    return null;
  }
}
