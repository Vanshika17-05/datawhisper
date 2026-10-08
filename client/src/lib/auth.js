import { api } from "./api";

const TOKEN_KEY = "datawhisper_token";
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => token ? localStorage.setItem(TOKEN_KEY, token) : localStorage.removeItem(TOKEN_KEY);

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use((response) => response, (error) => {
  const isCredentialError = error.config?.url?.includes("/auth/login") || error.response?.data?.error === "Current password is incorrect";
  if (error.response?.status === 401 && !isCredentialError) {
    setToken(null);
    if (window.location.pathname !== "/login") window.location.assign("/login");
  }
  return Promise.reject(error);
});
