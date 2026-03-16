function NotificationItem({ notification }) {
  return (
    <li className="notification-item">
      <strong>{notification.sender?.username}</strong> {notification.type}
      {notification.post ? ` on post #${notification.post}` : ""}
      <span className="notification-date">{new Date(notification.created_at).toLocaleString()}</span>
    </li>
  );
}

export default NotificationItem;
