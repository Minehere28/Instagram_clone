import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import "../styles/pages.css";

function RegisterPage() {
  return (
    <div className="login-page-container">
      <div className="insta-logo" aria-label="Instagram">
        <span style={{
          fontFamily: "'Pacifico', cursive",
          fontSize: "28px",
          fontWeight: "700",
          color: "var(--accent-primary)"
        }}>
          Instagram
        </span>
      </div>

      <div className="login-main">
        <div className="right-section" style={{ margin: "0 auto" }}>
          <div className="login-box">
            <h2>Tạo tài khoản mới</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <input type="text" placeholder="Số di động hoặc email" required />
              <input type="text" placeholder="Tên đầy đủ" required />
              <input type="text" placeholder="Tên người dùng" required />
              <input type="password" placeholder="Mật khẩu" required />
              <button type="submit">Đăng ký</button>
            </form>
            <div className="signup">
              <p>Bạn đã có tài khoản?</p>
              <Link to="/login" className="register-link">
                Đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default RegisterPage;
