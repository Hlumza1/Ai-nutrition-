
import { GoogleGenAI, Type } from "@google/genai";
import { NutritionData } from "../types";

export const getNutritionInfo = async (query: string): Promise<NutritionData> => {
  // Use the API key from process.env as per requirements. 
  // Cast to any to bypass strict env typing in browser-targeted code.
  const ai = new GoogleGenAI({ apiKey: (process.env as any).API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the nutritional content of: ${query}. Provide precise estimates for a standard serving.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          foodName: { type: Type.STRING },
          calories: { type: Type.NUMBER },
          protein: { type: Type.NUMBER },
          fat: { type: Type.NUMBER },
          carbohydrates: { type: Type.NUMBER },
          fiber: { type: Type.NUMBER },
          sugar: { type: Type.NUMBER },
          servingSize: { type: Type.STRING },
          healthScore: { type: Type.NUMBER },
          summary: { type: Type.STRING },
          benefits: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["foodName", "calories", "protein", "fat", "carbohydrates", "servingSize", "healthScore", "summary", "benefits"]
      }
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("The AI model returned an empty response.");
  }

  return JSON.parse(text);
};
