import { DatabaseZap } from "lucide-react";
import { Link } from "react-router-dom";
export function AuthFrame({ children, footer }) { return <main className="auth-page"><div className="auth-glow" /><div className="auth-stack"><Link className="auth-brand" to="/"><span className="logo-mark"><DatabaseZap size={19} /></span><span>Datawhisper</span></Link>{children}{footer}</div></main>; }
