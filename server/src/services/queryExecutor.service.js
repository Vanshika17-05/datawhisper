import mongoose from "mongoose";
import { Order } from "../models/Order.js";
import { Employee } from "../models/Employee.js";
import { Sale } from "../models/Sale.js";

export const ALLOWED_COLLECTIONS = ["orders", "employees", "sales"];
export const ALLOWED_STAGES = new Set(["$match", "$group", "$sort", "$project", "$limit", "$count", "$unwind", "$lookup", "$addFields", "$bucket", "$facet"]);
const FORBIDDEN_OPERATORS = new Set(["$out", "$merge", "$function", "$accumulator", "$where", "$currentOp"]);
const models = { orders: Order, employees: Employee, sales: Sale };

function inspectValue(value, path = "pipeline") {
  if (typeof value === "string" && value.includes("$$")) return `${path} contains forbidden system-variable access`;
  if (Array.isArray(value)) { for (let index = 0; index < value.length; index += 1) { const error = inspectValue(value[index], `${path}[${index}]`); if (error) return error; } return null; }
  if (!value || typeof value !== "object") return null;
  for (const [key, nested] of Object.entries(value)) {
    if (FORBIDDEN_OPERATORS.has(key)) return `${path} contains forbidden operator ${key}`;
    const error = inspectValue(nested, `${path}.${key}`); if (error) return error;
  }
  return null;
}

function validateStages(pipeline, path = "pipeline", depth = 0) {
  if (!Array.isArray(pipeline)) return `${path} must be an array`;
  if (pipeline.length > 50) return `${path} has too many stages`;
  if (depth > 8) return `${path} is nested too deeply`;
  for (let index = 0; index < pipeline.length; index += 1) {
    const stage = pipeline[index]; const stagePath = `${path}[${index}]`;
    if (!stage || typeof stage !== "object" || Array.isArray(stage)) return `${stagePath} must be an object`;
    const keys = Object.keys(stage);
    if (keys.length !== 1 || !ALLOWED_STAGES.has(keys[0])) return `${stagePath} uses disallowed stage ${keys[0] || "unknown"}`;
    const [operator] = keys;
    if (operator === "$facet") { if (!stage.$facet || typeof stage.$facet !== "object") return `${stagePath} has an invalid $facet`; for (const [name, nestedPipeline] of Object.entries(stage.$facet)) { const error = validateStages(nestedPipeline, `${stagePath}.$facet.${name}`, depth + 1); if (error) return error; } }
    if (operator === "$lookup") {
      if (!stage.$lookup || typeof stage.$lookup !== "object") return `${stagePath} has an invalid $lookup`;
      if (!ALLOWED_COLLECTIONS.includes(stage.$lookup.from)) return `${stagePath} joins a disallowed collection`;
      if (stage.$lookup.pipeline) { const error = validateStages(stage.$lookup.pipeline, `${stagePath}.$lookup.pipeline`, depth + 1); if (error) return error; }
    }
    const valueError = inspectValue(stage, stagePath); if (valueError) return valueError;
  }
  return null;
}

function normalizeExtendedJson(value) {
  if (Array.isArray(value)) return value.map(normalizeExtendedJson);
  if (!value || typeof value !== "object") return value;
  if (Object.keys(value).length === 1 && typeof value.$date === "string") { const date = new Date(value.$date); if (Number.isNaN(date.getTime())) throw new Error("Pipeline contains an invalid date"); return date; }
  return Object.fromEntries(Object.entries(value).map(([key, nested]) => [key, normalizeExtendedJson(nested)]));
}

function enforceLimits(pipeline) {
  let hasLimit = false;
  for (const stage of pipeline) {
    if (Object.hasOwn(stage, "$limit")) { stage.$limit = Math.min(stage.$limit, 500); hasLimit = true; }
    if (stage.$facet) Object.values(stage.$facet).forEach(enforceLimits);
    if (stage.$lookup?.pipeline) enforceLimits(stage.$lookup.pipeline);
  }
  if (!hasLimit) pipeline.push({ $limit: 500 });
}

export function validatePipeline(collection, pipeline) {
  if (!ALLOWED_COLLECTIONS.includes(collection)) return { success: false, error: `Collection '${collection}' is not allowed` };
  if (!Array.isArray(pipeline) || pipeline.length === 0) return { success: false, error: "Pipeline must be a non-empty array" };
  const validationError = validateStages(pipeline); if (validationError) return { success: false, error: validationError };
  let normalized;
  try { normalized = normalizeExtendedJson(pipeline); } catch (error) { return { success: false, error: error.message }; }
  const safePipeline = structuredClone(normalized);
  const invalidLimit = (() => { let error = null; const walk = (stages) => { for (const stage of stages) { if (Object.hasOwn(stage, "$limit") && (!Number.isInteger(stage.$limit) || stage.$limit < 1)) error = "$limit must be a positive integer"; if (stage.$facet) Object.values(stage.$facet).forEach(walk); if (stage.$lookup?.pipeline) walk(stage.$lookup.pipeline); } }; walk(safePipeline); return error; })();
  if (invalidLimit) return { success: false, error: invalidLimit };
  enforceLimits(safePipeline);
  return { success: true, pipeline: safePipeline };
}

export async function executeQuery(collection, pipeline) {
  const validation = validatePipeline(collection, pipeline);
  if (!validation.success) return validation;
  if (mongoose.connection.readyState !== 1) return { success: false, error: "Database is not connected" };
  try { const data = await models[collection].aggregate(validation.pipeline).option({ maxTimeMS: 5000, allowDiskUse: false }); return { success: true, data, pipeline: validation.pipeline }; }
  catch (error) { console.error("Aggregation execution failed:", error.message); return { success: false, error: "The database could not safely complete this query" }; }
}

export function getCollectionModel(collection) { return models[collection] || null; }
