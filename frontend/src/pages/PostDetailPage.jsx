import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import CommentList from "../components/CommentList";
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

  const postImage = post?.images?.[0]?.image?.url || post?.images?.[0]?.image_url;

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
            {postImage ? <img src={postImage} alt="post detail" className="post-detail-image" /> : null}

            <div className="post-detail-body">
              <p className="post-caption">
                <strong>{post.user?.username || "unknown"}</strong> {post.caption}
              </p>

              <div className="post-actions">
                <LikeButton postId={post.id} />
                <button
                  type="button"
                  className="comment-button"
                  onClick={() => commentInputRef.current?.focus()}
                >
                  Comment
                </button>
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
