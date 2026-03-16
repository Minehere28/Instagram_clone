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
  const image = formData.get("image");
  if (image) {
    formData.append("uploaded_images", image);
  }

  const response = await api.post("posts/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data?.data || response.data;
}

export async function getPostById(id) {
  const response = await api.get(`posts/${id}`);
  return response.data?.data || response.data;
}
