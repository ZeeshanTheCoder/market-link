import api from "./axiosInstance";
export const getFavorites = () => api.get("/favorites");
export const addFavorite = (payload) => api.post("/favorites", payload);
export const removeFavorite = (id) => api.delete(`/favorites/${id}`);
