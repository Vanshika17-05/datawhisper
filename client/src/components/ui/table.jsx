import { motion, useReducedMotion } from "framer-motion";
import { useTiltMotion } from "@/hooks/useTiltMotion";
export const Table = (props) => <div className="table-wrap"><table {...props} /></div>;
export const TableHeader = (props) => <thead {...props} />; export const TableBody = (props) => <tbody {...props} />;
export function TableRow(props) { const tilt = useTiltMotion(2.5); const reduced = useReducedMotion(); return <motion.tr {...tilt} whileHover={reduced ? undefined : { scale: 1.004 }} {...props} />; }
export const TableHead = (props) => <th {...props} />; export const TableCell = (props) => <td {...props} />;
