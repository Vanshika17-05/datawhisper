import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
export function ProtectedRoute() { const { token, isLoading } = useAuth(); const location = useLocation(); if (isLoading) return <div className="route-loader"><span /></div>; return token ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />; }
