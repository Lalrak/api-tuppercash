import express from "express";
import { requestLogger } from "./middlewares/request-logger.middleware.js";
import { initSecurity } from "./config/security.config.js";

const app = express();

app.use(express.json());

initSecurity(app);

app.use(requestLogger);

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

export default app;
