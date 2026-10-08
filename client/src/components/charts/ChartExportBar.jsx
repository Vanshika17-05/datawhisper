import { Download, ImageDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { exportChartAsPng, exportDataAsCsv } from "@/lib/export";

export function ChartExportBar({ data, chartRef }) {
  const png = async () => { try { await exportChartAsPng(chartRef.current, data.title); toast.success("PNG exported"); } catch (error) { toast.error(error.message || "PNG export failed"); } };
  const csv = () => { try { exportDataAsCsv(data.data, data.title); toast.success("CSV exported"); } catch (error) { toast.error(error.message || "CSV export failed"); } };
  return <div className="chart-export-bar"><Button variant="ghost" onClick={png}><ImageDown size={14} /> Export PNG</Button><Button variant="ghost" onClick={csv}><Download size={14} /> Export CSV</Button></div>;
}
