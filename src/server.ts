import app from "./app";
import { config } from "./config/env";
import prisma from "./config/prisma";
import { initSocket } from "./config/socket";
import { startNotificationConsumer } from "./modules/notification/notification.consumer";
import http from "http";

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");

    // Create HTTP server
    const server = http.createServer(app);

    server.listen(config.port, () => {
      console.log(`🚀 Server running on port ${config.port}`);
    });

    // Initialize WebSocket
    initSocket(server);

    // Start RabbitMQ Consumer
    startNotificationConsumer();
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== "production") {
  startServer();
}
