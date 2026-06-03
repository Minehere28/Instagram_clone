import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getCurrentUser, logout } from "../services/authService";
import { getUnreadNotificationsCount } from "../services/notificationService";

import CreatePostModal from "./CreatePostModal";
import SearchBar from "./SearchBar";

function Navbar({ onPostCreated }) {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const profileUsername = currentUser?.username || "me";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let mounted = true;

    async function loadUnreadCount() {
      try {
        const count = await getUnreadNotificationsCount();
        if (mounted) {
          setUnreadCount(count);
        }
      } catch (_error) {
        if (mounted) {
          setUnreadCount(0);
        }
      }
    }

    loadUnreadCount();
    const timer = setInterval(loadUnreadCount, 30000);

    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo-wrap" aria-label="Instagram Home">
        <span className="navbar-logo-text">Instagram</span>
      </Link>

      <SearchBar />

      <div className="navbar-actions">
        <button
          type="button"
          className="nav-action-btn"
          onClick={() => navigate("/")}
          aria-label="Home"
          title="Home"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </button>
        <button
          type="button"
          className="nav-action-btn"
          onClick={() => setIsModalOpen(true)}
          aria-label="Create Post"
          title="Create Post"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="12" x2="12" y1="8" y2="16"/><line x1="8" x2="16" y1="12" y2="12"/></svg>
        </button>
        <button
          type="button"
          className="nav-action-btn"
          onClick={() => navigate("/notifications")}
          aria-label="Notifications"
          title="Notifications"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
          {unreadCount > 0 ? (
            <span className="nav-action-badge">{unreadCount}</span>
          ) : null}
        </button>
        <button
          type="button"
          className="nav-action-btn"
          onClick={() => navigate(`/profile/${profileUsername}`)}
          aria-label="Profile"
          title="Profile"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="nav-action-btn"
          aria-label="Logout"
          title="Logout"
          style={{ color: "var(--error)" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
        </button>
      </div>

      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPostCreated={onPostCreated}
      />
    </nav>
  );
}

export default Navbar;
