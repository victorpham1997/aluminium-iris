'user server';
import { GoogleGenAI } from "@google/genai";

let model = "gemini-2.0-flash";

export function initGenAI(apiKey: string){
    return new GoogleGenAI({ apiKey: apiKey });
}

export function initChat(ai: GoogleGenAI){
    return ai.chats.create({
        model: model,
        history: [
          {
            role: "user",
            parts: [{ text: "Hello" }],
          },
          {
            role: "model",
            parts: [{ text: "Great to meet you. What would you like to know?" }],
          },
        ],
      });
}