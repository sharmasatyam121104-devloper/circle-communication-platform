import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      await api.get("/user/refresh-token");

      return api(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default api;