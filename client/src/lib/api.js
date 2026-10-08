import axios from "axios";
export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api", timeout: 5000 });
export async function runQuery(question) { const { data } = await api.post("/query", { question }, { timeout: 60000 }); return data; }
export async function getCollectionData(collection, page = 1, limit = 10) { const { data } = await api.get(`/data/${collection}`, { params: { page, limit } }); return data; }
export async function getQueryHistory() { const { data } = await api.get("/history"); return data; }
export async function getSimilarQuestions(question, signal) { const { data } = await api.post("/history/similar", { question }, { signal, timeout: 20000 }); return data; }
export async function getAnalyticsSummary() { const { data } = await api.get("/analytics/summary"); return data; }
export async function uploadExport(queryHistoryId, format, blob) { const { data } = await api.post(`/exports/${queryHistoryId}/${format}`, blob, { headers: { "Content-Type": blob.type } }); return data; }
export async function getExports() { const { data } = await api.get("/exports"); return data; }
