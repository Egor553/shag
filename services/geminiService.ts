
import { GoogleGenAI, Type } from "@google/genai";
import { Mentor } from "../types";

/**
 * Использует Gemini API для подбора наиболее подходящего ментора на основе запроса пользователя.
 */
export async function findBestMentor(query: string, mentors: Mentor[]): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const mentorData = mentors.map(m => ({
    id: m.id || m.email,
    name: m.name,
    industry: m.industry,
    description: m.description,
    experience: m.experience,
    city: m.city,
    direction: m.direction
  }));

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Пользователь ищет наставника с таким запросом: "${query}"
    
    Проанализируй список доступных менторов и выбери одного самого подходящего. 
    Если точного совпадения нет, выбери наиболее близкого по духу или нише.
    
    Список доступных менторов:
    ${JSON.stringify(mentorData, null, 2)}`,
    config: {
      systemInstruction: "Ты — интеллектуальный консьерж платформы ШАГ. ШАГ — это мост между опытными предпринимателями и молодыми талантами. Твоя задача — найти идеальный 'резонанс' между запросом ученика и опытом ментора. Отвечай только в формате JSON.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          id: {
            type: Type.STRING,
            description: 'ID или email выбранного ментора',
          },
          reason: {
            type: Type.STRING,
            description: 'Почему этот ментор подходит лучше всего (напиши вдохновляюще)',
          },
          matchPercentage: {
            type: Type.NUMBER,
            description: 'Процент соответствия от 0 до 100',
          },
          advice: {
            type: Type.STRING,
            description: 'Конкретный совет пользователю, как подготовиться к встрече с этим ментором',
          },
        },
        required: ['id', 'reason', 'matchPercentage', 'advice'],
      },
    },
  });

  return response.text || JSON.stringify({
    id: "",
    reason: "К сожалению, сейчас в системе нет ментора, который бы идеально соответствовал вашему запросу.",
    matchPercentage: 0,
    advice: "Попробуйте расширить сферу интересов или описать свою цель более детально."
  });
}
