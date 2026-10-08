import { toPng } from "html-to-image";

const fileName = (title, extension) => `${(title || "datawhisper-result").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "datawhisper-result"}.${extension}`;
const download = (href, name) => { const anchor = document.createElement("a"); anchor.href = href; anchor.download = name; document.body.appendChild(anchor); anchor.click(); anchor.remove(); };

export async function exportChartAsPng(node, title) {
  if (!node) throw new Error("Chart is not ready to export");
  const dataUrl = await toPng(node, { cacheBust: true, pixelRatio: 2, backgroundColor: "#13111a" });
  download(dataUrl, fileName(title, "png"));
}

function flattenRow(row) { return Object.fromEntries(Object.entries(row || {}).flatMap(([key, value]) => value && typeof value === "object" && !Array.isArray(value) ? Object.entries(value).map(([nestedKey, nestedValue]) => [`${key}.${nestedKey}`, nestedValue]) : [[key, value]])); }
const csvCell = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
export function exportDataAsCsv(rows, title) {
  const flatRows = (rows || []).map(flattenRow); if (!flatRows.length) throw new Error("There is no data to export");
  const columns = [...new Set(flatRows.flatMap(Object.keys))];
  const csv = [columns.map(csvCell).join(","), ...flatRows.map((row) => columns.map((column) => csvCell(row[column])).join(","))].join("\r\n");
  const url = URL.createObjectURL(new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" })); download(url, fileName(title, "csv")); window.setTimeout(() => URL.revokeObjectURL(url), 0);
}
