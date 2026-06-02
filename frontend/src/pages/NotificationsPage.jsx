import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import NotificationItem from "../components/NotificationItem";
import { getNotifications } from "../services/notificationService";

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
    <div className="app-shell">
      <Navbar />
      <div className="page-container">
        <h1 className="page-title">Notifications</h1>

        {loading ? (
          <div>
            {[1, 2, 3, 4].map((i) => (
              <div className="skeleton-notification" key={i}>
                <div className="skeleton skeleton-notif-icon" />
                <div className="skeleton-notif-body">
                  <div className="skeleton skeleton-text" style={{ width: '75%' }} />
                  <div className="skeleton skeleton-text skeleton-text-sm" style={{ width: '30%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {!loading && error ? <p className="feed-error">{error}</p> : null}

        {!loading && !error && !notifications.length ? (
          <div className="empty-state">
            <h3>No notifications yet</h3>
            <p>When someone interacts with your posts, you'll see it here.</p>
          </div>
        ) : null}

        {!loading && notifications.length ? (
          <ul className="notification-list">
            {notifications.map((item) => (
              <NotificationItem key={item.id} notification={item} />
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

export default NotificationsPage;
