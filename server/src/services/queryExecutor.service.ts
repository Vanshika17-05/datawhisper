import mongoose, { type Model, type PipelineStage } from "mongoose";
import { Employee } from "../models/Employee.js";
import { Order } from "../models/Order.js";
import { Sale } from "../models/Sale.js";
import { ALLOWED_STAGE_NAMES, COLLECTION_NAMES, type AggregationPipeline, type AggregationStage, type AllowedStageName, type CollectionName, type QueryExecutorResult } from "../types/domain.js";

export const ALLOWED_COLLECTIONS: readonly CollectionName[] = COLLECTION_NAMES;
export const ALLOWED_STAGES: ReadonlySet<AllowedStageName> = new Set(ALLOWED_STAGE_NAMES);
const FORBIDDEN_OPERATORS: ReadonlySet<string> = new Set(["$out", "$merge", "$function", "$accumulator", "$where", "$currentOp"]);
const models: Record<CollectionName, Model<unknown>> = { orders: Order as Model<unknown>, employees: Employee as Model<unknown>, sales: Sale as Model<unknown> };

export function isCollectionName(value: unknown): value is CollectionName { return typeof value === "string" && (COLLECTION_NAMES as readonly string[]).includes(value); }
function isRecord(value: unknown): value is Record<string, unknown> { return value !== null && typeof value === "object" && !Array.isArray(value); }

function inspectValue(value: unknown, path = "pipeline"): string | null {
  if (typeof value === "string" && value.includes("$$")) return `${path} contains forbidden system-variable access`;
  if (Array.isArray(value)) { for (let index = 0; index < value.length; index += 1) { const error = inspectValue(value[index], `${path}[${index}]`); if (error) return error; } return null; }
  if (!isRecord(value)) return null;
  for (const [key, nested] of Object.entries(value)) { if (FORBIDDEN_OPERATORS.has(key)) return `${path} contains forbidden operator ${key}`; const error = inspectValue(nested, `${path}.${key}`); if (error) return error; }
  return null;
}

function validateStages(pipeline: unknown, path = "pipeline", depth = 0): string | null {
  if (!Array.isArray(pipeline)) return `${path} must be an array`;
  if (pipeline.length > 50) return `${path} has too many stages`;
  if (depth > 8) return `${path} is nested too deeply`;
  for (let index = 0; index < pipeline.length; index += 1) {
    const stage: unknown = pipeline[index]; const stagePath = `${path}[${index}]`;
    if (!isRecord(stage)) return `${stagePath} must be an object`;
    const keys = Object.keys(stage); const operator = keys[0];
    if (keys.length !== 1 || !operator || !ALLOWED_STAGES.has(operator as AllowedStageName)) return `${stagePath} uses disallowed stage ${operator || "unknown"}`;
    if (operator === "$facet") { const facet = stage.$facet; if (!isRecord(facet)) return `${stagePath} has an invalid $facet`; for (const [name, nestedPipeline] of Object.entries(facet)) { const error = validateStages(nestedPipeline, `${stagePath}.$facet.${name}`, depth + 1); if (error) return error; } }
    if (operator === "$lookup") { const lookup = stage.$lookup; if (!isRecord(lookup)) return `${stagePath} has an invalid $lookup`; if (!isCollectionName(lookup.from)) return `${stagePath} joins a disallowed collection`; if (lookup.pipeline !== undefined) { const error = validateStages(lookup.pipeline, `${stagePath}.$lookup.pipeline`, depth + 1); if (error) return error; } }
    const valueError = inspectValue(stage, stagePath); if (valueError) return valueError;
  }
  return null;
}

function normalizeExtendedJson(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(normalizeExtendedJson);
  if (!isRecord(value)) return value;
  if (Object.keys(value).length === 1 && typeof value.$date === "string") { const date = new Date(value.$date); if (Number.isNaN(date.getTime())) throw new Error("Pipeline contains an invalid date"); return date; }
  return Object.fromEntries(Object.entries(value).map(([key, nested]) => [key, normalizeExtendedJson(nested)]));
}

function nestedPipelines(stage: AggregationStage): AggregationPipeline[] {
  const nested: AggregationPipeline[] = [];
  if (isRecord(stage.$facet)) for (const value of Object.values(stage.$facet)) if (Array.isArray(value)) nested.push(value as AggregationPipeline);
  if (isRecord(stage.$lookup) && Array.isArray(stage.$lookup.pipeline)) nested.push(stage.$lookup.pipeline as AggregationPipeline);
  return nested;
}

function enforceLimits(pipeline: AggregationPipeline): void {
  let hasLimit = false;
  for (const stage of pipeline) { if (Object.hasOwn(stage, "$limit")) { stage.$limit = Math.min(Number(stage.$limit), 500); hasLimit = true; } nestedPipelines(stage).forEach(enforceLimits); }
  if (!hasLimit) pipeline.push({ $limit: 500 });
}

type PipelineValidation = { success: true; pipeline: PipelineStage[] } | { success: false; error: string };
export function validatePipeline(collection: unknown, pipeline: unknown): PipelineValidation {
  if (!isCollectionName(collection)) return { success: false, error: `Collection '${String(collection)}' is not allowed` };
  if (!Array.isArray(pipeline) || pipeline.length === 0) return { success: false, error: "Pipeline must be a non-empty array" };
  const validationError = validateStages(pipeline); if (validationError) return { success: false, error: validationError };
  let safePipeline: AggregationPipeline;
  try { safePipeline = structuredClone(normalizeExtendedJson(pipeline)) as AggregationPipeline; } catch (error) { return { success: false, error: error instanceof Error ? error.message : "Pipeline normalization failed" }; }
  const walk = (stages: AggregationPipeline): string | null => { for (const stage of stages) { if (Object.hasOwn(stage, "$limit") && (!Number.isInteger(stage.$limit) || Number(stage.$limit) < 1)) return "$limit must be a positive integer"; for (const nested of nestedPipelines(stage)) { const error = walk(nested); if (error) return error; } } return null; };
  const invalidLimit = walk(safePipeline); if (invalidLimit) return { success: false, error: invalidLimit };
  enforceLimits(safePipeline);
  return { success: true, pipeline: safePipeline as PipelineStage[] };
}

export async function executeQuery(collection: CollectionName, pipeline: unknown): Promise<QueryExecutorResult> {
  const validation = validatePipeline(collection, pipeline);
  if (!validation.success) return validation;
  if (mongoose.connection.readyState !== 1) return { success: false, error: "Database is not connected" };
  try { const data = await models[collection].aggregate<Record<string, unknown>>(validation.pipeline).option({ maxTimeMS: 5000, allowDiskUse: false }); return { success: true, data, pipeline: validation.pipeline }; }
  catch (error) { console.error("Aggregation execution failed:", error instanceof Error ? error.message : error); return { success: false, error: "The database could not safely complete this query" }; }
}

export function getCollectionModel(collection: CollectionName): Model<unknown> { return models[collection]; }
