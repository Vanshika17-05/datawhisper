import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp, History, MessageSquareText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatMessage } from "./ChatMessage";
import { QueryHistory } from "@/components/history/QueryHistory";
import { runQuery } from "@/lib/api";

const id = () => crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`;
function summary(response) { const count = response.data?.length || 0; const noun = count === 1 ? "result" : "results"; const description = { pie: "the breakdown", line: "the trend", bar: "the comparison", table: "the details" }[response.chartType] || "the result"; return `Found ${count} ${noun} for “${response.title}” — here's ${description}.`; }

export function ChatPanel() {
  const [messages, setMessages] = useState([]); const [isLoading, setIsLoading] = useState(false); const [input, setInput] = useState(""); const [historyOpen, setHistoryOpen] = useState(false); const [historyRefresh, setHistoryRefresh] = useState(0); const bottomRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, [messages, isLoading]);
  const ask = async (question) => {
    const clean = question.trim(); if (!clean || isLoading) return;
    setMessages((current) => [...current, { id: id(), role: "user", content: clean }].slice(-20)); setInput(""); setIsLoading(true);
    try {
      const response = await runQuery(clean);
      const assistant = response.success ? { id: id(), role: "assistant", content: summary(response), chartData: { chartType: response.chartType, data: response.data, title: response.title, collection: response.collection }, isStreaming: true } : { id: id(), role: "assistant", content: response.message || "I couldn't understand that query. Try rephrasing it.", isStreaming: true };
      setMessages((current) => [...current, assistant].slice(-20)); if (response.success) setHistoryRefresh((value) => value + 1);
    } catch (error) {
      const slowDown = error.response?.status === 429; const content = error.response?.data?.message || (slowDown ? "You've asked several questions quickly. Please slow down and try again in a few minutes." : "I couldn't reach the query service. Please try again.");
      setMessages((current) => [...current, { id: id(), role: "assistant", content, isStreaming: true }].slice(-20));
    } finally { setIsLoading(false); }
  };
  const submit = (event) => { event.preventDefault(); ask(input); };
  const finishStreaming = (messageId) => setMessages((current) => current.map((message) => message.id === messageId ? { ...message, isStreaming: false } : message));
  return <Card className="chat-card"><CardHeader><div className="chat-heading-row"><div><div className="eyebrow"><MessageSquareText size={16} /> Conversation</div><CardTitle>Ask your data</CardTitle><CardDescription>Explore your database without writing a query.</CardDescription></div><Button className="history-button" variant="ghost" size="icon" onClick={() => setHistoryOpen(true)} aria-label="Open query history"><History size={17} /></Button></div></CardHeader><CardContent className="chat-content">{messages.length || isLoading ? <div className="message-list">{messages.map((message) => <ChatMessage key={message.id} {...message} onStreamComplete={() => finishStreaming(message.id)} />)}{isLoading && <div className="chat-message-row assistant"><span className="ai-badge"><MessageSquareText size={14} /></span><div className="chat-message-bubble typing-bubble" aria-label="Datawhisper is thinking"><motion.span animate={{ opacity: [.25, 1, .25] }} transition={{ repeat: Infinity, duration: 1 }} /><motion.span animate={{ opacity: [.25, 1, .25] }} transition={{ repeat: Infinity, duration: 1, delay: .15 }} /><motion.span animate={{ opacity: [.25, 1, .25] }} transition={{ repeat: Infinity, duration: 1, delay: .3 }} /></div></div>}<div ref={bottomRef} /></div> : <div className="chat-empty"><span className="empty-icon"><MessageSquareText size={24} /></span><h3>Start a conversation</h3><p>Ask anything about your data in plain English.</p></div>}<form className="chat-input-wrap" onSubmit={submit}><Input aria-label="Question" placeholder="e.g. Show sales by city" value={input} onChange={(event) => setInput(event.target.value)} disabled={isLoading} /><Button size="icon" type="submit" disabled={isLoading || !input.trim()} aria-label="Send question"><ArrowUp size={18} /></Button></form><p className="input-hint">Datawhisper can make mistakes. Verify important results.</p></CardContent><QueryHistory open={historyOpen} onClose={() => setHistoryOpen(false)} onSelect={ask} refreshKey={historyRefresh} /></Card>;
}
