import type { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import config from "./app.config.js";

export function initSecurity(app: Express) {
  app.disable("x-powered-by");

  const raw = config.allowedOrigins;
  const allowed = raw.split(",").map((s) => s.trim());

  const corsOptions = {
    origin: (
      origin: string | undefined,
      cb: (err: Error | null, allow?: boolean) => void,
    ) => {
      if (!origin) return cb(null, true);
      if (allowed.includes("*") || allowed.includes(origin)) {
        return cb(null, true);
      }
      cb(new Error("CORS policy: origin not allowed"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-request-id"],
    credentials: true,
    maxAge: 600,
  };

  app.use(cors(corsOptions));
  app.use(helmet());
}
