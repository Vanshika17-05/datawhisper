import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import TypewriterText from "./TypewriterText";

export function ChatMessage({ role, content, isStreaming = false, onStreamComplete }) {
  const reduced = useReducedMotion();
  const assistant = role === "assistant";
  return <motion.div className={`chat-message-row ${role}`} initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3, ease: "easeOut" }}>
    {assistant && <span className="ai-badge"><Sparkles size={14} /></span>}
    <div className="chat-message-bubble">{assistant && isStreaming ? <TypewriterText text={content} onComplete={onStreamComplete} /> : content}</div>
  </motion.div>;
}
