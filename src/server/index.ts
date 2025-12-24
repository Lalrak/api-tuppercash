import express from "express";
import { requestLogger } from "./middlewares/requestLogger.middleware.js";

const app = express();

app.use(express.json());

app.use(requestLogger);

app.get("api/v1/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

export default app;
