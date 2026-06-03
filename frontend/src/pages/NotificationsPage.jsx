import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import NotificationItem from "../components/NotificationItem";
import { getNotifications } from "../services/notificationService";

const SkeletonNotifications = () => {
  return (
    <div className="notification-card-container">
      {[1, 2, 3, 4, 5].map((n) => (
        <div className="skeleton-notification-item" key={n}>
          <div className="skeleton skeleton-circle skeleton-notification-avatar"></div>
          <div className="skeleton skeleton-notification-text"></div>
        </div>
      ))}
    </div>
  );
};

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadNotifications() {
      setError("");
      try {
        const data = await getNotifications();
        if (mounted) {
          setNotifications(data);
        }
      } catch (_error) {
        if (mounted) {
          setNotifications([]);
          setError("Failed to load notifications.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadNotifications();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="feed-page">
      <Navbar />
      <div className="simple-page">
        <h1>Notifications</h1>
        {loading ? (
          <SkeletonNotifications />
        ) : null}

        {!loading && error ? <p className="feed-error">{error}</p> : null}

        {!loading && !error && !notifications.length ? (
          <p className="empty-state-text">No notifications yet.</p>
        ) : null}

        <ul className="notification-list">
          {notifications.map((item) => (
            <NotificationItem key={item.id} notification={item} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default NotificationsPage;
