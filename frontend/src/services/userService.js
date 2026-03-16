import api from "./api";
import { getCurrentUser } from "./authService";
import { getPosts } from "./postService";

export async function getProfileById(id) {
  const response = await api.get(`users/profile/${id}`);
  return response.data?.data || response.data;
}

export async function findUserByUsername(username) {
  const current = getCurrentUser();
  if (current?.username === username) {
    return current;
  }

  const posts = await getPosts();
  const matchedPost = posts.find((post) => post.user?.username === username);
  return matchedPost?.user || null;
}

export async function getProfileByUsername(username) {
  const user = await findUserByUsername(username);
  if (!user?.id) {
    throw new Error("User not found in current feed context.");
  }

  const profile = await getProfileById(user.id);
  const userPosts = await getPosts({ user: user.id });

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
