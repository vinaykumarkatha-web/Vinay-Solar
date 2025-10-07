import { GoogleGenAI, Type } from "@google/genai";
import { Position, PanelPosition, GeminiAdvice } from '../types.ts';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getSolarAdvice(
  sunPosition: Position,
  panelPosition: PanelPosition,
  currentVoltage: number
): Promise<GeminiAdvice | null> {
  try {
    const prompt = `You are a solar energy expert system. Given the following data, provide concise, actionable advice to maximize solar energy generation.

**Current Data:**
*   Sun Position: Altitude ${sunPosition.altitude.toFixed(1)}°, Azimuth ${sunPosition.azimuth.toFixed(1)}°
*   Solar Panel Position: Tilt ${panelPosition.tilt.toFixed(1)}°, Azimuth ${panelPosition.azimuth.toFixed(1)}°
*   Current Voltage Output: ${currentVoltage.toFixed(2)}V

**Task:**
1.  Briefly analyze the current alignment and efficiency.
2.  Suggest specific adjustments to the panel's tilt and azimuth to improve efficiency, aiming for the sun's position.
3.  Provide one interesting fact about solar energy relevant to this scenario.

Format your response as a JSON object.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: {
              type: Type.STRING,
              description: 'A brief analysis of the current panel alignment and efficiency.',
            },
            recommendation: {
              type: Type.STRING,
              description: 'Specific adjustments for panel tilt and azimuth.',
            },
            funFact: {
              type: Type.STRING,
              description: 'An interesting and relevant fact about solar energy.',
            },
          },
          required: ["analysis", "recommendation", "funFact"],
        },
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as GeminiAdvice;

  } catch (error) {
    console.error("Error fetching Gemini advice:", error);
    return null;
  }
}