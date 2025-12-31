import Redis from "ioredis";

let redis;

export const getRedis = () => {
  if (redis) return redis;

  redis = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD || undefined,
    db: Number(process.env.REDIS_DB || 0),
    keyPrefix: `${process.env.REDIS_KEY_PREFIX}:`,
    enableReadyCheck: true,
    maxRetriesPerRequest: 3,
    retryStrategy: (times) => Math.min(times * 50, 2000),
  });

  redis.on("connect", () => {
    console.log("Redis connected");
  });

  redis.on("error", (err) => {
    console.error("Redis error:", err);
  });

  return redis;
};

export const closeRedis = async () => {
  if (redis) {
    await redis.quit();
    console.log("Redis connection closed");
  }
};
