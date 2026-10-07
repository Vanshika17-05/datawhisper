import { ArrowUp, MessageSquareText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ChatPanel() {
  // TODO: Connect messages, prompt submission, streaming responses, and query results.
  return <Card className="chat-card"><CardHeader><div className="eyebrow"><MessageSquareText size={16} /> Conversation</div><CardTitle>Ask your data</CardTitle><CardDescription>Explore your database without writing a query.</CardDescription></CardHeader><CardContent className="chat-content"><div className="chat-empty"><span className="empty-icon"><MessageSquareText size={24} /></span><h3>Start a conversation</h3><p>Ask anything about your data in plain English.</p></div><div className="chat-input-wrap"><Input aria-label="Question" placeholder="e.g. Show sales by city" disabled /><Button size="icon" disabled aria-label="Send question"><ArrowUp size={18} /></Button></div><p className="input-hint">Query generation is coming next.</p></CardContent></Card>;
}
