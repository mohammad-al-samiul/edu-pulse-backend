// FIX FOR MONGODB ATLAS DNS / SRV LOOKUP ERROR
// import dns from "node:dns/promises";
// dns.setServers(["1.1.1.1", "1.0.0.1"]);

import "dotenv/config";
import express from "express";
import cors from "cors";

import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { notFound } from "./middlewares/notFound";
import { logger } from "./utils/logger";
import router from "./route";
import { globalRateLimit } from "./middlewares/rateLimit.middleware";

const app = express();

// Middlewares
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());
app.use(logger);

// Versioning
app.use("/api/v1", globalRateLimit, router);

app.get("/", (req, res) => {
  res.json({ message: "API running 🚀" });
});

// Not Found Middleware
app.use(notFound);

// Global Error Handler (Must be last)
app.use(globalErrorHandler);

export default app;
