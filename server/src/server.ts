import { app } from "./app.js";
import { connectDatabase, disconnectDatabase } from "./config/db.js";
import { env } from "./config/env.js";
import type { Server } from "node:http";
import { logS3ClientReady } from "./services/s3.service.js";
import { verifyAnalyticsDatabase } from "./analytics/prisma.js";

let server: Server | undefined;

async function start(): Promise<void> {
  await connectDatabase();
  try {
    await verifyAnalyticsDatabase();
  } catch (error) {
    console.error("Postgres connection error:", error instanceof Error ? error.message : error);
  }
  logS3ClientReady();
  server = app.listen(env.PORT, () => console.log(`Datawhisper API listening on http://localhost:${env.PORT}`));
}

async function shutdown(signal: NodeJS.Signals): Promise<void> {
  console.log(`${signal} received; shutting down`);
  server?.close(async () => {
    await disconnectDatabase();
    process.exit(0);
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
start().catch((error) => { console.error("Failed to start server", error); process.exit(1); });
