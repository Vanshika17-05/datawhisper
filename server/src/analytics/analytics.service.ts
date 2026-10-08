import { analyticsPrisma } from "./prisma.js";

export interface QueryLogInput {
  userId: string;
  question: string;
  collection: string;
  chartType: string;
  success: boolean;
  responseTimeMs: number;
}

export function logQuery(input: QueryLogInput): void {
  void analyticsPrisma.queryLog.create({ data: input }).catch((error: unknown) => {
    console.error("Analytics logging failed:", error instanceof Error ? error.message : error);
  });
}

interface DailyQueryCount { date: string; count: number }

export async function getAnalyticsSummary(userId: string) {
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setUTCHours(0, 0, 0, 0);
  fourteenDaysAgo.setUTCDate(fourteenDaysAgo.getUTCDate() - 13);

  const [totalQueries, successfulQueries, responseTime, collections, dailyRows] = await Promise.all([
    analyticsPrisma.queryLog.count({ where: { userId } }),
    analyticsPrisma.queryLog.count({ where: { userId, success: true } }),
    analyticsPrisma.queryLog.aggregate({ where: { userId }, _avg: { responseTimeMs: true } }),
    analyticsPrisma.queryLog.groupBy({
      by: ["collection"],
      where: { userId, collection: { not: "unknown" } },
      _count: { collection: true },
      orderBy: { _count: { collection: "desc" } },
      take: 1,
    }),
    analyticsPrisma.$queryRaw<DailyQueryCount[]>`
      SELECT day::date::text AS "date", COUNT(log.id)::int AS "count"
      FROM generate_series(
        date_trunc('day', ${fourteenDaysAgo}::timestamptz),
        date_trunc('day', ${new Date()}::timestamptz),
        interval '1 day'
      ) AS day
      LEFT JOIN "QueryLog" AS log
        ON log."createdAt" >= day
        AND log."createdAt" < day + interval '1 day'
        AND log."userId" = ${userId}
      GROUP BY day
      ORDER BY day ASC
    `,
  ]);

  return {
    totalQueries,
    successRate: totalQueries ? Math.round((successfulQueries / totalQueries) * 1000) / 10 : 0,
    mostQueriedCollection: collections[0]?.collection ?? null,
    averageResponseTimeMs: Math.round(responseTime._avg.responseTimeMs ?? 0),
    queriesPerDay: dailyRows,
  };
}
