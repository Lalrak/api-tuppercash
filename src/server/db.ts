import config from "@config/app.config.js";
import { logger } from "@config/logger.config.js";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      config.env !== "production"
        ? ["query", "info", "warn", "error"]
        : ["warn", "error"],
  });

if (config.env !== "production") globalForPrisma.prisma = prisma;
