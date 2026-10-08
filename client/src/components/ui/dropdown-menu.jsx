import { createContext, useContext, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
const MenuContext = createContext();
export function DropdownMenu({ children }) {
  const [open, setOpen] = useState(false); const ref = useRef(null);
  useEffect(() => { const close = (event) => { if (!ref.current?.contains(event.target)) setOpen(false); }; document.addEventListener("mousedown", close); return () => document.removeEventListener("mousedown", close); }, []);
  return <MenuContext.Provider value={{ open, setOpen }}><div className="dropdown-root" ref={ref}>{children}</div></MenuContext.Provider>;
}
export function DropdownMenuTrigger({ children }) { const { open, setOpen } = useContext(MenuContext); return <span onClick={() => setOpen(!open)}>{children}</span>; }
export function DropdownMenuContent({ children, className }) { const { open } = useContext(MenuContext); return open ? <div className={cn("dropdown", className)}>{children}</div> : null; }
export function DropdownMenuItem({ children, className, onClick }) { const { setOpen } = useContext(MenuContext); return <button className={cn("dropdown-item", className)} onClick={(event) => { onClick?.(event); setOpen(false); }}>{children}</button>; }
