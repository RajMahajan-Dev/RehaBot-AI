// Integration: blueprint:javascript_gemini
import { GoogleGenAI } from "@google/genai";
import { type GenerateRoutineRequest, type Routine, routineSchema } from "@shared/schema";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateRoutineWithGemini(
  request: GenerateRoutineRequest
): Promise<Routine> {

  const prompt = `You are a rehabilitation and recovery assistant. Generate a personalized 3-day recovery routine in JSON format.

User Profile:
- Recovery Type: ${request.injuryType}
- Mobility Level: ${request.mobilityLevel}
- Daily Time Available: ${request.dailyTime} minutes
- Intensity Preference: ${request.intensity}
- Goals: ${request.goals}

Generate a routine with exactly 3 days. Each day should have 3 blocks: one motivational, one exercise, and one cognitive activity. The total duration of all blocks should not exceed ${request.dailyTime} minutes per day.

Return ONLY valid JSON matching this exact schema (no markdown, no explanations):

{
  "days": [
    {
      "day": 1,
      "blocks": [
        {
          "id": "unique-id-1",
          "type": "motivational",
          "title": "Activity Title",
          "durationMinutes": 10,
          "difficulty": "easy",
          "progress": 0,
          "steps": [
            {
              "title": "Step name",
              "duration": 5,
              "voiceCue": "Optional encouraging message"
            }
          ]
        },
        {
          "id": "unique-id-2",
          "type": "exercise",
          "title": "Exercise Title",
          "durationMinutes": 15,
          "difficulty": "medium",
          "progress": 0,
          "steps": [
            {
              "title": "Exercise step",
              "duration": 5,
              "voiceCue": "Movement instruction"
            }
          ]
        },
        {
          "id": "unique-id-3",
          "type": "cognitive",
          "title": "Mental Activity Title",
          "durationMinutes": 10,
          "difficulty": "easy",
          "progress": 0,
          "steps": [
            {
              "title": "Mental exercise",
              "duration": 5
            }
          ]
        }
      ]
    }
  ]
}

Requirements:
- Each block must have a unique id (use descriptive names like "day1-motivational", "day1-exercise", etc.)
- Type must be exactly "motivational", "exercise", or "cognitive"
- Difficulty must be exactly "easy", "medium", or "hard"
- Progress should always be 0
- Each block should have 2-5 steps
- Step durations should add up roughly to the block's durationMinutes
- Make activities specific to the user's ${request.injuryType} and ${request.mobilityLevel}
- Tone should be ${request.intensity === "gentle" ? "encouraging and gentle" : request.intensity === "moderate" ? "supportive and steady" : "motivating and challenging"}
- Include helpful voice cues for exercises and motivational activities`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        responseMimeType: "application/json",
      },
      contents: prompt,
    });
    
    const text = response.text || "";
    
    if (!text) {
      throw new Error("Empty response from Gemini");
    }
    
    const routine = JSON.parse(text);
    
    // Validate against schema
    const validatedRoutine = routineSchema.parse(routine);
    
    return validatedRoutine;
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error(`Failed to generate routine: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
