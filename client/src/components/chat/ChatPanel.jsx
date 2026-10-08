import { useCallback, useState } from "react";
import { ArrowUp, MessageSquareText, Play } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatMessage } from "./ChatMessage";

export function ChatPanel() {
  const [demo, setDemo] = useState(false); const [streaming, setStreaming] = useState(false);
  const simulate = () => { setDemo(false); window.requestAnimationFrame(() => { setDemo(true); setStreaming(true); }); };
  const complete = useCallback(() => setStreaming(false), []);
  return <Card className="chat-card"><CardHeader><div className="chat-heading-row"><div><div className="eyebrow"><MessageSquareText size={16} /> Conversation</div><CardTitle>Ask your data</CardTitle><CardDescription>Explore your database without writing a query.</CardDescription></div>{import.meta.env.DEV && <Button className="simulate-button" variant="ghost" onClick={simulate}><Play size={14} /> Simulate response</Button>}</div></CardHeader><CardContent className="chat-content">{demo ? <div className="message-list"><ChatMessage role="user" content="Which region is growing fastest?" /><ChatMessage role="assistant" content="The western region is showing the strongest momentum, with consistent month-over-month growth across the latest reporting period." isStreaming={streaming} onStreamComplete={complete} /></div> : <div className="chat-empty"><span className="empty-icon"><MessageSquareText size={24} /></span><h3>Start a conversation</h3><p>Ask anything about your data in plain English.</p></div>}<div className="chat-input-wrap"><Input aria-label="Question" placeholder="e.g. Show sales by city" disabled /><Button size="icon" disabled aria-label="Send question"><ArrowUp size={18} /></Button></div><p className="input-hint">Query generation is coming next.</p></CardContent></Card>;
}
