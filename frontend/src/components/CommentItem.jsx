function CommentItem({ comment }) {
  const username = comment.user?.username || "user";
  const initial = username.charAt(0).toUpperCase();
  const createdAt = comment.created_at
    ? new Date(comment.created_at).toLocaleString()
    : "";

  return (
    <li className="comment-item">
      <div className="comment-avatar">{initial}</div>
      <div className="comment-content">
        <p>
          <strong>{username}</strong> {comment.content}
        </p>
        {createdAt ? <span className="comment-time">{createdAt}</span> : null}
      </div>
    </li>
  );
}

export default CommentItem;
