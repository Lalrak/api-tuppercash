import http from "http";
import app from "./server/index.js";
import config from "./server/config/env.js";

const server = http.createServer(app);

server.listen(config.port, () => {
  console.log(`Server (${config.env}) up on ${config.port}`);
});

const shutdown = () => {
  console.log("Shutting down...");
  server.close((err) => {
    if (err) {
      console.log("Error closing server:", err);
      process.exit(1);
    }
    process.exit(0);
  });

  setTimeout(() => process.exit(1), 10_000);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
