import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useTiltMotion } from "@/hooks/useTiltMotion";
export function Card({ className, ...props }) { const tilt = useTiltMotion(5); return <motion.section className={cn("card", className)} {...tilt} {...props} />; }
export function CardHeader({ className, ...props }) { return <div className={cn("card-header", className)} {...props} />; }
export function CardTitle({ className, ...props }) { return <h2 className={cn("card-title", className)} {...props} />; }
export function CardDescription({ className, ...props }) { return <p className={cn("muted", className)} {...props} />; }
export function CardContent({ className, ...props }) { return <div className={cn("card-content", className)} {...props} />; }
