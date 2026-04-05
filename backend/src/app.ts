// src/app.ts
import Fastify from "fastify";
import dotenv from "dotenv";

// Plugins
import corsPlugin from "./plugins/cors";
import multipartPlugin from "./plugins/multipart";
import postgresPlugin from "./plugins/postgress";

// Routes
import healthRoute from "./routes/health.route";
import authRoutes from "./routes/auth.route";
import listingsRoutes from "./routes/listings.route";
import shopRoutes from "./routes/shop.route";
import { favoritesRoutes } from "./routes/favourites.route";
import reviewRoutes from "./routes/review.route";
import { categoryRoutes } from "./routes/categories.route";
import { adminRoutes } from "./routes/admin.route";

dotenv.config();

export async function buildApp() {
  const app = Fastify({ logger: true });

  // Plugins
  await app.register(corsPlugin);
  await app.register(multipartPlugin);
  await app.register(postgresPlugin);

  // Routes
  await app.register(healthRoute);
  await app.register(authRoutes);
  await app.register(listingsRoutes, { prefix: "/listings" });
  await app.register(shopRoutes, { prefix: "/shops" });
  await app.register(favoritesRoutes, { prefix: "/favorites" });
  await app.register(reviewRoutes, { prefix: "/reviews" });
  await app.register(categoryRoutes, { prefix: "/categories" });
  await app.register(adminRoutes, { prefix: "/admin" });

  return app;
}
