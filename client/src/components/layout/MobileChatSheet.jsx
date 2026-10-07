import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MobileChatSheet({ open, onClose, children }) {
  // TODO: Replace this lightweight bottom sheet with richer chat interactions.
  if (!open) return null;
  return <div className="sheet-backdrop" onClick={onClose}><section className="mobile-sheet" role="dialog" aria-modal="true" aria-label="Ask your data" onClick={(event) => event.stopPropagation()}><Button className="sheet-close" variant="ghost" size="icon" onClick={onClose} aria-label="Close chat"><X size={18} /></Button>{children}</section></div>;
}
