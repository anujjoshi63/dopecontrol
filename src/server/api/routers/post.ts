import { z } from "zod";

import { getPointsForUserFromCache, redis } from "@/lib/redis";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { and, gte, sum } from "drizzle-orm";

import { habits, posts } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { processActivitiesWithAI } from "@/app/api/ai-tool/ai-processing";
import { TRPCError } from "@trpc/server";
const CACHE_EXPIRY_TIME = 60 * 60; // 1 hour
async function updatePointsCache(
  userId: string,
  db: PostgresJsDatabase<typeof import("@/server/db/schema")>,
) {
  console.log("Updating points cache for user:", userId);
  const cacheKey = `summary:user:${userId}:posts:points_sum`;

  const result = await db
    .select({ totalPoints: sum(habits.points) })
    .from(posts)
    .innerJoin(habits, eq(posts.habitId, habits.id))
    .where(eq(posts.createdById, userId));

  const points = result[0]?.totalPoints ?? 0;

  await redis.set(cacheKey, points.toString(), { ex: CACHE_EXPIRY_TIME }); // Cache for 1 hour
  console.log("Updated points cache for user:", userId, "Points:", points);
  return points;
}

export const postRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        habitId: z.number(),
        description: z.string(),
        duration: z.number().optional(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [newPost] = await ctx.db
        .insert(posts)
        .values({
          habitId: input.habitId,
          createdById: input.userId,
          description: input.description,
          duration: input.duration,
        })
        .returning();

      // Update cache
      await updatePointsCache(input.userId, ctx.db);

      return newPost;
    }),

  getLatest: protectedProcedure.query(async ({ ctx }) => {
    try {
      const res = await ctx.db.query.posts.findMany({
        orderBy: (posts, { desc }) => [desc(posts.createdAt)],
        limit: 3,
        where: eq(posts.createdById, ctx.session.user.id),
        with: {
          habit: {
            columns: {
              name: true,
              points: true,
            },
          },
        },
      });
      console.log({ res });
      return res;
    } catch (error) {
      console.error(error);
      return [];
    }
  }),
  createFromAIInput: protectedProcedure
    .input(
      z.object({
        activities: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { activities } = input;
      const userId = ctx.session.user.id;
      const email = ctx.session.user.email;
      // Check the number of posts created today
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const postCount = await ctx.db.query.posts.findMany({
        where: and(eq(posts.createdById, userId), gte(posts.createdAt, today)),
        columns: {
          id: true,
        },
      });
      const MAX_POSTS_PER_DAY = 5;
      const IGNORE_EMAILS = ["anujjoshi63@gmail.com"];
      if (
        postCount.length >= MAX_POSTS_PER_DAY &&
        email &&
        !IGNORE_EMAILS.includes(email)
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "You have reached the daily limit of 5 posts. Please try again tomorrow.",
        });
      }

      // Process activities with AI
      let processedActivities = await processActivitiesWithAI(activities);
      if (processedActivities.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No activities were processed. Please try again.",
        });
      }
      const MAX_ACTIVITIES_PER_POST = 3;
      if (
        processedActivities.length > MAX_ACTIVITIES_PER_POST &&
        email &&
        !IGNORE_EMAILS.includes(email)
      ) {
        processedActivities = processedActivities.slice(
          0,
          MAX_ACTIVITIES_PER_POST,
        );
      }
      const createdPosts = [];

      for (const activity of processedActivities) {
        // Check if a habit already exists
        let habit = await ctx.db.query.habits.findFirst({
          where: eq(habits.name, activity.habitName),
        });

        // If habit doesn't exist, create it
        if (!habit) {
          const [newHabit] = await ctx.db
            .insert(habits)
            .values({
              name: activity.habitName,
              points: activity.points,
              userId,
            })
            .returning();
          habit = newHabit;
        }

        if (!habit) {
          throw new Error("Failed to create habit");
        }

        // Create a new post
        const [newPost] = await ctx.db
          .insert(posts)
          .values({
            habitId: habit.id,
            createdById: userId,
            description: activity.description,
            duration: activity.duration,
          })
          .returning();

        createdPosts.push(newPost);
      }

      // Invalidate cache
      await updatePointsCache(userId, ctx.db);

      return createdPosts;
    }),
  getPoints: protectedProcedure.query(async ({ ctx }) => {
    const { id: userId } = ctx.session.user;
    try {
      // Try to fetch the cached sum of points from Redis
      let points = await getPointsForUserFromCache(userId);
      if (points === null) {
        const cacheKey = `summary:user:${userId}:posts:points_sum`;

        // Use Drizzle's type-safe query builder
        const result = await ctx.db
          .select({ totalPoints: sum(habits.points) })
          .from(posts)
          .innerJoin(habits, eq(posts.habitId, habits.id))
          .where(eq(posts.createdById, userId));

        points = +(result[0]?.totalPoints ?? 0);

        // Cache the result
        await redis.set(cacheKey, points.toString(), { ex: CACHE_EXPIRY_TIME }); // Cache for 1 hour
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
