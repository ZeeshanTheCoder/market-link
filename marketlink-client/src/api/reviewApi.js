import api from "./axiosInstance";
export const getProductReviews = (id) => api.get(`/reviews/product/${id}`);
export const getFarmerReviews = (id) => api.get(`/reviews/farmer/${id}`);
export const createReview = (payload) => api.post("/reviews", payload);
export const updateReview = (id,payload) => api.put(`/reviews/${id}`, payload);
export const deleteReview = (id) => api.delete(`/reviews/${id}`);
export const replyReview = (id,farmerReply) => api.patch(`/reviews/${id}/reply`, { farmerReply });
