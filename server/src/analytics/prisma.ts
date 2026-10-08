import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { analyticsPrisma?: PrismaClient };

export const analyticsPrisma = globalForPrisma.analyticsPrisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.analyticsPrisma = analyticsPrisma;
