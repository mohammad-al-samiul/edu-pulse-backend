import { redis } from "../config/redis";

export const CacheService = {
  async getCache(key: string) {
    return await redis.get(key);
  },

  async setCache(key: string, value: any, ttl = 300) {
    await redis.set(key, value, { ex: ttl });
  },

  async deleteCache(key: string) {
    await redis.del(key);
  },
};
