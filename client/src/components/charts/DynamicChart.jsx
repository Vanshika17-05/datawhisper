import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const palette = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];
const readable = (value) => value && typeof value === "object" ? Object.values(value).join(" · ") : String(value ?? "—");
const number = (value) => typeof value === "number" && Number.isFinite(value);
function chartRows(rows) {
  return rows.map((row, index) => { const entries = Object.entries(row); const valueEntry = entries.find(([key, value]) => key !== "_id" && number(value)) || entries.find(([, value]) => number(value)); const labelEntry = entries.find(([key, value]) => key !== valueEntry?.[0] && (key === "_id" || !number(value))); return { ...row, __label: readable(labelEntry?.[1] ?? index + 1), __value: valueEntry?.[1] ?? 0 }; });
}
const tooltipStyle = { background: "rgba(13,11,15,.96)", border: "1px solid rgba(201,68,158,.5)", borderRadius: 10, color: "#f7f4ff", fontSize: 12 };

function SortableTable({ rows }) {
  const columns = useMemo(() => [...new Set(rows.flatMap(Object.keys))].filter((key) => key !== "__v"), [rows]); const [sort, setSort] = useState({ key: null, direction: 1 });
  const sorted = useMemo(() => sort.key ? [...rows].sort((a, b) => { const left = readable(a[sort.key]); const right = readable(b[sort.key]); return left.localeCompare(right, undefined, { numeric: true }) * sort.direction; }) : rows, [rows, sort]);
  const toggle = (key) => setSort((current) => ({ key, direction: current.key === key ? -current.direction : 1 }));
  return <div className="result-table-scroll"><Table><TableHeader><TableRow>{columns.map((column) => <TableHead key={column}><button onClick={() => toggle(column)}>{column}{sort.key === column ? (sort.direction === 1 ? " ↑" : " ↓") : ""}</button></TableHead>)}</TableRow></TableHeader><TableBody>{sorted.map((row, index) => <TableRow key={row._id || index}>{columns.map((column) => <TableCell key={column}>{readable(row[column])}</TableCell>)}</TableRow>)}</TableBody></Table></div>;
}

export function DynamicChart({ data }) {
  const rows = data?.data; const normalized = useMemo(() => chartRows(rows || []), [rows]);
  if (!rows?.length) return <div className="chart-empty">No results for that query</div>;
  if (data.chartType === "table") return <SortableTable rows={rows} />;
  return <div className="dynamic-chart" role="img" aria-label={data.title}>
    <ResponsiveContainer width="100%" height={240}>
      {data.chartType === "pie" ? <PieChart><Tooltip contentStyle={tooltipStyle} /><Pie data={normalized} dataKey="__value" nameKey="__label" cx="50%" cy="45%" outerRadius={76} paddingAngle={2} isAnimationActive label={({ percent }) => percent >= .05 ? `${Math.round(percent * 100)}%` : ""} labelLine={false}>{normalized.map((_, index) => <Cell key={index} fill={palette[index % palette.length]} />)}</Pie><Legend verticalAlign="bottom" height={32} wrapperStyle={{ fontSize: 11 }} /></PieChart>
        : data.chartType === "line" ? <LineChart data={normalized} margin={{ top: 10, right: 12, left: -18, bottom: 28 }}><CartesianGrid stroke="rgba(255,255,255,.06)" vertical={false} /><XAxis dataKey="__label" tick={{ fill: "#9c97aa", fontSize: 10 }} angle={-25} textAnchor="end" height={48} /><YAxis tick={{ fill: "#9c97aa", fontSize: 10 }} /><Tooltip contentStyle={tooltipStyle} /><Line type="monotone" dataKey="__value" stroke="var(--chart-1)" strokeWidth={3} dot={{ fill: "var(--chart-2)", strokeWidth: 0, r: 4 }} activeDot={{ r: 6 }} isAnimationActive /></LineChart>
          : <BarChart data={normalized} margin={{ top: 10, right: 12, left: -18, bottom: 30 }}><defs><linearGradient id="bar-gradient" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stopColor="var(--chart-1)" /><stop offset="100%" stopColor="var(--chart-2)" /></linearGradient></defs><CartesianGrid stroke="rgba(255,255,255,.06)" vertical={false} /><XAxis dataKey="__label" tick={{ fill: "#9c97aa", fontSize: 10 }} angle={-25} textAnchor="end" height={52} interval={0} tickFormatter={(value) => value.length > 13 ? `${value.slice(0, 12)}…` : value} /><YAxis tick={{ fill: "#9c97aa", fontSize: 10 }} /><Tooltip contentStyle={tooltipStyle} /><Bar dataKey="__value" fill="url(#bar-gradient)" radius={[6, 6, 0, 0]} isAnimationActive /></BarChart>}
    </ResponsiveContainer>
  </div>;
}
