import api from "./api";

export async function likePost(postId) {
  const response = await api.post("likes/", { post_id: postId });
  return response.data?.data || response.data;
}

export async function getComments(postId) {
  const response = await api.get("comments/", { params: { post: postId } });
  const payload = response.data?.data || response.data;
  if (Array.isArray(payload)) {
    return payload;
  }
  if (Array.isArray(payload?.results)) {
    return payload.results;
  }
  return [];
}

export async function createComment(postId, content) {
  const response = await api.post("comments/", {
    post: postId,
    content,
  });
  return response.data?.data || response.data;
}
