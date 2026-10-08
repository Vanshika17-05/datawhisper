import { Database } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/tables/DataTable";

function DataBrowser() {
  return <Card className="data-card"><CardHeader><div className="eyebrow"><Database size={16} /> Database preview</div><CardTitle>Browse your data</CardTitle><CardDescription>Explore live Orders, Employees, and Sales records while you ask questions.</CardDescription></CardHeader><CardContent><Tabs defaultValue="orders"><TabsList><TabsTrigger value="orders">Orders</TabsTrigger><TabsTrigger value="employees">Employees</TabsTrigger><TabsTrigger value="sales">Sales</TabsTrigger></TabsList>{["orders", "employees", "sales"].map((tab) => <TabsContent key={tab} value={tab} className="live-table-panel"><DataTable collection={tab} /></TabsContent>)}</Tabs></CardContent></Card>;
}

export function Dashboard() { return <AppShell main={<DataBrowser />} chat={<ChatPanel />} />; }
