import { env } from "../config/env.js";

export const getJwtSecret = () => {
  if (env.JWT_SECRET) return env.JWT_SECRET;
  throw new Error("JWT_SECRET is missing. Add JWT_SECRET to marketlink-server/.env before starting the server.");
};
