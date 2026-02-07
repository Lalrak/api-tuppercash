import dotenv from "dotenv";

dotenv.config();

const required = ["AUTH_SECRET", "AUTH_REFRESH_SECRET"];
for (const k of required) {
  if (!process.env[k]) throw new Error(`Missing required env var: ${k}`);
}

const authConfig = {
  accessSecret: process.env.JWT_ACCESS_SECRET,
  accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
  refreshSecret: process.env.JWT_REFRESH_SECRET,
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
};

export default authConfig;
