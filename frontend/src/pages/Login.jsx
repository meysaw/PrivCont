import {useState} from "react";
import api from "../services/api";
import {useNavigate} from "react-router-dom"
import { useAuth } from "../context/AuthContext";
import {Button} from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "../components/Logo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function Login(){
    const navigate=useNavigate();
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [error,setError]=useState("");
    const { login } = useAuth();

    const handleSubmit=async(e)=>{
        e.preventDefault();
        try{
            const response=await api.post("/auth/login",{email,password});
            login(response.data.token);
            navigate("/dashboard");
            console.log("logged in")
        }catch(error){
            setError( error.response?.data?.message || "An error occurred during login.");
        }
    }
return (
    
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 px-4">
    <div className="mb-8 text-center"> 
        <Logo size="large"/>
            <p className="mt-2 text-sm text-muted-foreground"> Private coding contests 
            </p> 
        </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              Login
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground">
  Don't have an account?{" "}
  <button
    type="button"
    onClick={() => navigate("/register")}
    className="underline underline-offset-4 hover:text-primary"
  >
    Register
  </button>
</p>
{error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
export default Login;