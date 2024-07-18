import { z } from "zod";

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

      await ctx.db.insert(posts).values({
        habitId,
        createdById: ctx.session.user.id,
      });
    }),

  getLatest: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.posts.findMany({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
      limit: 3,
      where: eq(posts.createdById, ctx.session.user.id),
    });
  }),
  getPoints: protectedProcedure.query(async ({ ctx }) => {
    const fetchedPosts = await ctx.db.query.posts.findMany({
      with: {
        habit: true,
      },
      where: eq(posts.createdById, ctx.session.user.id),
    });

    let points = 0;
    fetchedPosts.forEach((post) => {
      points += post.habit.points;
    });
    return { points };
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
      });

      return fetchedPosts;
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
