import { generateObject } from "ai";
// import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
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
// const model = openai("gpt-4o-mini");
const model = google("gemini-2.0-flash-lite-preview-02-05");
export async function processActivitiesWithAI(activities: string) {
  try {
    const {
      object,
      // , usage
    } = await generateObject({
      model,
      schema: z.object({
        activities: processedActivitiesSchema,
      }),
      prompt: `
      You are an AI assistant that processes user activities and categorizes them into habits with precise scoring.

      For each activity, provide:
      1. A habit name (be specific and concise, max 3 words)
      2. A brief description (max 50 characters, if negative points are awarded, end with 2 or 3 worded recommendation)
      3. An estimated duration in minutes (if applicable, otherwise omit)
      4. A point value between -200 and 100

      SCORING FRAMEWORK:
      
      HIGHLY POSITIVE (80-100 points):
      - Intense physical exercise (running, weightlifting, sports)
      - Deep learning/skill building (coding, language learning, music practice)
      - Creative work (writing, art, building projects)
      - Meditation/mindfulness practice
      
      MODERATELY POSITIVE (30-79 points):
      - Light exercise (walking, stretching)
      - Reading (educational/fiction)
      - Productive work tasks
      - Social activities with friends/family
      - Cooking healthy meals
      
      SLIGHTLY POSITIVE (1-29 points):
      - Organizing/cleaning
      - Basic self-care (shower, grooming)
      - Planning/journaling
      - Casual learning (podcasts, documentaries)
      
      NEUTRAL (0 points):
      - Necessary activities (commuting, waiting)
      - Ambiguous activities without clear benefit/harm
      
      SLIGHTLY NEGATIVE (-1 to -29 points):
      - Excessive passive consumption (TV, YouTube >2hrs)
      - Procrastination activities
      - Mindless snacking
      
      MODERATELY NEGATIVE (-30 to -79 points):
      - Social media scrolling (>30 minutes)
      - Casual gaming (>1 hour)
      - Binge-watching content
      - Excessive shopping/browsing
      
      HIGHLY NEGATIVE (-80 to -200 points):
      - Addictive behaviors (gambling, excessive gaming >3hrs)
      - Harmful substances (smoking, excessive alcohol)
      - Destructive activities (fights, vandalism)
      - Activities that directly harm health/relationships
      
      MAGNITUDE DETERMINATION:
      - Consider DURATION: longer harmful activities = more negative points
      - Consider INTENSITY: "scrolled social media" = -20, "doom scrolled for 3 hours" = -60
      - Consider FREQUENCY: occasional vs habitual behavior
      - Consider IMPACT: immediate vs long-term consequences
      
      NATURE DETERMINATION:
      - POSITIVE: Builds skills, health, relationships, or future opportunities
      - NEGATIVE: Provides instant gratification without growth, wastes time, or causes harm
      - Be strict but fair - not everything fun is negative
      
      Even if the user provides only one activity, always return an array.
      If duration is not specified or clear, make a reasonable estimate or omit it.
    
      User activities: ${activities}

      Process these activities and return them in the required format with accurate magnitude and nature scoring.
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
