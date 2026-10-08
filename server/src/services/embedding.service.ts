import { GoogleGenAI } from "@google/genai";
import { env } from "../config/env.js";

export const EMBEDDING_DIMENSIONS = 768;
const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

function normalize(values: number[]): number[] {
  const magnitude = Math.sqrt(values.reduce((sum, value) => sum + value * value, 0));
  if (!Number.isFinite(magnitude) || magnitude === 0) throw new Error("Embedding has zero magnitude");
  return values.map((value) => value / magnitude);
}

export async function embedQuestion(question: string): Promise<number[]> {
  const response = await ai.models.embedContent({
    model: env.GEMINI_EMBEDDING_MODEL,
    contents: question,
    config: {
      taskType: "SEMANTIC_SIMILARITY",
      outputDimensionality: EMBEDDING_DIMENSIONS,
      httpOptions: { timeout: 15000 },
      abortSignal: AbortSignal.timeout(15000),
    },
  });
  const values = response.embeddings?.[0]?.values;
  if (!values?.length || values.length !== EMBEDDING_DIMENSIONS) throw new Error(`Expected a ${EMBEDDING_DIMENSIONS}-dimension embedding`);
  return normalize(values);
}
