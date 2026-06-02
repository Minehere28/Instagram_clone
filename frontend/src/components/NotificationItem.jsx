function NotificationItem({ notification }) {
  const sender = notification.sender?.username || "Someone";
  const typeTextMap = {
    like: "liked your post",
    comment: "commented on your post",
    follow: "started following you",
  };

  const typeIconMap = {
    like: "♥",
    comment: "💬",
    follow: "👤",
  };

  const typeClassMap = {
    like: "notification-icon--like",
    comment: "notification-icon--comment",
    follow: "notification-icon--follow",
  };

  const actionText = typeTextMap[notification.type] || notification.type;
  const icon = typeIconMap[notification.type] || "🔔";
  const iconClass = typeClassMap[notification.type] || "notification-icon--comment";
  const createdAt = notification.created_at
    ? new Date(notification.created_at).toLocaleString()
    : "";

  return (
    <li className={`notification-item ${notification.is_read === false ? "is-unread" : ""}`}>
      <div className={`notification-icon ${iconClass}`}>{icon}</div>
      <div className="notification-body">
        <p>
          <strong>{sender}</strong> {actionText}
          {notification.post ? ` (post #${notification.post})` : ""}
        </p>
        {createdAt ? <span className="notification-date">{createdAt}</span> : null}
      </div>
    </li>
  );
}

export default NotificationItem;
