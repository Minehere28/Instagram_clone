function NotificationItem({ notification }) {
  const sender = notification.sender?.username || "Someone";
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
    <li className="notification-item">
      <p>
        <strong>{sender}</strong> {actionText}
        {notification.post ? ` (post #${notification.post})` : ""}
      </p>
      {createdAt ? <span className="notification-date">{createdAt}</span> : null}
    </li>
  );
}

export default NotificationItem;
