import { useEffect, useState } from "react";
import { BarChart3, Clock3, LineChart, PieChart, Table2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { getQueryHistory } from "@/lib/api";

const icons = { bar: BarChart3, pie: PieChart, line: LineChart, table: Table2 };
function relativeTime(value) { const seconds = Math.max(1, Math.floor((Date.now() - new Date(value).getTime()) / 1000)); if (seconds < 60) return "just now"; if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`; if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`; return `${Math.floor(seconds / 86400)}d ago`; }

export function QueryHistory({ open, onClose, onSelect, refreshKey }) {
  const [history, setHistory] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  useEffect(() => { let active = true; getQueryHistory().then((response) => { if (active) { setHistory(response.history || []); setError(""); } }).catch(() => { if (active) setError("History could not be loaded"); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, [refreshKey]);
  return <Sheet><SheetContent open={open} onClose={onClose} className="history-sheet"><SheetHeader><div><p className="eyebrow"><Clock3 size={14} /> Recent queries</p><SheetTitle>Query history</SheetTitle></div><Button variant="ghost" size="icon" onClick={onClose} aria-label="Close history"><X size={18} /></Button></SheetHeader><div className="history-list">{loading ? <><Skeleton /><Skeleton /><Skeleton /></> : error ? <p className="history-empty">{error}</p> : history.length ? history.map((item) => { const Icon = icons[item.chartType] || Table2; return <button key={item._id} className="history-row" onClick={() => { onSelect(item.question); onClose(); }}><span className="history-icon"><Icon size={15} /></span><span><strong>{item.question}</strong><small>{relativeTime(item.timestamp)} · {item.chartType}</small></span></button>; }) : <p className="history-empty">Your successful queries will appear here.</p>}</div></SheetContent></Sheet>;
}
