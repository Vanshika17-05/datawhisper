/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { getToken, setToken as persistToken } from "@/lib/auth";

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [token, setToken] = useState(getToken()); const [user, setUser] = useState(null); const [isLoading, setIsLoading] = useState(Boolean(getToken()));
  const applySession = useCallback((data) => { persistToken(data.token); setToken(data.token); setUser(data.user); }, []);
  const logout = useCallback(() => { persistToken(null); setToken(null); setUser(null); }, []);
  useEffect(() => { if (!token) return; api.get("/auth/me").then(({ data }) => setUser(data.user)).catch(() => logout()).finally(() => setIsLoading(false)); }, [token, logout]);
  const login = useCallback(async (input) => { const { data } = await api.post("/auth/login", input); applySession(data); return data.user; }, [applySession]);
  const register = useCallback(async (input) => { const { data } = await api.post("/auth/register", input); applySession(data); return data.user; }, [applySession]);
  const updateUser = useCallback((nextUser) => setUser(nextUser), []);
  const value = useMemo(() => ({ user, token, login, register, logout, updateUser, isLoading }), [user, token, login, register, logout, updateUser, isLoading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() { const context = useContext(AuthContext); if (!context) throw new Error("useAuth must be used within AuthProvider"); return context; }
