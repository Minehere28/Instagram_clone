import { useState } from "react";

import { likePost } from "../services/interactionService";

function LikeButton({ postId, initialLiked = false, onLikeChange }) {
  const [liked, setLiked] = useState(initialLiked);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if (loading) return;

    const previous = liked;
    setLiked(true);
    onLikeChange?.(true);
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
    <button type="button" className="like-button" onClick={handleLike} disabled={loading || liked}>
      {liked ? "Liked" : "Like"}
    </button>
  );
}

export default LikeButton;
