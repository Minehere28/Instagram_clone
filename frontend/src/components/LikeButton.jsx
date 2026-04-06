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
      {liked ? "❤️" : "🤍"}
    </button>
  );
}

export default LikeButton;
