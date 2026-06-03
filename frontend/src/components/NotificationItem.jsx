function NotificationItem({ notification }) {
  const sender = notification.sender?.username || "Someone";
  const avatarFallback = sender.charAt(0).toUpperCase() || "U";
  const typeTextMap = {
    like: "liked your post",
    comment: "commented on your post",
    follow: "started following you",
  };

  const actionText = typeTextMap[notification.type] || notification.type;
  const createdAt = notification.created_at
    ? new Date(notification.created_at).toLocaleString()
    : "";

  return (
    <li className={`notification-item ${!notification.is_read ? "unread" : ""}`}>
      <div className="notification-avatar-wrap">
        {notification.sender?.avatar_url ? (
          <img
            src={notification.sender.avatar_url}
            alt={sender}
            className="notification-avatar"
          />
        ) : (
          <div className="notification-avatar-fallback">{avatarFallback}</div>
        )}
      </div>
      <div className="notification-info">
        <p className="notification-text">
          <strong>{sender}</strong> {actionText}
          {notification.post ? ` (post #${notification.post})` : ""}
        </p>
        {createdAt ? <span className="notification-date">{createdAt}</span> : null}
      </div>
    </li>
  );
}

export default NotificationItem;
