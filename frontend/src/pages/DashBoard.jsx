import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
function DashBoard(){
    const navigate = useNavigate();

    return(
        <>
        <Navbar/>
    <h1>PrivCont DashBoard</h1>
    <h1>Welcome to PrivCont</h1>
     <button onClick={() => navigate("/create-contest")}>
                Create Contest
            </button>
        <button onClick={() => navigate("/join-contest")}>
                Join Contest
            </button>
        </>
    );
}
export default DashBoard;