import {useState} from "react";
import api from "../services/api";
import {useNavigate} from "react-router-dom"
import { useAuth } from "../context/AuthContext";
function Login(){
    const navigate=useNavigate();
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const { login } = useAuth();
    const handleSubmit=async(e)=>{
        e.preventDefault();
        try{
            const response=await api.post("/auth/login",{email,password});
            login(response.data.token);
            navigate("/dashboard");
            console.log("logged in")
        }catch(error){
            console.error(error.response.data);
        }
    }
    return(
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required/>
                <br/>
                <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required/>
                <br/>
                <button type="submit">Login</button>
            </form>
        </div>
    )
}
export default Login;