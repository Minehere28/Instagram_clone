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
        <img src="/logo_ins.png" alt="Instagram" className="navbar-logo" />
      </Link>

      <SearchBar />

      <div className="navbar-actions">
        <button type="button" className="nav-icon-btn" onClick={() => navigate("/")}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span>Home</span>
        </button>

        <button type="button" className="nav-icon-btn" onClick={() => setIsModalOpen(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
          <span>Create</span>
        </button>

        <button
          type="button"
          className="nav-icon-btn"
          onClick={() => navigate("/notifications")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
          {unreadCount > 0 ? <span className="notif-badge">{unreadCount}</span> : null}
          <span>Alerts</span>
        </button>

        <button
          type="button"
          className="nav-icon-btn"
          onClick={() => navigate(`/profile/${profileUsername}`)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span>Profile</span>
        </button>

        <button type="button" onClick={handleLogout} className="nav-icon-btn nav-icon-btn--danger">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          <span>Logout</span>
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
