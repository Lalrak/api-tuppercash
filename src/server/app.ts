import express from "express";
import type { Express } from "express";
import type { Server } from "http";
import { requestLogger } from "./middlewares/request-logger.middleware.js";
import { initSecurity } from "@config/security.config.js";
import cookieParser from "cookie-parser";
import authRoutes from "@routes/auth.routes.js";
import config from "@config/app.config.js";
import { logger } from "@config/logger.config.js";
import { prisma } from "db.js";

class App {
  private app: Express;
  private shuttingDown = false;

  constructor() {
    this.app = express();
    this.initMiddlewares();
    this.initRoutes();
  }

  private initMiddlewares() {
    this.app.use(requestLogger);
    this.app.use(express.json());
    this.app.use(cookieParser());
    initSecurity(this.app);
  }

  private initRoutes() {
    this.app.use("/api/auth", authRoutes);
  }

  public start(): Server {
    const server = this.app.listen(config.port, () => {
      logger.info({ env: config.env, port: config.port }, "server:up");
    });

    server.on("error", (err) => {
      logger.error({ err }, "server:error");
    });

    const shutdown = async (signal?: string | Error) => {
      if (this.shuttingDown) return;

      this.shuttingDown = true;
      logger.info({ signal }, "shutdown:start");

      try {
        await new Promise<void>((resolve, reject) => {
          server.close((err) => (err ? reject(err) : resolve()));
          setTimeout(() => reject(new Error("shutdown:timeout")), 10000);
        });
      } catch (err) {
        logger.error({ err }, "shutdown:close_server_error");
      }

      try {
        await prisma.$disconnect();
      } catch (err) {
        logger.error({ err }, "shutdown:prisma_disconnect_error");
      }

      logger.info("shutsown:complete");
      process.exit(signal instanceof Error ? 1 : 0);
    };

    process.once("SIGINT", () => shutdown("SIGINT"));
    process.once("SIGTERM", () => shutdown("SIGTERM"));
    process.once("uncaugthException", (err) => {
      logger.error({ err }, "uncaugthException");
      shutdown(err);
    });
    process.once("unhandledRejection", (reason) => {
      logger.error({ reason }, "unhandledRejection");
      shutdown(reason as Error);
    });

    return server;
  }
}

export default App;
