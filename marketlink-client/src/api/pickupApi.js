import api from "./axiosInstance";
export const getPickupSlots = (params={}) => api.get("/pickup-slots", { params });
export const getFarmerSlots = () => api.get("/pickup-slots/farmer");
export const createPickupSlot = (payload) => api.post("/pickup-slots", payload);
export const updatePickupSlot = (id,payload) => api.put(`/pickup-slots/${id}`, payload);
export const deletePickupSlot = (id) => api.delete(`/pickup-slots/${id}`);
