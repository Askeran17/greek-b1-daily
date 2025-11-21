import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Question } from "../types";

const API_KEY = import.meta.env.VITE_GOOGLE_AI_KEY || '';

const ai = new GoogleGenAI({ apiKey: API_KEY });

const questionSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    questionText: {
      type: Type.STRING,
      description: "The question in Greek, suitable for B1 level (grammar, vocabulary, or comprehension).",
    },
    options: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of exactly 4 possible answers in Greek.",
    },
    correctAnswerIndex: {
      type: Type.INTEGER,
      description: "The zero-based index (0-3) of the correct answer in the options array.",
    },
    explanation: {
      type: Type.STRING,
      description: "A brief explanation of why the answer is correct, in English or simple Greek.",
    },
  },
  required: ["questionText", "options", "correctAnswerIndex", "explanation"],
};

const quizSchema: Schema = {
  type: Type.ARRAY,
  items: questionSchema,
};

export const generateDailyQuestions = async (): Promise<Question[]> => {
  try {
    // We use the current date to salt the prompt slightly to ensure randomness if requested multiple times,
    // though the main logic will cache by date in localStorage.
    const today = new Date().toISOString().split('T')[0];
    
    const prompt = `Generate 7 unique, challenging, and educational multiple-choice questions for a Greek language learner at B1 (Intermediate) level.
    Focus on:
    - B1 Grammar (Subjunctive, Future Continuous, Passive Voice, etc.)
    - Essential Vocabulary
    - Idioms common in Greece
    
    The output must be a JSON array of objects.
    Date Context: ${today}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: quizSchema,
        temperature: 0.7, // Slight creativity to vary questions
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No data returned from Gemini.");
    }

    const data = JSON.parse(text);
    
    // Add IDs to the questions
    const questionsWithIds = data.map((q: any, index: number) => ({
      ...q,
      id: index + 1
    }));

    return questionsWithIds;
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw error;
  }
};