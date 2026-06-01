import api from "./api";
import { getPosts } from "./postService";

export async function getProfileById(id) {
  const response = await api.get(`users/profile/${id}`);
  return response.data?.data || response.data;
}

export async function getProfileByUsername(username) {
  const response = await api.get(`users/profile/username/${username}`);
  const profile = response.data?.data || response.data;
  const user = profile.user;
  const userPosts = user?.id ? await getPosts({ user: user.id }) : [];

  return {
    user,
    profile,
    posts: userPosts,
  };
}

export async function followUser(userId) {
  const response = await api.post(`users/follow/${userId}`);
  return response.data?.data || response.data;
}

export async function unfollowUser(userId) {
  const response = await api.post(`users/unfollow/${userId}`);
  return response.data?.data || response.data;
}

export async function uploadAvatar(formData) {
  const response = await api.post(`users/profile/avatar`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data?.data || response.data;
}

export async function updateBio(bio) {
  const response = await api.patch("users/profile/bio", { bio });
  return response.data?.data || response.data;
}
