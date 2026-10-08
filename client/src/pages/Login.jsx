import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { AuthFrame } from "@/components/auth/AuthFrame";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/context/AuthContext";

export function Login() {
  const { login, token } = useAuth(); const navigate = useNavigate(); const location = useLocation(); const reduced = useReducedMotion();
  const [form, setForm] = useState({ email: "", password: "" }); const [error, setError] = useState(""); const [pending, setPending] = useState(false); const [attempt, setAttempt] = useState(0);
  if (token) return <Navigate to="/dashboard" replace />;
  const submit = async (event) => { event.preventDefault(); setError(""); if (!form.email || !form.password) { setError("Enter your email and password."); setAttempt((v) => v + 1); return; } setPending(true); try { await login(form); toast.success("Welcome back"); navigate(location.state?.from?.pathname || "/dashboard", { replace: true }); } catch (requestError) { const message = requestError.response?.data?.error || "Unable to sign in"; setError(message); setAttempt((v) => v + 1); toast.error(message); } finally { setPending(false); } };
  return <AuthFrame footer={<p className="auth-switch">New to Datawhisper? <Link to="/register">Create an account</Link></p>}><motion.div key={attempt} initial={reduced ? false : { opacity: 0, y: 18 }} animate={error && !reduced ? { opacity: 1, y: 0, x: [0, -7, 7, -4, 4, 0] } : { opacity: 1, y: 0 }} transition={{ duration: .42, ease: "easeOut" }}><Card className="auth-card"><CardHeader><div className="eyebrow">Secure workspace</div><CardTitle>Welcome back</CardTitle><CardDescription>Sign in to continue asking questions about your data.</CardDescription></CardHeader><CardContent><form className="form-stack" onSubmit={submit} noValidate><div className="field"><Label htmlFor="login-email">Email</Label><Input id="login-email" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} aria-invalid={Boolean(error)} placeholder="you@company.com" /></div><div className="field"><Label htmlFor="login-password">Password</Label><Input id="login-password" type="password" autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} aria-invalid={Boolean(error)} placeholder="At least 8 characters" /></div>{error && <p className="form-error" role="alert">{error}</p>}<Button type="submit" disabled={pending}>{pending ? "Signing in…" : <>Sign in <ArrowRight size={17} /></>}</Button></form></CardContent></Card></motion.div></AuthFrame>;
}
