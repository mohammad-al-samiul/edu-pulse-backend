import { redis } from "../config/redis";

const getCache = async (key: string) => {
  const data = await redis.get(key);
  return data ? JSON.parse(data as string) : null;
};

const setCache = async (key: string, value: any, ttl = 300) => {
  await redis.set(key, JSON.stringify(value), { ex: ttl });
};

const deleteCache = async (key: string) => {
  await redis.del(key);
};

export const CacheService = {
  getCache,
  setCache,
  deleteCache,
};
