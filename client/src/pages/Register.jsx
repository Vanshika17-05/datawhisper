import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { AuthFrame } from "@/components/auth/AuthFrame";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/context/AuthContext";

export function Register() {
  const { register, token } = useAuth(); const navigate = useNavigate(); const reduced = useReducedMotion();
  const [form, setForm] = useState({ name: "", email: "", password: "" }); const [errors, setErrors] = useState({}); const [pending, setPending] = useState(false);
  if (token) return <Navigate to="/dashboard" replace />;
  const submit = async (event) => { event.preventDefault(); const next = {}; if (form.name.trim().length < 2) next.name = "Enter at least 2 characters"; if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email"; if (form.password.length < 8) next.password = "Use at least 8 characters"; setErrors(next); if (Object.keys(next).length) return; setPending(true); try { await register(form); toast.success("Your account is ready"); navigate("/dashboard", { replace: true }); } catch (requestError) { const data = requestError.response?.data; setErrors(data?.details || { form: data?.error || "Unable to create account" }); toast.error(data?.error || "Registration failed"); } finally { setPending(false); } };
  const field = (key) => (event) => setForm({ ...form, [key]: event.target.value });
  return <AuthFrame footer={<p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>}><motion.div initial={reduced ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .42, ease: "easeOut" }}><Card className="auth-card"><CardHeader><div className="eyebrow">Start exploring</div><CardTitle>Create your account</CardTitle><CardDescription>Set up a secure workspace for your database conversations.</CardDescription></CardHeader><CardContent><form className="form-stack" onSubmit={submit} noValidate><div className="field"><Label htmlFor="name">Name</Label><Input id="name" autoComplete="name" value={form.name} onChange={field("name")} aria-invalid={Boolean(errors.name)} placeholder="Your name" />{errors.name && <p className="field-error">{errors.name}</p>}</div><div className="field"><Label htmlFor="email">Email</Label><Input id="email" type="email" autoComplete="email" value={form.email} onChange={field("email")} aria-invalid={Boolean(errors.email)} placeholder="you@company.com" />{errors.email && <p className="field-error">{errors.email}</p>}</div><div className="field"><Label htmlFor="password">Password</Label><Input id="password" type="password" autoComplete="new-password" value={form.password} onChange={field("password")} aria-invalid={Boolean(errors.password)} placeholder="At least 8 characters" />{errors.password && <p className="field-error">{errors.password}</p>}</div>{errors.form && <p className="form-error">{errors.form}</p>}<Button className="button-secondary-glow" type="submit" disabled={pending}>{pending ? "Creating account…" : <>Create account <ArrowRight size={17} /></>}</Button></form></CardContent></Card></motion.div></AuthFrame>;
}
