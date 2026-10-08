import { useCallback, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import TypewriterText from "./TypewriterText";
import { DynamicChart } from "@/components/charts/DynamicChart";
import { ChartExportBar } from "@/components/charts/ChartExportBar";

export function ChatMessage({ role, content, chartData, isStreaming = false, onStreamComplete }) {
  const reduced = useReducedMotion(); const assistant = role === "assistant"; const chartRef = useRef(null); const [textComplete, setTextComplete] = useState(!isStreaming);
  const complete = useCallback(() => { setTextComplete(true); onStreamComplete?.(); }, [onStreamComplete]);
  return <motion.div className={`chat-message-row ${role}`} initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3, ease: "easeOut" }}>
    {assistant && <span className="ai-badge"><Sparkles size={14} /></span>}
    <div className={`chat-message-bubble ${chartData ? "has-chart" : ""}`}><div>{assistant && isStreaming ? <TypewriterText text={content} onComplete={complete} /> : content}</div>{chartData && textComplete && <motion.div className="chart-result" initial={reduced ? false : { opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .35, ease: "easeOut" }}><div ref={chartRef} className="chart-capture"><h4>{chartData.title}</h4><DynamicChart data={chartData} /></div><ChartExportBar data={chartData} chartRef={chartRef} /></motion.div>}</div>
  </motion.div>;
}
