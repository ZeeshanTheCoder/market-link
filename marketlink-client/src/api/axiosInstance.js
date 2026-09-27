import axios from "axios";
import { TOKEN_KEY } from "../utils/constants";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Normalize errors: 401, 403, 404, 422, 500
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const serverMessage = error.response?.data?.message;

    let message = serverMessage;
    if (!error.response) {
      message = "Cannot reach the server. Please check your connection.";
    } else if (!message) {
      const defaults = {
        401: "Your session has expired. Please log in again.",
        403: "You do not have permission to do this.",
        404: "The requested item was not found.",
        422: "Some of the details you entered are invalid.",
        500: "Something went wrong on our side. Please try again.",
      };
      message = defaults[status] || "Something went wrong.";
    }

    if (status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      // AuthContext (next phase) listens for this and redirects to /login
      window.dispatchEvent(new Event("auth:unauthorized"));
    }

    error.userMessage = message;
    error.fieldErrors = error.response?.data?.errors || null; // for 422
    return Promise.reject(error);
  }
);

export default api;
