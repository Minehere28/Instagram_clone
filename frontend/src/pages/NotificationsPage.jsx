import { useEffect, useState } from "react";

import NotificationItem from "../components/NotificationItem";
import { getNotifications } from "../services/notificationService";

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    let mounted = true;

    async function loadNotifications() {
      try {
        const data = await getNotifications();
        if (mounted) {
          setNotifications(data);
        }
      } catch (_error) {
        if (mounted) {
          setNotifications([]);
        }
      }
    }

    loadNotifications();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="simple-page">
      <h1>Notifications</h1>
      {!notifications.length ? <p>No notifications.</p> : null}
      <ul className="notification-list">
        {notifications.map((item) => (
          <NotificationItem key={item.id} notification={item} />
        ))}
      </ul>
    </div>
  );
}

export default NotificationsPage;
