import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { env } from "@/env";

// Create a Redis instance
const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});

// Create rate limiters for different use cases
export const createPostRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(30, "1 d"), // 30 requests per day
  analytics: true,
  prefix: "post_creation",
});

export const aiProcessingRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(50, "1 h"), // 50 AI requests per hour
  analytics: true,
  prefix: "ai_processing",
});

export const generalApiRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(100, "1 m"), // 100 requests per minute
  analytics: true,
  prefix: "api_general",
});

// Helper function to check rate limit and handle response
export async function checkRateLimit(
  rateLimit: Ratelimit,
  identifier: string,
  errorMessage?: string
) {
  const { success, limit, reset, remaining } = await rateLimit.limit(identifier);
  
  if (!success) {
    throw new Error(
      errorMessage ?? 
      `Rate limit exceeded. Limit: ${limit}, Remaining: ${remaining}, Reset: ${new Date(reset).toISOString()}`
    );
  }
  
  return { success, limit, reset, remaining };
}