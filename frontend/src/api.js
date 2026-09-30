import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  timeout: 30000,
});

export const getDatasets = async () => (await api.get("/api/datasets")).data;
export const getMethods = async () => (await api.get("/api/methods")).data;
export const getLiterature = async () => (await api.get("/api/literature")).data;
export const runExperiment = async (payload) => (await api.post("/api/experiment", payload)).data;
export const getAblation = async () => (await api.get("/api/ablation")).data;
