function CommentItem({ comment }) {
  return (
    <li className="comment-item">
      <strong>{comment.user?.username || "user"}</strong> {comment.content}
    </li>
  );
}

export default CommentItem;
