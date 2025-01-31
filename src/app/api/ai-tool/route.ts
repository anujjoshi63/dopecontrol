// import { z } from "zod";
// import { generateText, tool } from "ai";
// import { openai } from "@ai-sdk/openai";
// import { api } from "@/trpc/server";
// import { NextResponse } from "next/server";

// export const maxDuration = 30;

// const processActivitySchema = z.object({
//   habitName: z.string(),
//   description: z.string(),
//   duration: z.number().optional(),
//   points: z.number(),
// });

// export async function POST(req: Request) {
//   const { activities, userId } = (await req.json()) as {
//     activities: string;
//     userId: string;
//   };

//   const result = await generateText({
//     model: openai("gpt-4o-mini"),
//     tools: {
//       processActivity: tool({
//         description: "Process a single user activity",
//         parameters: processActivitySchema,
//         execute: async ({ habitName, description, duration, points }) => {
//           // Find or create the habit
//           let habit = await api.habit.findByName({
//             name: habitName,
//             userId,
//           });
//           if (!habit) {
//             habit = await api.habit.create({
//               name: habitName,
//               points,
//               userId,
//             });
//           }
//           if (!habit) {
//             throw new Error("Failed to find or create habit");
//           }
//           // Create the post
//           const post = await api.post.create({
//             habitId: habit.id,
//             description,
//             duration,
//             userId,
//           });
//           if (!post) {
//             throw new Error("Failed to create post");
//           }
//           return { success: true, postId: post.id };
//         },
//       }),
//     },
//     toolChoice: "auto",
//     prompt: `Process the following user activities and create appropriate habits and posts. Activities: ${activities}`,
//   });

//   return NextResponse.json(result.text);
// }
