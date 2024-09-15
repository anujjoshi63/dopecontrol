import { env } from "@/env";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});

const getPointsForUserFromCache = async (
  userId: string,
): Promise<number | null> => {
  const cacheKey = `summary:user:${userId}:posts:points_sum`;
  const cachedData = (await redis.get(cacheKey)) as string | null;
  return cachedData ? parseInt(cachedData, 10) : null;
};

export { getPointsForUserFromCache, redis };
