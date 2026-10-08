import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getCollectionData } from "@/lib/api";

const hidden = new Set(["_id", "__v"]);
const formatLabel = (value) => value.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (letter) => letter.toUpperCase());
function formatValue(value, key) { if (value == null) return "—"; if (key.toLowerCase().includes("date")) return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(value)); if (typeof value === "number") return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(value); if (typeof value === "object") return JSON.stringify(value); return String(value); }

export function DataTable({ collection }) {
  const [page, setPage] = useState(1); const requestKey = `${collection}:${page}`; const [state, setState] = useState({ key: "", data: [], pagination: null, error: "" });
  useEffect(() => { let active = true; getCollectionData(collection, page, 10).then((response) => { if (active) setState({ key: requestKey, data: response.data || [], pagination: response.pagination, error: "" }); }).catch(() => { if (active) setState({ key: requestKey, data: [], pagination: null, error: "Data could not be loaded" }); }); return () => { active = false; }; }, [collection, page, requestKey]);
  if (state.key !== requestKey) return <div className="table-loading"><Skeleton /><Skeleton /><Skeleton /><Skeleton /><Skeleton /></div>;
  if (state.error) return <div className="table-empty">{state.error}</div>;
  if (!state.data.length) return <div className="table-empty">No {collection} found</div>;
  const columns = Object.keys(state.data[0]).filter((key) => !hidden.has(key));
  return <div className="data-table"><Table><TableHeader><TableRow>{columns.map((column) => <TableHead key={column}>{formatLabel(column)}</TableHead>)}</TableRow></TableHeader><TableBody>{state.data.map((row) => <TableRow key={row._id}>{columns.map((column) => <TableCell key={column}>{formatValue(row[column], column)}</TableCell>)}</TableRow>)}</TableBody></Table><div className="pagination"><span>Page {state.pagination.page} of {state.pagination.pages || 1} · {state.pagination.total} records</span><div><Button variant="ghost" size="icon" aria-label="Previous page" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}><ChevronLeft size={17} /></Button><Button variant="ghost" size="icon" aria-label="Next page" disabled={page >= state.pagination.pages} onClick={() => setPage((value) => value + 1)}><ChevronRight size={17} /></Button></div></div></div>;
}
