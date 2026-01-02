import type { RequestHandler } from "express";
import { v4 as uuidv4 } from "uuid";
import { withContext, logger } from "../config/logger.config.js";

export const requestLogger: RequestHandler = (req, res, next) => {
  const start = Date.now();
  const requestId = (req.headers["x-request-id"] as string) ?? uuidv4();
  const reqLogger = withContext({
    requestId,
    method: req.method,
    path: req.originalUrl ?? req.url,
  });

  (req as any).log = reqLogger;
  reqLogger.info({ headers: req.headers }, "request:start");

  res.on("finish", () => {
    const duration = Date.now() - start;
    reqLogger.info({ statusCode: res.statusCode, duration }, "request:finish");
  });

  res.on("error", (err) => {
    reqLogger.error({ err }, "request:error");
    logger.error({ err, requestId }, "response_error");
  });

  next();
};
