import pino from "pino";
import type { LoggerOptions, TransportTargetOptions } from "pino";
import config from "./env.config.js";
import path from "node:path";
import fs from "node:fs";

const baseOptions: LoggerOptions = {
  level: config.logLevel,
  timestamp: pino.stdTimeFunctions.isoTime,
  base: {
    pid: process.pid,
  },
  formatters: {
    level(label) {
      return { level: label };
    },
  },
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "password",
      "token",
      "accessToken",
      "refreshToken",
    ],
    censor: "[REDACTED]",
  },
};

function buildTransport() {
  const targets: TransportTargetOptions[] = [];

  const logToFile = config.logToFile;
  const logDir = config.logDir;
  const logFile = config.logFile;

  if (config.env === "development") {
    targets.push({
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:standard",
        ignore: "pid,hostname",
      },
    });
    return pino.transport({ targets });
  }

  if (logToFile) {
    const fullDir = path.resolve(process.cwd(), logDir);
    const fullPath = path.join(fullDir, logFile);
    fs.mkdirSync(fullDir, { recursive: true });

    targets.push({
      target: "pino/file",
      options: { destination: 1 },
    });
    targets.push({
      target: "pino/file",
      options: { destination: fullPath, mkdir: true },
    });

    return pino.transport({ targets });
  }

  return undefined;
}

const transport = buildTransport();

export const logger = transport
  ? pino(baseOptions, transport)
  : pino(baseOptions);

export function withContext(context: Record<string, unknown>) {
  return logger.child(context);
}
