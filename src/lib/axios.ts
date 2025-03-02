import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request/response interceptors for debugging
api.interceptors.request.use(
  (config) => {
    console.log(
      `🚀 [API] ${config.method?.toUpperCase()} ${config.url}`,
      config.data || ""
    );
    return config;
  },
  (error) => {
    console.error("❌ [API Request Error]:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`✅ [API] Response:`, response.data);
    return response;
  },
  (error) => {
    console.error(
      "❌ [API Response Error]:",
      error.response?.data || error.message
    );
    return Promise.reject(error);
  }
);

export default api;
