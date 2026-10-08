import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Activity, ChartNoAxesCombined, CircleCheckBig, Clock3, Database, Inbox } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getAnalyticsSummary } from "@/lib/api";

const tooltipStyle = { background: "rgba(13,11,15,.98)", border: "1px solid rgba(201,68,158,.5)", borderRadius: 10, color: "#f7f4ff", fontSize: 12 };
const dateLabel = (value) => new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));

function StatTile({ icon, label, value, detail }) {
  return <Card className="analytics-stat"><CardContent><span className="analytics-stat-icon">{icon}</span><div><span>{label}</span><strong>{value}</strong>{detail && <small>{detail}</small>}</div></CardContent></Card>;
}

export function Analytics() {
  const [summary, setSummary] = useState(null); const [error, setError] = useState("");
  const reduced = useReducedMotion();
  useEffect(() => { let active = true; getAnalyticsSummary().then((response) => { if (active) { setSummary(response.summary); setError(""); } }).catch(() => { if (active) setError("Analytics service is unavailable. The server could not reach its PostgreSQL analytics store."); }); return () => { active = false; }; }, []);

  const empty = summary?.totalQueries === 0;
  return <PageShell><div className="page-heading"><p className="eyebrow"><ChartNoAxesCombined size={16} /> Usage analytics</p><h1>System insights</h1><p>Understand how you query Datawhisper and how quickly it responds.</p></div>{error ? <Card className="analytics-error"><CardContent><strong>Analytics connection failed</strong><span>{error}</span></CardContent></Card> : !summary ? <div className="analytics-stats"><Skeleton className="analytics-stat-skeleton" /><Skeleton className="analytics-stat-skeleton" /><Skeleton className="analytics-stat-skeleton" /></div> : empty ? <Card className="analytics-empty"><CardContent><Inbox size={24} /><div><strong>No query data yet</strong><span>PostgreSQL is connected. Ask your first question to populate this dashboard.</span></div></CardContent></Card> : <><div className="analytics-stats"><StatTile icon={<Activity size={18} />} label="Total queries" value={summary.totalQueries.toLocaleString()} detail={summary.mostQueriedCollection ? `Most used: ${summary.mostQueriedCollection}` : "No collection data yet"} /><StatTile icon={<CircleCheckBig size={18} />} label="Success rate" value={`${summary.successRate}%`} detail="Across all recorded queries" /><StatTile icon={<Clock3 size={18} />} label="Average response" value={`${summary.averageResponseTimeMs.toLocaleString()} ms`} detail="End-to-end query latency" /></div><Card className="analytics-chart-card"><CardHeader><div className="eyebrow"><Database size={15} /> Last 14 days</div><CardTitle>Queries per day</CardTitle></CardHeader><CardContent><motion.div className="analytics-chart" role="img" aria-label="Queries per day for the last 14 days" initial={reduced ? false : { opacity: 0, scale: .95, y: 12, rotateX: 4 }} animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }} transition={{ type: "spring", stiffness: 210, damping: 20 }}><ResponsiveContainer width="100%" height={300}><LineChart data={summary.queriesPerDay} margin={{ top: 8, right: 16, left: -18, bottom: 8 }}><CartesianGrid stroke="rgba(255,255,255,.06)" vertical={false} /><XAxis dataKey="date" tickFormatter={dateLabel} tick={{ fill: "#9c97aa", fontSize: 11 }} /><YAxis allowDecimals={false} tick={{ fill: "#9c97aa", fontSize: 11 }} /><Tooltip contentStyle={tooltipStyle} labelFormatter={dateLabel} /><Line type="monotone" dataKey="count" name="Queries" stroke="var(--chart-1)" strokeWidth={3} dot={{ fill: "var(--chart-2)", strokeWidth: 0, r: 4 }} activeDot={{ r: 6 }} /></LineChart></ResponsiveContainer></motion.div></CardContent></Card></> }</PageShell>;
}
