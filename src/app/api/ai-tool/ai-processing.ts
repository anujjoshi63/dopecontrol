// In @/lib/ai-processing.ts

import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
export const MAX_ACTIVITIES_PER_POST = 3;

const processedActivitySchema = z.object({
  habitName: z.string(),
  description: z.string().max(50), // Increased max length for flexibility
  duration: z.number().optional(),
  points: z.number().min(-200).max(100),
});

const processedActivitiesSchema = z
  .array(processedActivitySchema)
  .max(MAX_ACTIVITIES_PER_POST * 2);

export async function processActivitiesWithAI(activities: string) {
  try {
    const { object, usage } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: z.object({
        activities: processedActivitiesSchema,
      }),
      prompt: `
      You are an AI assistant that processes user activities and categorizes them into habits. 
      For each activity, provide:
      1. A habit name (be specific and concise, max 3 words)
      2. A brief description (max 50 characters)
      3. An estimated duration in minutes (if applicable, otherwise omit)
      4. A point value between -200 and 100
      
      Positive points are for beneficial activities (good for health, career, etc.), 
      negative for detrimental ones (harmful to health, career, etc.).
      Be conservative while awarding points.
      Even if the user provides only one activity, always return an array.
      If duration is not specified or clear, make a reasonable estimate or omit it.
      
      Specific guidelines:
      - Assign negative points (-20 to -50) for activities like masturbation or excessive indulgence.
      - Treat addictive behaviors or overindulgence in pleasurable activities as negative.
      - Maintain a strict stance on activities that may hinder productivity or self-improvement.
    
      User activities: ${activities}
      
      Process these activities and return them in the required format.
    `,
    });

    // console.log({ object, usage });

    if (!object.activities || object.activities.length === 0) {
      throw new Error("No activities were processed");
    }

    return object.activities;
  } catch (error) {
    console.error("Error processing activities:", error);
    // Fallback processing for single activities
    return [
      {
        habitName: "Unspecified Activity",
        description: activities.slice(0, 50), // Use the input as description, limit to 50 chars
        points: 0, // Neutral points as we can't determine if it's good or bad
      },
    ];
  }
}
