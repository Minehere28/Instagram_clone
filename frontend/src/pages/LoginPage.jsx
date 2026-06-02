import LoginForm from "../components/LoginForm";
import Footer from "../components/Footer";

function LoginPage() {
  return (
    <div className="login-page">
      <img
        src="/logo_ins.png"
        alt="instagram logo"
        className="insta-logo"
      />

      <div className="login-main">
        <div className="login-hero">
          <h1 className="hero-text">
            Hãy xem các khoảnh khắc <br />
            thường ngày của <span>bạn thân</span> nhé.
          </h1>

          <img
            src="/SV5T.jpg"
            alt="instagram preview"
            className="hero-image"
          />
        </div>

        <div className="login-card-wrap">
          <LoginForm />
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default LoginPage;