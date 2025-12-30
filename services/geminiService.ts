
import { GoogleGenAI, Type } from "@google/genai";
import { Mentor } from "../types";

export async function findBestMentor(query: string, mentors: Mentor[]): Promise<string> {
  // Инициализируем AI внутри функции, чтобы использовать актуальный ключ из process.env
  // Используем named parameter apiKey как требует документация
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Исправляем ошибку: values может быть строкой или массивом, проверяем перед join
  const mentorContext = mentors.map(m => {
    const valuesStr = Array.isArray(m.values) ? m.values.join(', ') : m.values;
    return `ID: ${m.id}, Имя: ${m.name}, Индустрия: ${m.industry}, Описание: ${m.description}, Ценности: ${valuesStr}`;
  }).join('\n');
  
  // Используем gemini-3-pro-preview для более точного подбора наставника (сложная текстовая задача)
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `У нас есть список наставников для платформы ШАГ:\n${mentorContext}\n\nПользователь говорит: "${query}"\n\nНайди одного наиболее подходящего наставника и объясни почему одним коротким предложением. Верни только JSON в формате: {"id": "ID наставника", "reason": "почему подходит"}.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          reason: { type: Type.STRING }
        },
        required: ["id", "reason"]
      }
    }
  });

  // response.text - это свойство, а не метод. Возвращаем результат.
  return response.text || "";
}
