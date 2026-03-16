import api from "./api";

export async function getNotifications() {
  const response = await api.get("notifications/");
  const payload = response.data?.data || response.data;
  return Array.isArray(payload) ? payload : [];
}
