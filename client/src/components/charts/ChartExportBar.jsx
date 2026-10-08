import { Download, ImageDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { exportChartAsPng, exportDataAsCsv } from "@/lib/export";
import { uploadExport } from "@/lib/api";

export function ChartExportBar({ data, chartRef }) {
  const store = async (format, blob) => { if (!data.queryHistoryId) return false; await uploadExport(data.queryHistoryId, format, blob); return true; };
  const png = async () => { try { const { blob } = await exportChartAsPng(chartRef.current, data.title); const saved = await store("png", blob); toast.success(saved ? "PNG downloaded and saved to exports" : "PNG downloaded"); } catch (error) { toast.error(error.response?.data?.error || error.message || "PNG export failed"); } };
  const csv = async () => { try { const { blob } = exportDataAsCsv(data.data, data.title); const saved = await store("csv", blob); toast.success(saved ? "CSV downloaded and saved to exports" : "CSV downloaded"); } catch (error) { toast.error(error.response?.data?.error || error.message || "CSV export failed"); } };
  return <div className="chart-export-bar"><Button variant="ghost" onClick={png}><ImageDown size={14} /> Export PNG</Button><Button variant="ghost" onClick={csv}><Download size={14} /> Export CSV</Button></div>;
}
