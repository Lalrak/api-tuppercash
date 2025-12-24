import type { Request, Response, NextFunction } from "express";
import { randomUUID } from "node:crypto";
import { logger } from "../config/logger.config.js";

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const requestId = req.header("x-request-id") ?? randomUUID();

  const log = logger.child({
    requestId,
    method: req.method,
    path: req.path,
  });

  (req as any).log = log;

  const start = Date.now();

  res.on("finish", () => {
    (log.info({
      statusCode: res.statusCode,
      dutarionMs: Date.now() - start,
    }),
      "request finished");
  });

  next();
}
