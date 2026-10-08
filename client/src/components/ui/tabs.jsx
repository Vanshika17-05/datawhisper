import { createContext, useContext, useState } from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
const TabsContext = createContext();
export function Tabs({ defaultValue, className, children }) { const [value, setValue] = useState(defaultValue); return <TabsContext.Provider value={{ value, setValue }}><div className={className}>{children}</div></TabsContext.Provider>; }
export function TabsList({ className, ...props }) { return <div role="tablist" className={cn("tabs-list", className)} {...props} />; }
export function TabsTrigger({ value, className, ...props }) { const tabs = useContext(TabsContext); return <button role="tab" aria-selected={tabs.value === value} className={cn("tab", className)} onClick={() => tabs.setValue(value)} {...props} />; }
export function TabsContent({ value, className, ...props }) { const tabs = useContext(TabsContext); const reduced = useReducedMotion(); return <AnimatePresence mode="wait">{tabs.value === value && <motion.div key={value} role="tabpanel" className={className} initial={reduced ? false : { opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={reduced ? { opacity: 1 } : { opacity: 0, x: -10 }} transition={{ duration: .2, ease: "easeOut" }} {...props} />}</AnimatePresence>; }
