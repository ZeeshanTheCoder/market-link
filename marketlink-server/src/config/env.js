import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Always load the server's own .env, even when the command is launched from
// the project root or another working directory.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serverRoot = path.resolve(__dirname, "../..");
dotenv.config({ path: path.join(serverRoot, ".env") });

// Development fallback prevents JWT setup from breaking the local demo when
// a .env file is missing. Production still requires a real JWT_SECRET.
if (process.env.NODE_ENV !== "production" && !process.env.JWT_SECRET) {
  process.env.JWT_SECRET = "marketlink-local-dev-secret-change-me";
}

export const env = process.env;
