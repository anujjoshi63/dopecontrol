import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { habits } from "@/server/db/schema";

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
    name: "Smoke 🌿🚬",
    points: -150,
  },
  {
    name: "Me time 🍆",
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
    const existingHabits = await ctx.db.query.habits.findMany();
    if (existingHabits.length > 0) {
      return { ok: true };
    }
    const toInsert: (typeof habits.$inferInsert)[] = templateHabits.map(
      (habit) => {
        return {
          ...habit,
          createdById: ctx.session.user.id,
        };
      },
    );
    await ctx.db.insert(habits).values(toInsert);

    return { ok: true };
  }),
  getHabits: protectedProcedure.query(async ({ ctx }) => {
    // map id with other data
    const habits = await ctx.db.query.habits.findMany();
    const habitIdToHabit = habits.reduce(
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
