import {useState} from "react"
import "../styles/login.css"

function Login(){

const [username,setUsername] = useState("")
const [password,setPassword] = useState("")

const handleSubmit = (e)=>{
e.preventDefault()

console.log(username,password)

}

return(

<div className="login-wrapper">

<div className="login-box">

<h1 className="logo">Instagram</h1>

<form onSubmit={handleSubmit}>

<input
type="text"
placeholder="Số điện thoại, tên người dùng hoặc email"
value={username}
onChange={(e)=>setUsername(e.target.value)}
/>

<input
type="password"
placeholder="Mật khẩu"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<button type="submit">Đăng nhập</button>

</form>

<a className="forgot" href="#">Quên mật khẩu?</a>

</div>

<div className="signup-box">

<p>
Bạn chưa có tài khoản? 
<a href="/register">Tạo tài khoản mới</a>
</p>

</div>

</div>

)

}

export default Login