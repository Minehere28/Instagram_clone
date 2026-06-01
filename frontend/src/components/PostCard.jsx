import { useRef, useState } from "react";
import { Link } from "react-router-dom";

import { createComment } from "../services/interactionService";
import CommentList from "./CommentList";
import ImageCarousel from "./ImageCarousel";
import LikeButton from "./LikeButton";

function PostCard({ post }) {
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reloadCommentsKey, setReloadCommentsKey] = useState(0);
  const commentInputRef = useRef(null);

  const username = post.user?.username || "unknown";
  const createdTime = post.created_at
    ? new Date(post.created_at).toLocaleString()
    : "just now";
  const avatarFallback = username.charAt(0).toUpperCase() || "U";

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    if (!commentText.trim() || submitting) return;

    setSubmitting(true);
    try {
      await createComment(post.id, commentText.trim());
      setCommentText("");
      setReloadCommentsKey((prev) => prev + 1);
    } catch (_error) {
      // Keep UI simple for now.
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <article className="post-card">
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

      <ImageCarousel images={post.images || []} altPrefix={`Post by ${username}`} />

      <div className="post-body">
        <div className="post-actions">
          <div className="action-with-count">
            <LikeButton postId={post.id} initialLiked={Boolean(post.is_liked)} />
            <span className="action-count">{post.likes_count || 0}</span>
          </div>
          <div className="action-with-count">
            <button
              type="button"
              className="comment-button"
              onClick={() => commentInputRef.current?.focus()}
            >
              Comment
            </button>
            <span className="action-count">{post.comments_count || 0}</span>
          </div>
        </div>

        <p className="post-caption">
          <Link to={`/profile/${username}`} className="post-caption-username">
            <strong>{username}</strong>
          </Link>{" "}
          {post.caption}
        </p>

        {post.hashtags?.length ? (
          <p className="post-hashtags">
            {post.hashtags.map((tag) => (
              <span key={`${post.id}-${tag}`}>#{tag} </span>
            ))}
          </p>
        ) : null}

        <section className="post-comments">
          <CommentList postId={post.id} reloadKey={reloadCommentsKey} />
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <input
              ref={commentInputRef}
              type="text"
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              placeholder="Write a comment..."
            />
            <button type="submit" disabled={submitting}>
              Post
            </button>
          </form>
        </section>
      </div>
    </article>
  );
}

export default PostCard;
