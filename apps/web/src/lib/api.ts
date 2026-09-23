import axios from "axios";

const getBaseURL = () => {
  if (typeof window !== "undefined") {
    return "https://tijara-api.onrender.com/api/v1";
  }
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = "Bearer " + token;
  }
  return config;
});

export default api;
