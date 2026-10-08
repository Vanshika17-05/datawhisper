export function Sheet({ children }) { return children; }
export function SheetContent({ children, open, onClose, className = "" }) { return open ? <div className="sheet-overlay" onClick={onClose}><aside className={`sheet ${className}`} role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>{children}</aside></div> : null; }
export function SheetHeader({ children }) { return <header className="sheet-header">{children}</header>; }
export function SheetTitle({ children }) { return <h2 className="sheet-title">{children}</h2>; }
