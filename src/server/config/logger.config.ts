import pino from "pino";
import type { LoggerOptions, TransportTargetOptions } from "pino";
import config from "./app.config.js";

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
  if (config.env === "development") {
    const targets: TransportTargetOptions[] = [
      {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      },
    ];
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
