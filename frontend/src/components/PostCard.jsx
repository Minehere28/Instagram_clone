import { useEffect, useState } from "react";

import { createComment, getComments } from "../services/interactionService";
import CommentList from "./CommentList";
import LikeButton from "./LikeButton";

function PostCard({ post }) {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadComments() {
      try {
        const data = await getComments(post.id);
        if (mounted) {
          setComments(data);
        }
      } catch (_error) {
        if (mounted) {
          setComments([]);
        }
      }
    }

    loadComments();

    return () => {
      mounted = false;
    };
  }, [post.id]);

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    if (!commentText.trim() || submitting) return;

    setSubmitting(true);
    try {
      const created = await createComment(post.id, commentText.trim());
      setComments((prev) => [...prev, created]);
      setCommentText("");
    } catch (_error) {
      // Keep UI simple for now.
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <article className="post-card">
      <header className="post-header">
        <strong>{post.user?.username || "unknown"}</strong>
      </header>

      {post.images?.length ? (
        <img
          src={post.images[0]?.image?.url || post.images[0]?.image_url}
          alt="post"
          className="post-image"
        />
      ) : null}

      <div className="post-body">
        <p className="post-caption">{post.caption}</p>
        {post.hashtags?.length ? (
          <p className="post-hashtags">
            {post.hashtags.map((tag) => (
              <span key={`${post.id}-${tag}`}>#{tag} </span>
            ))}
          </p>
        ) : null}

        <LikeButton postId={post.id} />

        <section className="post-comments">
          <CommentList comments={comments} />
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <input
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
