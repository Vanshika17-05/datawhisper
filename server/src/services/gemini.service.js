import { FunctionCallingConfigMode, GoogleGenAI } from "@google/genai";
import { env } from "../config/env.js";
import { formatSchemaContext } from "./schemaContext.js";

const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
const allowedStages = ["$match", "$group", "$sort", "$project", "$limit", "$count", "$unwind", "$lookup", "$addFields", "$bucket", "$facet"];
const runAggregationDeclaration = {
  name: "runAggregation",
  description: "Run a read-only MongoDB aggregation against one approved Datawhisper collection.",
  parametersJsonSchema: {
    type: "object", additionalProperties: false,
    properties: {
      collection: { type: "string", enum: ["orders", "employees", "sales"] },
      pipeline: { type: "string", description: "A valid JSON string containing the MongoDB aggregation pipeline array." },
      chartType: { type: "string", enum: ["bar", "pie", "line", "table"] },
      title: { type: "string", description: "A concise human-readable result title." },
    },
    required: ["collection", "pipeline", "chartType", "title"],
  },
};

function systemPrompt() {
  const today = new Date().toISOString().slice(0, 10);
  return `You translate plain-English analytics questions into safe MongoDB aggregation pipelines. Today's date is ${today}. Resolve relative dates such as last month and this quarter using this date and ISO date values.\n\nExact database schema:\n${formatSchemaContext()}\n\nRules:\n- Always call runAggregation; never answer in plain text.\n- Use exact collection and field names from the schema.\n- Only use these top-level aggregation stages: ${allowedStages.join(", ")}.\n- Never use $out, $merge, $function, $accumulator, $where, $currentOp, server-side JavaScript, or $$ system variables.\n- Dates in pipeline JSON must use MongoDB Extended JSON objects such as {\"$date\":\"2026-01-01T00:00:00.000Z\"}; do not emit JavaScript constructors.\n- Select pie for proportions with a small number of categories, bar for category comparisons, line for time series, and table for detailed records.\n- If a question says sales by city, use orders grouped by city and sum amount because sales has region but no city.\n- If the question is ambiguous, use the best conservative interpretation and reflect it in the title.`;
}

export async function generateQueryPlan(question) {
  try {
    const request = (model) => ai.models.generateContent({
      model, contents: question,
      config: { systemInstruction: systemPrompt(), temperature: 0.1, tools: [{ functionDeclarations: [runAggregationDeclaration] }], toolConfig: { functionCallingConfig: { mode: FunctionCallingConfigMode.ANY, allowedFunctionNames: ["runAggregation"] } } },
    });
    let response;
    try { response = await request(env.GEMINI_MODEL); }
    catch (error) {
      const unavailable = error.message?.includes("no longer available") || error.message?.includes('"code":404');
      if (!unavailable || env.GEMINI_MODEL === "gemini-3.8-flash") throw error;
      console.warn(`Gemini model ${env.GEMINI_MODEL} is unavailable; retrying with gemini-3.8-flash.`);
      response = await request("gemini-3.8-flash");
    }
    const call = response.functionCalls?.find(({ name }) => name === "runAggregation");
    if (!call?.args) return { success: false, message: "I need a little more detail to turn that into a data query." };
    const { collection, pipeline: pipelineJson, chartType, title } = call.args;
    let pipeline;
    try { pipeline = typeof pipelineJson === "string" ? JSON.parse(pipelineJson) : pipelineJson; }
    catch { return { success: false, message: "The generated query was malformed. Please try rephrasing your question." }; }
    if (!Array.isArray(pipeline)) return { success: false, message: "The generated query was not a valid aggregation pipeline." };
    if (!["orders", "employees", "sales"].includes(collection) || !["bar", "pie", "line", "table"].includes(chartType) || typeof title !== "string") return { success: false, message: "The generated query plan was incomplete. Please try a more specific question." };
    return { success: true, collection, pipeline, chartType, title: title.slice(0, 120) };
  } catch (error) {
    console.error("Gemini query planning failed:", error.message);
    return { success: false, message: "I couldn't generate a query right now. Please try again in a moment." };
  }
}
