import { app } from "./app.js";
import { connectDatabase, disconnectDatabase } from "./config/db.js";
import { env } from "./config/env.js";

let server;

async function start() {
  await connectDatabase();
  server = app.listen(env.PORT, () => console.log(`Datawhisper API listening on http://localhost:${env.PORT}`));
}

async function shutdown(signal) {
  console.log(`${signal} received; shutting down`);
  server?.close(async () => {
    await disconnectDatabase();
    process.exit(0);
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
start().catch((error) => { console.error("Failed to start server", error); process.exit(1); });
