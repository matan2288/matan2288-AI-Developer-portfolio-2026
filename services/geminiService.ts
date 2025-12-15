import { GoogleGenAI, Type } from "@google/genai";
import { WorkoutPlanRequest, WorkoutPlanResponse } from "../types";

// Initialize Gemini API Client
// Note: process.env.API_KEY is assumed to be available in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateAIWorkout = async (request: WorkoutPlanRequest): Promise<WorkoutPlanResponse> => {
  try {
    const prompt = `
      Create a custom single-session workout plan for a client with the following details:
      - Goal: ${request.goal}
      - Experience Level: ${request.level}
      - Available Equipment: ${request.equipment}
      - Duration: ${request.duration} minutes

      Provide the response in structured JSON format suitable for a fitness app display.
      Be motivating, specific, and ensure safety.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are Apex Performance's elite AI fitness coach. You provide high-intensity, science-backed workout advice.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            planTitle: { type: Type.STRING },
            summary: { type: Type.STRING },
            exercises: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  sets: { type: Type.STRING },
                  reps: { type: Type.STRING },
                  notes: { type: Type.STRING },
                }
              }
            },
            motivationalQuote: { type: Type.STRING }
          }
        }
      }
    });

    const text = response.text;
    if (!text) {
        throw new Error("No response generated from AI");
    }
    
    return JSON.parse(text) as WorkoutPlanResponse;

  } catch (error) {
    console.error("Error generating workout:", error);
    throw new Error("Failed to generate workout plan. Please try again.");
  }
};
