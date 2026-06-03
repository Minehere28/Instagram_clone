import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import "./styles/theme.css";
import "./styles/layout.css";
import "./styles/components.css";
import "./styles/pages.css";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NotificationsPage from "./pages/NotificationsPage";
import PostDetailPage from "./pages/PostDetailPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";

function ProtectedRoute({ children }) {
	const token = localStorage.getItem("access_token");
	if (!token) {
		return <Navigate to="/login" replace />;
	}
	return children;
}

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route
					path="/"
					element={
						<ProtectedRoute>
							<HomePage />
						</ProtectedRoute>
					}
				/>
				<Route path="/login" element={<LoginPage />} />
				<Route path="/register" element={<RegisterPage />} />
				<Route
					path="/profile/:username"
					element={
						<ProtectedRoute>
							<ProfilePage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/notifications"
					element={
						<ProtectedRoute>
							<NotificationsPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/post/:id"
					element={
						<ProtectedRoute>
							<PostDetailPage />
						</ProtectedRoute>
					}
				/>
				<Route path="*" element={<Navigate to="/login" replace />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;