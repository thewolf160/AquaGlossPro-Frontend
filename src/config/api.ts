import axios, { type AxiosInstance } from "axios";
import dotenv from "dotenv";

dotenv.config();

const api: AxiosInstance = axios.create({
  baseURL: process.env.BACK_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
