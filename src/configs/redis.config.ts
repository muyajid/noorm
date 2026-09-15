import Redis from "ioredis";

let redisClient: Redis | null = null;

export const initRedis = (): Redis => {
  try {
    if (redisClient) {
      return redisClient;
    }

    redisClient = new Redis({
      host: process.env.REDIS_HOST || "localhost",
      port: Number(process.env.REDIS_PORT) || 6379,
      maxRetriesPerRequest: 3,
    });

    redisClient.on("connect", () => {
      console.info(
        `Redis succesfully connected at - ${new Date().toLocaleString("id-ID")}`,
      );
    });

    redisClient.on("error", (err) => {
      console.error(`Redis error: ${err.message}`);
    });

    redisClient.on("ready", () => {
      console.info("Redis ready to accept command");
    });

    return redisClient;
  } catch (error: any) {
    console.error(`Failed to initialize redis: ${error.message}`);
    throw error;
  }
};

export const getRedisClient = (): Redis => {
  if (!redisClient) {
    console.error(`Redis not initialize, initialize now....`);
    return initRedis();
  }

  return redisClient;
};

export const closeRedisClient = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit();
    console.error(
      `Redis client closed at - ${new Date().toLocaleString("id-ID")}`,
    );

    redisClient = null;
  }
};
