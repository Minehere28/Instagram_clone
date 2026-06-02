import { useEffect, useState } from "react";

import { getComments } from "../services/interactionService";
import CommentItem from "./CommentItem";

function CommentList({ postId, reloadKey = 0 }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadComments() {
      setLoading(true);
      setError("");
      try {
        const data = await getComments(postId);
        if (mounted) {
          setComments(data);
        }
      } catch (_error) {
        if (mounted) {
          setComments([]);
          setError("Failed to load comments.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadComments();

    return () => {
      mounted = false;
    };
  }, [postId, reloadKey]);

  if (loading) {
    return (
      <div className="comments-loading">
        <div className="skeleton skeleton-text" style={{ width: '80%' }} />
        <div className="skeleton skeleton-text skeleton-text-sm" />
      </div>
    );
  }

  if (error) {
    return <p className="comments-error">{error}</p>;
  }

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
