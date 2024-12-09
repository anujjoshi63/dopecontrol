import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { habits } from "@/server/db/schema";
import { eq } from "drizzle-orm";

const templateHabits = [
  {
    name: "Read 3 pages of a self-help book",
    points: 10,
  },
  {
    name: "Write a blog post",
    points: 30,
  },
  {
    name: "Work on side project for 1 hour",
    points: 20,
  },
  {
    name: "Take a cold shower",
    points: 10,
  },
  {
    name: "Take a walk",
    points: 10,
  },
  {
    name: "Leetcode",
    points: 30,
  },
  {
    name: "Clean your room",
    points: 5,
  },
  {
    name: "Exercise",
    points: 15,
  },
  {
    name: "Meditate",
    points: 10,
  },
  {
    name: "Deep Work",
    points: 50,
  },
  {
    name: "Meet with a senior on LinkedIn",
    points: 100,
  },
  {
    name: "Smoke 🚬",
    points: -150,
  },
  {
    name: "Me time",
    points: -200,
  },
  {
    name: "Drink",
    points: -100,
  },
  {
    name: "Eat junk food",
    points: -50,
  },
  {
    name: "Video games",
    points: -100,
  },
];

export const habitRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello (from habit) ${input.text}`,
      };
    }),

  checkTemplateHabits: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const existingHabitsCheck = await ctx.db.query.habits.findFirst({
      where: eq(habits.createdById, userId),
      columns: {
        id: true,
      },
    });
    if (existingHabitsCheck) {
      return { ok: true };
    }
    
    const toInsert = templateHabits.map((habit) => ({
      ...habit,
      createdById: userId,
    }));

    await ctx.db.insert(habits).values(toInsert);

    return { ok: true };
  }),
  getHabits: protectedProcedure.query(async ({ ctx }) => {
    // map id with other data
    const allHabits = await ctx.db.query.habits.findMany({
      where: eq(habits.createdById, ctx.session.user.id),
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

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
