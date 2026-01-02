import http from "http";
import app from "./server/app.js";
import config from "./server/config/env.config.js";
import { logger } from "./server/config/logger.config.js";

const server = http.createServer(app);

server.listen(config.port, () => {
  logger.info({ env: config.env, port: config.port }, "server:up");
});

const shutdown = () => {
  logger.info("shutting_down");
  server.close((err) => {
    if (err) {
      logger.error({ err }, "error_closing_server");
      process.exit(1);
    }
    process.exit(0);
  });

  setTimeout(() => {
    (logger.error("force_exit_after_timeout"), process.exit(1), 10_000);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
