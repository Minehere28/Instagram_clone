import CommentItem from "./CommentItem";

function CommentList({ comments }) {
  if (!comments.length) {
    return <p className="comments-empty">No comments yet.</p>;
  }

  return (
    <ul className="comment-list">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </ul>
  );
}

export default CommentList;
