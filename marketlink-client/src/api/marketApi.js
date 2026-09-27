import api from "./axiosInstance";
export const getMarkets = (params={}) => api.get("/markets", { params });
export const getMarket = (id) => api.get(`/markets/${id}`);
export const createMarket = (payload) => api.post("/markets", payload);
export const updateMarket = (id,payload) => api.put(`/markets/${id}`, payload);
export const deleteMarket = (id) => api.delete(`/markets/${id}`);
