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
    <button type="button" className="follow-btn" onClick={handleClick} disabled={loading}>
      {following ? "Following" : "Follow"}
    </button>
  );
}

export default FollowButton;
