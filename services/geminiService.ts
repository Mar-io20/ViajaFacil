import { GoogleGenAI, Type } from "@google/genai";
import { SearchParams, SearchType } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const searchTravelOptions = async (params: SearchParams): Promise<any[]> => {
  const modelId = "gemini-3-flash-preview";
  
  let promptContext = "";
  // Check if we need to use Google Search (Grounding)
  const shouldUseSearch = params.type === SearchType.STAY;

  switch (params.type) {
    case SearchType.FLIGHT:
      promptContext = `Find flight options from ${params.origin} to ${params.destination} on ${params.date} for ${params.passengers} people.`;
      break;
    case SearchType.BUS:
      promptContext = `Find bus tickets from ${params.origin} to ${params.destination} on ${params.date}.`;
      break;
    case SearchType.CAR:
      promptContext = `Find car rental options in ${params.destination} available on ${params.date}.`;
      break;
    case SearchType.STAY:
      // Specific prompt for Airbnb grounding
      promptContext = `Using Google Search, search specifically on https://www.airbnb.com.br/ for accommodation options in ${params.destination} suitable for ${params.passengers} people on ${params.date}. Look for real listings or highly rated types of stays available in that area.`;
      break;
  }

  const prompt = `${promptContext} Provide 3 to 4 distinct and realistic options. For price, provide an estimate in BRL (R$). Return the data strictly matching the JSON schema provided.`;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        // Enable Google Search only if needed (Airbnb request), though it can be on for all.
        // For STAY, we definitely want it to find real Airbnb context.
        tools: shouldUseSearch ? [{ googleSearch: {} }] : [],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              price: { type: Type.STRING },
              rating: { type: Type.NUMBER },
              features: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["id", "title", "description", "price", "features"]
          }
        }
      }
    });

    const text = response.text;
    
    // Log grounding metadata if available (for debugging or future display)
    if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
      console.log("Grounding Sources:", response.candidates[0].groundingMetadata.groundingChunks);
    }

    if (!text) return [];
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Search Error:", error);
    // Fallback mock data if API fails or key is missing
    return [
      {
        id: "mock-1",
        title: "Opção Padrão (Simulação)",
        description: "Devido a um erro na conexão, esta é uma opção simulada.",
        price: "R$ 500,00",
        rating: 4.5,
        features: ["Cancelamento Grátis", "Seguro Incluso"]
      }
    ];
  }
};