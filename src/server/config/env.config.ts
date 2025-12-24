import dotenv from "dotenv";

dotenv.config();

const required = ["NODE_ENV", "PORT", "DATABASE_URL", "JWT_SECRET"];
for (const k of required) {
  if (!process.env[k]) throw new Error(`Missing required env var: ${k}`);
}

const config = {
  env: process.env.NODE_ENV,
  port: Number(process.env.PORT) || 3000,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  isProd: process.env.NODE_ENV === "production",
  logLevel: process.env.LOG_LEVEL || "info",
  logToFile: process.env.LOG_TO_FILE || "true",
  logDir: process.env.LOG_DIR ?? "logs",
  logFile: process.env.LOG_FILE ?? "app.log",
};

export default config;
