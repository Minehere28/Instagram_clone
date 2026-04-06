function CommentItem({ comment }) {
  const username = comment.user?.username || "user";
  const createdAt = comment.created_at
    ? new Date(comment.created_at).toLocaleString()
    : "";

  return (
    <li className="comment-item">
      <p>
        <strong>{username}</strong>: {comment.content}
      </p>
      {createdAt ? <span className="comment-time">{createdAt}</span> : null}
    </li>
  );
}

export default CommentItem;
