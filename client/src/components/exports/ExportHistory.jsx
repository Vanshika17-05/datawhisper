import { useEffect, useState } from "react";
import { Download, FileImage, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getExports } from "@/lib/api";

const sizeLabel = (bytes) => bytes < 1024 ? `${bytes} B` : bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
const dateLabel = (value) => new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));

export function ExportHistory() {
  const [exports, setExports] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  useEffect(() => { let active = true; getExports().then((response) => { if (active) setExports(response.exports || []); }).catch(() => { if (active) setError("Exports could not be loaded. Check the S3 configuration."); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, []);
  if (loading) return <div className="exports-list"><Skeleton /><Skeleton /><Skeleton /></div>;
  if (error) return <p className="exports-empty">{error}</p>;
  if (!exports.length) return <p className="exports-empty">Export a chart or table to keep a downloadable copy here.</p>;
  return <div className="exports-list">{exports.map((item) => <div className="export-row" key={item.key}><span className="connection-icon">{item.format === "png" ? <FileImage size={18} /> : <FileSpreadsheet size={18} />}</span><div><strong>{item.title || item.question || "Datawhisper export"}</strong><small>{item.format.toUpperCase()} · {sizeLabel(item.size)} · {dateLabel(item.createdAt)}</small></div><Button variant="ghost" size="icon" onClick={() => window.open(item.url, "_blank", "noopener,noreferrer")} aria-label={`Download ${item.format.toUpperCase()} export`}><Download size={16} /></Button></div>)}</div>;
}
