import LoginForm from "../components/LoginForm"
import Footer from "../components/Footer"
import "../styles/login.css"

function LoginPage(){

return(

<div className="page">

{/* LOGO INSTAGRAM */}
<img 
src="/logo_ins.png" 
alt="instagram logo"
className="insta-logo"
/>

<div className="main-container">

<div className="left-section">

<h1 className="hero-text">
Hãy xem các khoảnh khắc <br/>
thường ngày của <span>bạn thân</span> nhé.
</h1>

<img
src="/SV5T.jpg"
alt="instagram preview"
className="hero-image"
/>


</div>

<div className="right-section">

<LoginForm/>

</div>

</div>

<Footer/>

</div>

)

}

export default LoginPage