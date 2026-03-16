import { Link, useNavigate } from "react-router-dom";

import { logout } from "../services/authService";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        Instagram Clone
      </Link>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/notifications">Notifications</Link>
        <button type="button" onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
