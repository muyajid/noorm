import { NextFunction, Request, Response } from "express";
import { getRedisClient } from "../configs/redis.config";

export const rateLimitMiddleware = (maxRequest = 5, windowSecond = 60) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const redis = getRedisClient();

      const userIdentifier = req.ip;
      const key = `rate-limit:${userIdentifier}`;
      const now = Date.now();

      await redis.zremrangebyscore(key, 0, now - windowSecond * 1000);

      const requestCount = await redis.zcard(key);

      if (requestCount >= maxRequest) {
        console.info(`Rate limit exceded: ${userIdentifier}`);

        return res.status(429).json({
          status: "message",
          message: "Too many request, please try again later",
        });
      }

      await redis.zadd(key, now, now.toString());
      await redis.expire(key, windowSecond);

      next();
    } catch (error: any) {
      console.error(`Rate limit middleware eror: ${error.message}`);
      next();
    }
  };
};
