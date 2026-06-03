import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

import CommentList from "../components/CommentList";
import ImageCarousel from "../components/ImageCarousel";
import LikeButton from "../components/LikeButton";
import Navbar from "../components/Navbar";
import { createComment } from "../services/interactionService";
import { getPostById } from "../services/postService";

function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reloadCommentsKey, setReloadCommentsKey] = useState(0);
  const commentInputRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    async function loadPost() {
      setLoading(true);
      setError("");
      try {
        const data = await getPostById(id);
        if (mounted) {
          setPost(data);
          setLikesCount(data.likes_count || 0);
          setCommentsCount(data.comments_count || 0);
        }
      } catch (_error) {
        if (mounted) {
          setError("Failed to load post detail.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadPost();

    return () => {
      mounted = false;
    };
  }, [id]);

  const [likesCount, setLikesCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const username = post?.user?.username || "unknown";
  const avatarFallback = username.charAt(0).toUpperCase() || "U";
  const createdTime = post?.created_at ? new Date(post.created_at).toLocaleString() : "just now";

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    if (!commentText.trim() || submitting || !post?.id) return;

    setSubmitting(true);
    const previous = commentsCount;
    // optimistic update
    setCommentsCount((c) => c + 1);
    try {
      await createComment(post.id, commentText.trim());
      setCommentText("");
      setReloadCommentsKey((prev) => prev + 1);
    } catch (_error) {
      // rollback on failure
      setCommentsCount(previous);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="feed-page">
      <Navbar />
      <main className="post-detail-page">
        {loading ? (
          <div className="loading-wrap">
            <div className="spinner" />
            <p>Loading post...</p>
          </div>
        ) : null}

        {!loading && error ? <p className="feed-error">{error}</p> : null}

        {!loading && !error && post ? (
          <article className="post-detail-card">
            <header className="post-header">
              <div className="post-user-meta">
                {post.user?.avatar_url ? (
                  <img src={post.user.avatar_url} alt={username} className="post-avatar" />
                ) : (
                  <div className="post-avatar post-avatar-fallback">{avatarFallback}</div>
                )}
                <div>
                  <Link to={`/profile/${username}`} className="post-username post-username-link">
                    <strong>{username}</strong>
                  </Link>
                  <p className="post-time">{createdTime}</p>
                </div>
              </div>
            </header>

            <ImageCarousel images={post.images || []} altPrefix="Post detail" />

            <div className="post-detail-body">
              <p className="post-caption">
                <Link
                  to={`/profile/${post.user?.username || "unknown"}`}
                  className="post-caption-username"
                >
                  <strong>{post.user?.username || "unknown"}</strong>
                </Link>{" "}
                {post.caption}
              </p>

              <div className="post-actions">
                <div className="action-with-count">
                  <LikeButton
                    postId={post.id}
                    initialLiked={Boolean(post.is_liked)}
                    onLikeChange={(next) => setLikesCount((prev) => prev + (next ? 1 : -1))}
                  />
                  <span className="action-count">{likesCount}</span>
                </div>
                <div className="action-with-count">
                  <button
                    type="button"
                    className="comment-button"
                    onClick={() => commentInputRef.current?.focus()}
                    aria-label="Comment"
                    title="Comment"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                  </button>
                  <span className="action-count">{commentsCount}</span>
                </div>
              </div>

              <CommentList postId={post.id} reloadKey={reloadCommentsKey} />

              <form className="comment-form" onSubmit={handleCommentSubmit}>
                <input
                  ref={commentInputRef}
                  type="text"
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(event) => setCommentText(event.target.value)}
                />
                <button type="submit" disabled={submitting}>
                  Post
                </button>
              </form>
            </div>
          </article>
        ) : null}
      </main>
    </div>
  );
}

export default PostDetailPage;
