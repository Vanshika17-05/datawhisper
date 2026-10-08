import { X } from "lucide-react";
import { Button } from "./button";
export function Dialog({ children }) { return children; }
export function DialogContent({ children, open, onClose }) { return open ? <div className="dialog-backdrop" onClick={onClose}><div role="dialog" aria-modal="true" className="dialog" onClick={(event) => event.stopPropagation()}><Button className="dialog-close" variant="ghost" size="icon" onClick={onClose} aria-label="Close"><X size={17} /></Button>{children}</div></div> : null; }
export function DialogTitle({ children }) { return <h2 className="dialog-title">{children}</h2>; }
