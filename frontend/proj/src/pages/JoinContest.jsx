import {useState} from "react";
import {useNavigate} from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
function JoinContest(){
    const [inviteCode,setInviteCode]=useState("");
    const [error,setError]=useState("");
    const {token}=useAuth();
    const navigate=useNavigate();
    const handleSubmit=async(e)=>{
        e.preventDefault();
        try{
            const response=await api.post("/contests/join",{
                inviteCode
            },{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            });
            navigate(`/contest/${response.data.contest._id}`);
        }catch(error){
            setError(error.response?.data?.message || "Failed to join contest");
        }
    };
    return (
        <div>
            <h1>Join Contest</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Invite Code</label>
                    <br />
                    <input
                        type="text"
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                        placeholder="Enter invite code"
                        required
                    />
                </div>
                <br />
                <button type="submit">Join Contest</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}
export default JoinContest;