import { useState } from "react";
import "../styles/pages.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(username, password);
  };

  return (
    <div className="login-page-container">
      <div className="login-main">
        <div className="right-section" style={{ margin: "0 auto" }}>
          <div className="login-box">
            <h2>Instagram</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Số điện thoại, tên người dùng hoặc email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button type="submit">Đăng nhập</button>
            </form>
            <div className="signup">
              <p>Bạn chưa có tài khoản?</p>
              <a href="/register" className="register-link">
                Tạo tài khoản mới
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;