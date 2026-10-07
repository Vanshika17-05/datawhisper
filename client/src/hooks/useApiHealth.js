import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export function useApiHealth() {
  const [status, setStatus] = useState("checking");
  useEffect(() => {
    const controller = new AbortController();
    api.get("/health", { signal: controller.signal }).then(() => setStatus("online")).catch((error) => { if (error.name !== "CanceledError") setStatus("offline"); });
    return () => controller.abort();
  }, []);
  return status;
}
