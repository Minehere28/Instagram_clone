import { Link, useNavigate } from "react-router-dom";

import { getCurrentUser, logout } from "../services/authService";

function Navbar() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const profileUsername = currentUser?.username || "me";

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo-wrap" aria-label="Instagram Home">
        <img src="/logo_ins.png" alt="Instagram" className="navbar-logo" />
      </Link>
      <div className="navbar-actions">
        <button type="button" className="nav-btn" onClick={() => navigate("/")}>
          Home
        </button>
        <button
          type="button"
          className="nav-btn"
          onClick={() => navigate("/notifications")}
        >
          Notifications
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
    </nav>
  );
}

export default Navbar;
