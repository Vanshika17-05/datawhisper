import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { Dashboard } from "@/pages/Dashboard";
export default function App() { return <BrowserRouter><Routes><Route path="*" element={<Dashboard />} /></Routes><Toaster /></BrowserRouter>; }
