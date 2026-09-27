import {useState} from "react";
import api from "../services/api";
import {useNavigate} from "react-router-dom"
import {Button} from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from "../components/Logo";
function Register(){
    const navigate=useNavigate();
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [username,setUsername]=useState("");
    const [error,setError]=useState("");
    const handleSubmit=async(e)=>{
        e.preventDefault();
        try{
            const response=await api.post("/auth/register",{username,email,password});
            navigate("/login");
            console.log("registered")
        }catch(error){
            setError( error.response?.data?.message || "An error occurred during registration.");
        }
    }
    return(
 <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 px-4">
    <div className="mb-8 text-center"> 
        <Logo size="large"/>
            <p className="mt-2 text-sm text-muted-foreground"> Private coding contests 
            </p> 
        </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="john_doe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Register
            </Button>
          </form>
        <p className="text-center text-sm text-muted-foreground">
  Already have an account?{" "}
  <button
    type="button"
    onClick={() => navigate("/login")}
    className="underline underline-offset-4 hover:text-primary"
  >
    Login
  </button>
</p>
{error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </CardContent>
      </Card>
    </div>
       
    )
}
export default Register;