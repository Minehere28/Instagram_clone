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
        <button type="button" className="nav-btn" onClick={() => navigate("/")}>
          Home
        </button>
        <button type="button" className="nav-btn" onClick={() => setIsModalOpen(true)}>
          + Create
        </button>
        <button
          type="button"
          className="nav-btn"
          onClick={() => navigate("/notifications")}
        >
          🔔 {unreadCount > 0 ? unreadCount : ""}
        </button>
        <button
          type="button"
          className="nav-btn"
          onClick={() => navigate(`/profile/${profileUsername}`)}
        >
          Profile
        </button>
        <button type="button" onClick={handleLogout} className="nav-btn nav-btn-danger">
          Logout
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
