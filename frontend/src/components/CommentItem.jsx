import { Link } from "react-router-dom";

function CommentItem({ comment }) {
  const username = comment.user?.username || "user";
  const avatarFallback = username.charAt(0).toUpperCase() || "U";
  const createdAt = comment.created_at
    ? new Date(comment.created_at).toLocaleString()
    : "";

  return (
    <li className="comment-item">
      <div className="comment-user-meta">
        {comment.user?.avatar_url ? (
          <img src={comment.user.avatar_url} alt={username} className="comment-avatar" />
        ) : (
          <div className="comment-avatar comment-avatar-fallback">{avatarFallback}</div>
        )}

        <div className="comment-content">
          <p>
            <Link to={`/profile/${username}`} className="comment-username-link">
              <strong>{username}</strong>
            </Link>{" : "}
            {comment.content}
          </p>
          {createdAt ? <span className="comment-time">{createdAt}</span> : null}
        </div>
      </div>
    </li>
  );
}

export default CommentItem;
