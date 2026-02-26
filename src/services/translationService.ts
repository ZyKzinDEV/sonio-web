import { GoogleGenAI } from "@google/genai";

export async function translateDictionary(baseDict: any, targetLangCode: string) {
  try {
    let langName = targetLangCode;
    try {
      langName = new Intl.DisplayNames(['en'], { type: 'language' }).of(targetLangCode) || targetLangCode;
    } catch (e) {
      // ignore
    }
    
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const prompt = `Translate the following JSON object's string values into ${langName}. 
    Keep the exact same JSON structure and keys. 
    Do not translate the keys, only the values.
    Return ONLY the translated JSON object.
    
    JSON to translate:
    ${JSON.stringify(baseDict)}`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });
    
    if (response.text) {
      return JSON.parse(response.text);
    }
  } catch (error) {
    console.error("Translation error:", error);
  }
  return null;
}
