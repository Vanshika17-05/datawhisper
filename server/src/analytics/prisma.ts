import { PrismaClient } from "@prisma/client";
import { env } from "../config/env.js";

const globalForPrisma = globalThis as unknown as { analyticsPrisma?: PrismaClient };

function analyticsDatabaseUrl(): string {
  const url = new URL(env.DATABASE_URL);
  if (url.port === "6543") {
    url.searchParams.set("pgbouncer", "true");
    url.searchParams.set("connection_limit", "1");
  }
  return url.toString();
}

export const analyticsPrisma = globalForPrisma.analyticsPrisma ?? new PrismaClient({
  datasources: { db: { url: analyticsDatabaseUrl() } },
});

if (process.env.NODE_ENV !== "production") globalForPrisma.analyticsPrisma = analyticsPrisma;

export async function verifyAnalyticsDatabase(): Promise<void> {
  await analyticsPrisma.$connect();
  await analyticsPrisma.queryLog.findFirst({ select: { id: true } });
  console.log("Postgres connected");
}
