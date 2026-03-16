// src/app.ts
import Fastify from "fastify";
import dotenv from "dotenv";

import corsPlugin from "./plugins/cors";
import multipartPlugin from "./plugins/multipart";
import postgresPlugin from "./plugins/postgress";
import healthRoute from "./routes/health.route";
import authRoutes from "./routes/auth.route";
import { pool } from "./db/db";
import { initDb } from "./db/initDb";
import listingsRoutes from "./routes/listings.route";

dotenv.config();

export async function buildApp() {
  const app = Fastify({ logger: true });

  // Plugins
  await app.register(corsPlugin);
  await app.register(multipartPlugin);
  await app.register(postgresPlugin);

  // Initialize database
  await initDb(pool);

  // Routes
  await app.register(healthRoute);
  await app.register(authRoutes);
  await app.register(listingsRoutes, { prefix: "/listings" });

  return app;
}
