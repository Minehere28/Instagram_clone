import api from "./api";

export async function getPosts(params = {}) {
  const response = await api.get("posts/", { params });
  const payload = response.data?.data || response.data;

  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.results)) {
    return payload.results;
  }

  return [];
}

export async function createPost(formData) {
  const response = await api.post("posts/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data?.data || response.data;
}
