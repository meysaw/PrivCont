import {useState} from "react";
import api from "../services/api";
import {useNavigate} from "react-router-dom"
import { useAuth } from "../context/AuthContext";
function Register(){
    const navigate=useNavigate();
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [username,setUsername]=useState("");
    const handleSubmit=async(e)=>{
        e.preventDefault();
        try{
            const response=await api.post("/auth/register",{username,email,password});
            navigate("/login");
            console.log("registered")
        }catch(error){
            console.error(error.response.data);
        }
    }
    return(
        <div>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Username" value={username} onChange={(e)=>setUsername(e.target.value)} required/>
                <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required/>
                <br/>
                <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required/>
                <br/>
                <button type="submit">Register</button>
            </form>
        </div>
    )
}
export default Register;