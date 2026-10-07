import { createContext, useContext, useState } from "react";
import { cn } from "@/lib/utils";
const TabsContext = createContext();
export function Tabs({ defaultValue, className, children }) { const [value, setValue] = useState(defaultValue); return <TabsContext.Provider value={{ value, setValue }}><div className={className}>{children}</div></TabsContext.Provider>; }
export function TabsList({ className, ...props }) { return <div role="tablist" className={cn("tabs-list", className)} {...props} />; }
export function TabsTrigger({ value, className, ...props }) { const tabs = useContext(TabsContext); return <button role="tab" aria-selected={tabs.value === value} className={cn("tab", className)} onClick={() => tabs.setValue(value)} {...props} />; }
export function TabsContent({ value, className, ...props }) { const tabs = useContext(TabsContext); return tabs.value === value ? <div role="tabpanel" className={className} {...props} /> : null; }
