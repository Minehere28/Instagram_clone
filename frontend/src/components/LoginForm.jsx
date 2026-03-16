import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { login } from "../services/authService";

function LoginForm() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (event) => {
		event.preventDefault();
		setError("");
		setLoading(true);

		try {
			await login({ username, password });
			navigate("/");
		} catch (err) {
			const serverMessage = err.response?.data?.message || err.response?.data?.detail;
			if (serverMessage) {
				setError(serverMessage);
			} else {
				setError("Đăng nhập thất bại. Vui lòng kiểm tra backend/CORS và thử lại.");
			}
			// Helpful during integration: shows if error is network/CORS/HTTP.
			// eslint-disable-next-line no-console
			console.error("Login error:", {
				message: err.message,
				status: err.response?.status,
				data: err.response?.data,
				url: err.config?.url,
				method: err.config?.method,
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="login-box">
			<h2>Đăng nhập vào Instagram</h2>

			<form onSubmit={handleSubmit}>
				<input
					type="text"
					placeholder="Số di động, tên người dùng hoặc email"
					value={username}
					onChange={(event) => setUsername(event.target.value)}
				/>

				<input
					type="password"
					placeholder="Mật khẩu"
					value={password}
					onChange={(event) => setPassword(event.target.value)}
				/>

				{error ? <p className="login-error">{error}</p> : null}
				<button type="submit" disabled={loading}>
					{loading ? "Đang đăng nhập..." : "Đăng nhập"}
				</button>
			</form>

			<p className="forgot">Quên mật khẩu?</p>

			<div className="signup">
				<br />
				<p>Chưa có tài khoản?</p>
				<Link to="/register" className="register-link">
					Tạo tài khoản mới
				</Link>
			</div>
		</div>
	);
}

export default LoginForm;