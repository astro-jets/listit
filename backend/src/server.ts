// src/server.ts
import { initDb } from "./db/initDb";
import { pool } from "./db/db";

import { buildApp } from "./app";
import { resetDb } from "./db/reset";

const start = async () => {
  try {
    const app = await buildApp();

    // Reset Database
    await resetDb(pool);

    // Initialize database
    await initDb(pool);
    await app.listen({
      port: Number(process.env.PORT) || 4000,
      host: "0.0.0.0",
    });

    console.log("🚀 Server running");
  } catch (err) {
    console.error("❌ Server failed to start", err);
    process.exit(1);
  }
};

start();
