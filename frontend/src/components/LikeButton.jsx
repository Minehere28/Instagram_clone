import { useEffect, useState } from "react";

import { likePost } from "../services/interactionService";

function LikeButton({ postId, initialLiked = false, onLikeChange }) {
  const [liked, setLiked] = useState(initialLiked);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLiked(initialLiked);
  }, [initialLiked]);

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
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
      )}
    </button>
  );
}

export default LikeButton;
