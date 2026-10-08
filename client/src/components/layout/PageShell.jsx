import { Header } from "./Header";
export function PageShell({ children }) { return <div className="app-shell page-shell"><Header /><main className="page-content">{children}</main></div>; }
