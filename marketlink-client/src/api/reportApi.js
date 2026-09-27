import api from "./axiosInstance";
export const createAdminReport = (payload) => api.post("/admin/reports", payload);
export const downloadAdminReport = (id) => api.get(`/admin/reports/${id}/download`, { responseType: "blob" });
