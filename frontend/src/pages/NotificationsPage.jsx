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
    <div className="feed-page">
      <Navbar />
      <div className="simple-page">
        <h1>Notifications</h1>
        {loading ? (
          <div className="loading-wrap">
            <div className="spinner" />
            <p>Loading notifications...</p>
          </div>
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
