export function Sheet({ children }) { return children; }
export function SheetContent({ children, open, className = "" }) { return open ? <div className={`sheet ${className}`}>{children}</div> : null; }
export function SheetHeader({ children }) { return <header>{children}</header>; }
export function SheetTitle({ children }) { return <h2>{children}</h2>; }
