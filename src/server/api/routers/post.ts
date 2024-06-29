import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { posts } from "@/server/db/schema";

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

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.posts.findMany({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
      limit: 5,
    });
  }),
  getPoints: protectedProcedure.query(async ({ ctx }) => {
    const fetchedPosts = await ctx.db.query.posts.findMany({
      with: {
        habit: true,
      },
      //   where: eq(posts.createdById, ctx.session.user.id),
    });

    let points = 0;
    fetchedPosts.forEach((post) => {
      points += post.habit.points;
    });
    return { points };
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
