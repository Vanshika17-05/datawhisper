import type { PipelineStage, Types } from "mongoose";

export const COLLECTION_NAMES = ["orders", "employees", "sales"] as const;
export type CollectionName = (typeof COLLECTION_NAMES)[number];

export const CHART_TYPES = ["bar", "pie", "line", "table"] as const;
export type ChartType = (typeof CHART_TYPES)[number];

export const ALLOWED_STAGE_NAMES = [
  "$match", "$group", "$sort", "$project", "$limit", "$count", "$unwind",
  "$lookup", "$addFields", "$bucket", "$facet",
] as const;
export type AllowedStageName = (typeof ALLOWED_STAGE_NAMES)[number];
export type AggregationStage = Partial<Record<AllowedStageName, unknown>> & Record<string, unknown>;
export type AggregationPipeline = AggregationStage[];

export interface UserDocument {
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

export interface OrderDocument {
  orderId: string; customerName: string; city: string; product: string; category: string;
  quantity: number; amount: number; status: string; orderDate: Date;
}

export interface EmployeeDocument {
  name: string; department: string; role: string; city: string; salary: number;
  joinDate: Date; status: string;
}

export interface SaleDocument {
  region: string; product: string; category: string; revenue: number; unitsSold: number;
  quarter: string; saleDate: Date;
}

export interface GeminiFunctionCallResponse {
  collection: CollectionName;
  pipeline: AggregationPipeline;
  chartType: ChartType;
  title: string;
}

export type QueryExecutorResult<T = Record<string, unknown>> =
  | { success: true; data: T[]; pipeline: PipelineStage[]; error?: never }
  | { success: false; data?: never; pipeline?: never; error: string };

export interface JwtPayload {
  sub: string;
  iat?: number;
  exp?: number;
}

export interface QueryHistoryDocument {
  question: string; pipeline: unknown[]; chartType: ChartType; title: string;
  sourceCollection: CollectionName; resultCount: number; userId: Types.ObjectId; timestamp: Date;
  embedding?: number[];
  exports?: Array<{ format: "png" | "csv"; key: string; size: number; createdAt: Date }>;
}
