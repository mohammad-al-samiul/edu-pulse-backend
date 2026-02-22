import { Redis } from "@upstash/redis";
import { config } from "./env";

export const redis = new Redis({
  url: config.redis_url,
  token: config.redis_token,
});
