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

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    if (!commentText.trim() || submitting || !post?.id) return;

    setSubmitting(true);
    try {
      await createComment(post.id, commentText.trim());
      setCommentText("");
      setReloadCommentsKey((prev) => prev + 1);
    } catch (_error) {
      // Keep simple for now.
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
