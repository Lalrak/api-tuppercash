import dotenv from "dotenv";

dotenv.config();

const required = ["NODE_ENV", "PORT", "DATABASE_URL", "JWT_SECRET"];
for (const k of required) {
  if (!process.env[k]) throw new Error(`Missing required env var: ${k}`);
}

const config = {
  env: process.env.NODE_ENV,
  port: Number(process.env.APP_PORT) || 3000,
  databaseUrl: process.env.DATABASE_URL,
  isProd: process.env.NODE_ENV === "production",
  logLevel: process.env.LOG_LEVEL || "info",
  allowedOrigins: process.env.ALLOWED_ORIGINS ?? "http://localhost:3000",
};

export default config;
