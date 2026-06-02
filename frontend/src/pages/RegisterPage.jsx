import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/authService";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Vui lòng điền tên đăng nhập và mật khẩu.");
      return;
    }

    if (password.length < 6) {
      setError("Mật khẩu phải chứa ít nhất 6 ký tự.");
      return;
    }

    setLoading(true);
    try {
      await register({
        username,
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      });
      navigate("/");
    } catch (err) {
      const serverMessage = err.response?.data?.message || err.response?.data?.detail || err.response?.data?.error;
      if (serverMessage) {
        setError(serverMessage);
      } else {
        setError("Đăng ký thất bại. Tên đăng nhập có thể đã tồn tại hoặc do lỗi kết nối.");
      }
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <img
          src="/logo_ins.png"
          alt="instagram logo"
          style={{ width: "175px", marginBottom: "24px", cursor: "pointer" }}
          onClick={() => navigate("/login")}
        />
        <h1>Đăng ký tài khoản</h1>
        <p style={{ marginBottom: "24px" }}>Đăng ký để xem ảnh và video từ bạn bè.</p>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Tên đăng nhập"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email (không bắt buộc)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Họ (không bắt buộc)"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Tên (không bắt buộc)"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="password"
            placeholder="Mật khẩu (tối thiểu 6 ký tự)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="register-error" style={{ marginTop: "12px", marginBottom: "12px" }}>{error}</p>}

          <button type="submit" disabled={loading} style={{ marginTop: "12px" }}>
            {loading ? "Đang tạo tài khoản..." : "Đăng ký"}
          </button>
        </form>

        <div className="signup" style={{ marginTop: "24px" }}>
          <p>Bạn đã có tài khoản?</p>
          <Link to="/login" className="register-link">
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
