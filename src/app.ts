// FIX FOR MONGODB ATLAS DNS / SRV LOOKUP ERROR
import dns from "node:dns/promises";
dns.setServers(["1.1.1.1", "1.0.0.1"]);

import express from "express";
import cors from "cors";

import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { notFound } from "./middlewares/notFound";
import { logger } from "./utils/logger";

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

// app.use("/api/v1", routes);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
