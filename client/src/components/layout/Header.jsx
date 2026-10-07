import { motion, useReducedMotion } from "framer-motion";
import { DatabaseZap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useApiHealth } from "@/hooks/useApiHealth";

export function Header() {
  const status = useApiHealth();
  const reduced = useReducedMotion();
  return <motion.header className="site-header" initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .4, ease: "easeOut" }}>
    <a className="brand" href="/" aria-label="Datawhisper home"><span className="logo-mark"><DatabaseZap size={18} /></span><span>Datawhisper</span></a>
    <Badge className="status-badge"><span className={`status-dot ${status}`} /><span className="status-label">API {status}</span></Badge>
  </motion.header>;
}
