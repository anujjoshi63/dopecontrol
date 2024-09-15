import { redis } from "@/lib/redis";
import { eq } from "drizzle-orm";
import { posts } from "../db/schema";

const fetchAndCachePoints = async (userId: string, findMany: any) => {
  const cacheKey = `summary:user:${userId}:posts:points_sum`;
  interface PostWithHabitPoints {
    habit: {
      points: number;
    };
  }
  const fetchedPosts: PostWithHabitPoints[] = await findMany({
    columns: {},
    with: {
      habit: {
        columns: {
          points: true,
        },
      },
    },
    where: eq(posts.createdById, userId),
  });

  const points = fetchedPosts.reduce((sum, post) => sum + post.habit.points, 0);

  await redis.set(cacheKey, points.toString(), { ex: 3600 }); // Cache for 1 hour

  return points;
};

export { fetchAndCachePoints };
