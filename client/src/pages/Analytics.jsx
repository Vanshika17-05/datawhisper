import { useEffect, useState } from "react";
import { Activity, ChartNoAxesCombined, CircleCheckBig, Clock3, Database } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getAnalyticsSummary } from "@/lib/api";

const tooltipStyle = { background: "rgba(19,17,26,.98)", border: "1px solid rgba(110,58,255,.5)", borderRadius: 10, color: "#f7f4ff", fontSize: 12 };
const dateLabel = (value) => new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));

function StatTile({ icon, label, value, detail }) {
  return <Card className="analytics-stat"><CardContent><span className="analytics-stat-icon">{icon}</span><div><span>{label}</span><strong>{value}</strong>{detail && <small>{detail}</small>}</div></CardContent></Card>;
}

export function Analytics() {
  const [summary, setSummary] = useState(null); const [error, setError] = useState("");
  useEffect(() => { let active = true; getAnalyticsSummary().then((response) => { if (active) setSummary(response.summary); }).catch(() => { if (active) setError("Analytics could not be loaded. Check the PostgreSQL connection and migration."); }); return () => { active = false; }; }, []);

  return <PageShell><div className="page-heading"><p className="eyebrow"><ChartNoAxesCombined size={16} /> Usage analytics</p><h1>System insights</h1><p>Understand how you query Datawhisper and how quickly it responds.</p></div>{error ? <Card className="analytics-error"><CardContent>{error}</CardContent></Card> : !summary ? <div className="analytics-stats"><Skeleton className="analytics-stat-skeleton" /><Skeleton className="analytics-stat-skeleton" /><Skeleton className="analytics-stat-skeleton" /></div> : <><div className="analytics-stats"><StatTile icon={<Activity size={18} />} label="Total queries" value={summary.totalQueries.toLocaleString()} detail={summary.mostQueriedCollection ? `Most used: ${summary.mostQueriedCollection}` : "No collection data yet"} /><StatTile icon={<CircleCheckBig size={18} />} label="Success rate" value={`${summary.successRate}%`} detail="Across all recorded queries" /><StatTile icon={<Clock3 size={18} />} label="Average response" value={`${summary.averageResponseTimeMs.toLocaleString()} ms`} detail="End-to-end query latency" /></div><Card className="analytics-chart-card"><CardHeader><div className="eyebrow"><Database size={15} /> Last 14 days</div><CardTitle>Queries per day</CardTitle></CardHeader><CardContent><div className="analytics-chart" role="img" aria-label="Queries per day for the last 14 days"><ResponsiveContainer width="100%" height={300}><LineChart data={summary.queriesPerDay} margin={{ top: 8, right: 16, left: -18, bottom: 8 }}><CartesianGrid stroke="rgba(255,255,255,.06)" vertical={false} /><XAxis dataKey="date" tickFormatter={dateLabel} tick={{ fill: "#9c97aa", fontSize: 11 }} /><YAxis allowDecimals={false} tick={{ fill: "#9c97aa", fontSize: 11 }} /><Tooltip contentStyle={tooltipStyle} labelFormatter={dateLabel} /><Line type="monotone" dataKey="count" name="Queries" stroke="var(--chart-1)" strokeWidth={3} dot={{ fill: "var(--chart-2)", strokeWidth: 0, r: 4 }} activeDot={{ r: 6 }} /></LineChart></ResponsiveContainer></div></CardContent></Card></> }</PageShell>;
}
