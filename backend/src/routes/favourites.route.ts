import { FastifyInstance } from "fastify";
import { favoritesController } from "../controllers/favourites.controller";
import { authenticate } from "../hooks/auth.hooks";
export async function favoritesRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/",
    { preHandler: authenticate },
    favoritesController.getFavorites,
  );
  fastify.post(
    "/toggle",
    { preHandler: authenticate },
    favoritesController.toggleFavorite,
  );
}
