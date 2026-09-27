import jwt from "jsonwebtoken";
import { getJwtSecret } from "./jwtConfig.js";

const generateToken = (userId) =>
  jwt.sign({ id: userId }, getJwtSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

export default generateToken;
