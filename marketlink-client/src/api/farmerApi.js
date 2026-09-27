import api from "./axiosInstance";
export const getFarmers = () => api.get("/farmers");
export const getFarmer = (id) => api.get(`/farmers/${id}`);
export const getFarmerProducts = (id) => api.get(`/farmers/${id}/products`);
export const updateFarmerProfile = (payload) => api.put("/farmers/profile", payload);
export const getFarmerDashboard = () => api.get("/farmers/me/dashboard");
export const getFarmerOrders = () => api.get("/orders/farmer");
