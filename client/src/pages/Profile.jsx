import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarDays, ChartNoAxesCombined, Mail } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

export function Profile() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [pending, setPending] = useState(false);
  const reduced = useReducedMotion();
  const initials = user?.name?.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();

  const item = (delay) => reduced ? {} : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: .38, delay } };
  const save = async (event) => { event.preventDefault(); if (name.trim().length < 2) return toast.error("Name must be at least 2 characters"); setPending(true); try { const { data } = await api.put("/auth/me", { name }); updateUser(data.user); toast.success("Profile updated"); } catch (error) { toast.error(error.response?.data?.error || "Could not update profile"); } finally { setPending(false); } };

  return <PageShell><div className="page-heading"><p className="eyebrow">Your workspace identity</p><h1>Profile</h1><p>Manage how you appear across Datawhisper.</p></div><div className="profile-grid"><motion.div {...item(.04)}><Card><CardContent className="identity-card"><div className="avatar">{initials}</div><div><h2>{user?.name}</h2><p><Mail size={15} /> {user?.email}</p><p><CalendarDays size={15} /> Member since {new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(new Date(user?.createdAt))}</p></div></CardContent></Card></motion.div><motion.div {...item(.12)}><Card><CardHeader><CardTitle>Edit details</CardTitle><CardDescription>Your email is tied to this account and cannot be changed.</CardDescription></CardHeader><CardContent><form className="form-stack" onSubmit={save}><div className="field"><Label htmlFor="profile-name">Display name</Label><Input id="profile-name" value={name} onChange={(e) => setName(e.target.value)} /></div><div className="field"><Label htmlFor="profile-email">Email</Label><Input id="profile-email" value={user?.email || ""} readOnly /></div><Button type="submit" disabled={pending || name.trim() === user?.name}>{pending ? "Saving…" : "Save changes"}</Button></form></CardContent></Card></motion.div><motion.div className="stats-row" {...item(.2)}><Card><CardContent className="stat-card"><ChartNoAxesCombined /><div><span>Queries run</span><strong>—</strong></div></CardContent></Card><Card><CardContent className="stat-card"><CalendarDays /><div><span>Active since</span><strong>{new Date(user?.createdAt).getFullYear()}</strong></div></CardContent></Card></motion.div></div></PageShell>;
}
