import { motion, useReducedMotion } from "framer-motion";
import { MessageSquareText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "./Header";
import { MobileChatSheet } from "./MobileChatSheet";
import { useState } from "react";

export function AppShell({ main, chat }) {
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const reduced = useReducedMotion();
  const panel = (delay) => reduced ? {} : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: .4, delay, ease: "easeOut" } };
  return <div className="app-shell"><Header /><main className="split-layout"><motion.div className="data-panel" {...panel(.08)}>{main}</motion.div><motion.aside className="chat-column" {...panel(.16)}>{chat}</motion.aside></main>
    <Button className="mobile-chat-button" size="icon" aria-label="Open chat" onClick={() => setMobileChatOpen(true)}><MessageSquareText size={20} /></Button>
    <MobileChatSheet open={mobileChatOpen} onClose={() => setMobileChatOpen(false)}>{chat}</MobileChatSheet>
  </div>;
}
