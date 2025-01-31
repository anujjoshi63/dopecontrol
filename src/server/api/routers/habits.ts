import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { habits } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

export const habitRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello (from habit) ${input.text}`,
      };
    }),

  getHabits: protectedProcedure.query(async ({ ctx }) => {
    // map id with other data
    const allHabits = await ctx.db.query.habits.findMany({
      where: eq(habits.userId, ctx.session.user.id),
      columns: {
        id: true,
        name: true,
        points: true,
      },
    });
    const habitIdToHabit = allHabits.reduce(
      (acc: Record<string, typeof habit>, habit) => {
        acc[habit.id] = habit;
        return acc;
      },
      {},
    );
    return habitIdToHabit;
  }),

  findByName: protectedProcedure
    .input(z.object({ name: z.string(), userId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.habits.findFirst({
        where: and(
          eq(habits.name, input.name),
          eq(habits.userId, input.userId),
        ),
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        points: z.number(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [newHabit] = await ctx.db
        .insert(habits)
        .values({
          name: input.name,
          points: input.points,
          userId: input.userId,
        })
        .returning();
      return newHabit;
    }),
});
