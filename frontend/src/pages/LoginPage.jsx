import LoginForm from "../components/LoginForm";
import Footer from "../components/Footer";
import "../styles/pages.css";

function LoginPage() {
  return (
    <div className="login-page-container">
      {/* LOGO INSTAGRAM */}
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
        <div className="left-section">
          <h1 className="hero-text">
            Hãy xem các khoảnh khắc <br />
            thường ngày của <span>bạn thân</span> nhé.
          </h1>

          <img
            src="/SV5T.jpg"
            alt="instagram preview"
            className="hero-image"
            onError={(e) => { e.target.style.display = "none"; }}
          />
        </div>

        <div className="right-section">
          <LoginForm />
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default LoginPage;