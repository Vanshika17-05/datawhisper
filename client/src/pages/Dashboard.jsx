import { Database } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

function DataPlaceholder() {
  return <Card className="data-card"><CardHeader><div className="eyebrow"><Database size={16} /> Database preview</div><CardTitle>Your data will appear here</CardTitle><CardDescription>Connect your collections, then ask questions to reveal insights.</CardDescription></CardHeader><CardContent><Tabs defaultValue="orders"><TabsList><TabsTrigger value="orders">Orders</TabsTrigger><TabsTrigger value="employees">Employees</TabsTrigger><TabsTrigger value="sales">Sales</TabsTrigger></TabsList>{["orders", "employees", "sales"].map((tab) => <TabsContent key={tab} value={tab} className="skeleton-grid"><Skeleton className="skeleton-metric" /><Skeleton className="skeleton-metric" /><Skeleton className="skeleton-metric" /><Skeleton className="skeleton-chart" /><div className="skeleton-lines"><Skeleton /><Skeleton /><Skeleton /><Skeleton /></div></TabsContent>)}</Tabs></CardContent></Card>;
}

export function Dashboard() { return <AppShell main={<DataPlaceholder />} chat={<ChatPanel />} />; }
