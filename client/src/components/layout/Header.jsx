import { motion, useReducedMotion } from "framer-motion";
import { ChartNoAxesCombined, DatabaseZap, LogOut, Settings, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useApiHealth } from "@/hooks/useApiHealth";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";

export function Header() {
  const status = useApiHealth();
  const { user, logout } = useAuth(); const navigate = useNavigate();
  const reduced = useReducedMotion();
  return <motion.header className="site-header" initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .4, ease: "easeOut" }}>
    <Link className="brand" to="/dashboard" aria-label="Datawhisper home"><span className="logo-mark"><DatabaseZap size={18} /></span><span>Datawhisper</span></Link>
    <div className="header-actions"><Badge className="status-badge"><span className={`status-dot ${status}`} /><span className="status-label">API {status}</span></Badge><DropdownMenu><DropdownMenuTrigger><Button className="user-menu-trigger" variant="ghost" aria-label="Open user menu"><span className="mini-avatar">{user?.profilePhotoUrl ? <img src={user.profilePhotoUrl} alt="" /> : user?.name?.[0]?.toUpperCase()}</span><span className="user-menu-name">{user?.name}</span></Button></DropdownMenuTrigger><DropdownMenuContent><div className="menu-user"><strong>{user?.name}</strong><span>{user?.email}</span></div><DropdownMenuItem onClick={() => navigate("/analytics")}><ChartNoAxesCombined size={15} /> Analytics</DropdownMenuItem><DropdownMenuItem onClick={() => navigate("/profile")}><UserRound size={15} /> Profile</DropdownMenuItem><DropdownMenuItem onClick={() => navigate("/settings")}><Settings size={15} /> Settings</DropdownMenuItem><DropdownMenuItem className="logout-item" onClick={() => { logout(); navigate("/login"); }}><LogOut size={15} /> Log out</DropdownMenuItem></DropdownMenuContent></DropdownMenu></div>
  </motion.header>;
}
