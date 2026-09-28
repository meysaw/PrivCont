import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ExternalLink, LogOut, Shield, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";

const linkClass = ({ isActive }) =>
  `text-sm transition-colors ${
    isActive
      ? "font-medium text-foreground"
      : "text-muted-foreground hover:text-foreground"
  }`;

const itemClass =
  "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-muted";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  const go = (path) => {
    setOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate("/login");
  };

  const initial = user?.username?.[0]?.toUpperCase() ?? "?";

  return (
    <nav className="flex items-center justify-between border-b bg-background px-6 py-3">
      <div className="flex items-center gap-8">
        <Link to="/dashboard">
          <Logo size="default" />
        </Link>

        <a
          href="https://leetcode.com/problemset/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Practice Solo <ExternalLink className="h-3.5 w-3.5" />
        </a>

        
      </div>

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground outline-none"
        >
          {initial}
        </button>

        {open && (
          <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border bg-background p-1 shadow-lg">
            <div className="px-3 py-2">
              <p className="text-sm font-medium">{user?.username}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>

            <div className="my-1 h-px bg-border" />

            <button className={itemClass} onClick={() => go("/profile")}>
              <User className="h-4 w-4" /> Profile
            </button>

            {user?.role === "admin" && (
              <button className={itemClass} onClick={() => go("/admin")}>
                <Shield className="h-4 w-4" /> Admin
              </button>
            )}

            <div className="my-1 h-px bg-border" />

            <button className={itemClass} onClick={handleLogout}>
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;