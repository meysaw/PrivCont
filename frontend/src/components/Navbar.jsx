import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";
import { Button } from "@/components/ui/button";

function Navbar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between border-b bg-background px-6 py-4">
      <button onClick={() => navigate("/dashboard")} className="cursor-pointer">
        <Logo size="small" />
      </button>
      <Button variant="ghost" onClick={handleLogout}>
        Logout
      </Button>
    </nav>
  );
}

export default Navbar;