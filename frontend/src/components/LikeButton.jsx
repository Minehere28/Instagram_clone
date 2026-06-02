import { useState } from "react";

import { likePost } from "../services/interactionService";

function LikeButton({ postId, initialLiked = false, onLikeChange }) {
  const [liked, setLiked] = useState(initialLiked);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if (loading) return;

    const previous = liked;
    const nextState = !previous;

    setLiked(nextState);
    onLikeChange?.(nextState);
    setLoading(true);

    try {
      await likePost(postId);
    } catch (_error) {
      setLiked(previous);
      onLikeChange?.(previous);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      className={`like-button ${liked ? "is-liked" : ""}`}
      onClick={handleLike}
      disabled={loading}
      aria-label={liked ? "Liked" : "Like"}
    >
      {liked ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#E11D48" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
      )}
    </button>
  );
}

export default LikeButton;
