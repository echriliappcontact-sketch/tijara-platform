import axios from "axios";

const baseURL = typeof window !== "undefined"
  ? (window as any).__NEXT_DATA__?.props?.pageProps?.apiUrl || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1"
  : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

const api = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  headers: { "Content-Type": "application/json" },
});

// Override baseURL on client side
if (typeof window !== "undefined") {
  const stored = localStorage.getItem("api_url");
  if (stored) {
    api.defaults.baseURL = stored;
  } else {
    api.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";
  }
}

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = "Bearer " + token;
  }
  return config;
});

export default api;
