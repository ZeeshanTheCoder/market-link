import api from "./axiosInstance";
export const updateProfile = (payload) => api.put("/users/profile", payload);
