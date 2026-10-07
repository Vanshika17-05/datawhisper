export function Dialog({ children }) { return children; }
export function DialogContent({ children, open }) { return open ? <div role="dialog" className="dialog">{children}</div> : null; }
export function DialogTitle({ children }) { return <h2>{children}</h2>; }
