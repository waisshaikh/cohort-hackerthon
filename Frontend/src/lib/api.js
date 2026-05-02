import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("tenantDesk_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("tenantDesk_token");
      localStorage.removeItem("tenantDesk_user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export const getErrorMessage = (error, fallback = "Something went wrong") => {
  const data = error?.response?.data;

  if (data?.message) return data.message;
  if (Array.isArray(data?.errors) && data.errors[0]?.msg) {
    return data.errors[0].msg;
  }

  return fallback;
};

export default api;
