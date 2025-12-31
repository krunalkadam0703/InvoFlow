import Redis from "ioredis";

export const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  db: Number(process.env.REDIS_DB) || 0,
  keyPrefix: process.env.REDIS_KEY_PREFIX
    ? `${process.env.REDIS_KEY_PREFIX}:`
    : undefined,

  enableReadyCheck: true,
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

redis.on("connect", () => console.log("Redis connected"));
redis.on("ready", () => console.log("Redis ready"));
redis.on("error", (err) => console.error("Redis error:", err));
redis.on("close", () => console.warn("Redis connection closed"));
