CREATE TABLE "QueryLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "collection" TEXT NOT NULL,
    "chartType" TEXT NOT NULL,
    "success" BOOLEAN NOT NULL,
    "responseTimeMs" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "QueryLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "QueryLog_userId_createdAt_idx" ON "QueryLog"("userId", "createdAt");
CREATE INDEX "QueryLog_userId_collection_idx" ON "QueryLog"("userId", "collection");
