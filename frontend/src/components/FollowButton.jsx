import { useState } from "react";

import { followUser, unfollowUser } from "../services/userService";

function FollowButton({ targetUserId, initialFollowing = false, onFollowChange }) {
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading || !targetUserId) return;

    const previous = following;
    const next = !previous;
    setFollowing(next);
    onFollowChange?.(next ? 1 : -1);
    setLoading(true);

    try {
      if (previous) {
        await unfollowUser(targetUserId);
      } else {
        await followUser(targetUserId);
      }
    } catch (_error) {
      setFollowing(previous);
      onFollowChange?.(previous ? 1 : -1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      className={`follow-btn ${following ? "follow-btn--following" : "follow-btn--follow"}`}
      onClick={handleClick}
      disabled={loading}
    >
      {following ? (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          Following
        </>
      ) : (
        "Follow"
      )}
    </button>
  );
}

export default FollowButton;
