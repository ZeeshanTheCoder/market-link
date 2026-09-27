import api from "./axiosInstance";

export function askMarketLinkAI(payload) {
  return api.post("/ai/assistant", payload);
}
