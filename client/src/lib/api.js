import axios from "axios";
export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api", timeout: 5000 });
export async function runQuery(question) { const { data } = await api.post("/query", { question }, { timeout: 60000 }); return data; }
export async function getCollectionData(collection, page = 1, limit = 10) { const { data } = await api.get(`/data/${collection}`, { params: { page, limit } }); return data; }
export async function getQueryHistory() { const { data } = await api.get("/history"); return data; }
