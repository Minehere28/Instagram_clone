import {useState} from "react"

function LoginForm(){

const [username,setUsername] = useState("")
const [password,setPassword] = useState("")

const handleSubmit = (e)=>{
e.preventDefault()
console.log(username,password)
}

return(

<div className="login-box">

<h2>Đăng nhập vào Instagram</h2>

<form onSubmit={handleSubmit}>

<input
type="text"
placeholder="Số di động, tên người dùng hoặc email"
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

<p className="forgot">Quên mật khẩu?</p>

<div className="signup">
<br/>
<p>Chưa có tài khoản?</p>
<a href="/register" className="register-link">
Tạo tài khoản mới
</a>

</div>

</div>

)

}

export default LoginForm