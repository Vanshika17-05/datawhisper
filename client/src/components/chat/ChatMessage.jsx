import { useCallback, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import TypewriterText from "./TypewriterText";
import { DynamicChart } from "@/components/charts/DynamicChart";
import { ChartExportBar } from "@/components/charts/ChartExportBar";
import { useTiltMotion } from "@/hooks/useTiltMotion";

export function ChatMessage({ role, content, chartData, isStreaming = false, onStreamComplete }) {
  const reduced = useReducedMotion(); const assistant = role === "assistant"; const chartRef = useRef(null); const [textComplete, setTextComplete] = useState(!isStreaming);
  const tilt = useTiltMotion(4);
  const complete = useCallback(() => { setTextComplete(true); onStreamComplete?.(); }, [onStreamComplete]);
  return <motion.div className={`chat-message-row ${role}`} initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3, ease: "easeOut" }}>
    {assistant && <span className="ai-badge"><Sparkles size={14} /></span>}
    <motion.div className={`chat-message-bubble ${chartData ? "has-chart" : ""}`} {...tilt}><span className="chat-message-glow" aria-hidden="true" /><div className="chat-message-content">{assistant && isStreaming ? <TypewriterText text={content} onComplete={complete} /> : content}</div>{chartData && textComplete && <motion.div className="chart-result" initial={reduced ? false : { opacity: 0, scale: .95, y: 12, rotateX: 4 }} animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }} transition={{ type: "spring", stiffness: 210, damping: 20 }}><div ref={chartRef} className="chart-capture"><h4>{chartData.title}</h4><DynamicChart data={chartData} /></div><ChartExportBar data={chartData} chartRef={chartRef} /></motion.div>}</motion.div>
  </motion.div>;
}
