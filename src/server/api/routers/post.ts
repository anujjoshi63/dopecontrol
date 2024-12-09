import { z } from "zod";

import { getPointsForUserFromCache, redis } from "@/lib/redis";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { posts } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: protectedProcedure
    .input(z.object({ habitId: z.number().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const { habitId } = input;
      const { id: userId } = ctx.session.user;
      await ctx.db.insert(posts).values({
        habitId,
        createdById: userId,
      });
      const cacheKey = `summary:user:${userId}:posts:points_sum`;

      const fetchedPosts = await ctx.db.query.posts.findMany({
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

      const points = fetchedPosts.reduce(
        (sum, post) => sum + post.habit.points,
        0,
      );

      await redis.set(cacheKey, points.toString(), { ex: 3600 });
    }),

  getLatest: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.posts.findMany({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
      limit: 3,
      where: eq(posts.createdById, ctx.session.user.id),
    });
  }),
  getPoints: protectedProcedure.query(async ({ ctx }) => {
    const { id: userId } = ctx.session.user;
    try {
      // Try to fetch the cached sum of points from Redis
      let points = await getPointsForUserFromCache(userId);
      if (points === null) {
        const cacheKey = `summary:user:${userId}:posts:points_sum`;

        const fetchedPosts = await ctx.db.query.posts.findMany({
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

        points = fetchedPosts.reduce((sum, post) => sum + post.habit.points, 0);

        await redis.set(cacheKey, points.toString(), { ex: 3600 }); // Cache for 1 hour
      }
      return { points };
    } catch (error) {
      console.error("Error fetching points:", error);
      return { points: 0 };
    }
  }),
  // paginated get posts
  getPosts: protectedProcedure
    .input(z.object({ offset: z.number().min(1).optional() }))
    .query(async ({ ctx, input }) => {
      const { offset } = input;
      const pageSize = 8;

      // await new Promise((resolve) => setTimeout(resolve, 1000));
      const fetchedPosts = await ctx.db.query.posts.findMany({
        orderBy: (posts, { desc }) => [desc(posts.createdAt)],
        offset: offset ? (offset - 1) * pageSize : 0,
        // limit: pageSize,
        where: eq(posts.createdById, ctx.session.user.id),
        columns: {
          createdAt: true,
          id: true,
          habitId: true,
        },
      });

      return fetchedPosts;
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
