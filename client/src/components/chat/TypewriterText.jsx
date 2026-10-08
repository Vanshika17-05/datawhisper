import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function TypewriterText({ text, speed = 35, onComplete, className, cursor = true, startDelay = 0 }) {
  const reducedMotion = useReducedMotion();
  const words = useMemo(() => text.trim() ? text.trim().split(/\s+/) : [], [text]);
  const [stream, setStream] = useState({ text, count: reducedMotion ? words.length : 0 });
  const visibleCount = stream.text === text ? stream.count : 0;

  useEffect(() => {
    let intervalId; let timeoutId; let cancelled = false;
    if (reducedMotion || words.length === 0) {
      timeoutId = window.setTimeout(() => { if (!cancelled) { setStream({ text, count: words.length }); onComplete?.(); } }, 0);
      return () => { cancelled = true; window.clearTimeout(timeoutId); };
    }
    timeoutId = window.setTimeout(() => {
      let count = 1;
      setStream({ text, count: 1 });
      if (words.length === 1) { onComplete?.(); return; }
      intervalId = window.setInterval(() => {
        count += 1;
        setStream({ text, count: Math.min(count, words.length) });
        if (count >= words.length) { window.clearInterval(intervalId); onComplete?.(); }
      }, Math.max(10, speed));
    }, Math.max(0, startDelay));
    return () => { cancelled = true; window.clearTimeout(timeoutId); window.clearInterval(intervalId); };
  }, [text, speed, startDelay, reducedMotion, words.length, onComplete]);

  const streaming = !reducedMotion && visibleCount < words.length;
  return <span className={cn("typewriter-text", className)}>{words.slice(0, visibleCount).join(" ")}{visibleCount > 0 && streaming ? " " : ""}{cursor && streaming && <span className="typewriter-cursor" aria-hidden="true" />}</span>;
}
