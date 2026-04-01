import { FastifyReply, FastifyRequest } from "fastify";
import { favoritesModel } from "../models/favorites.model";
export const favoritesController = {
  // backend/src/controllers/favourites.controller.ts

  async toggleFavorite(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user as any;
    const userId = user.id;

    // CHANGE THIS: Pull "id" from body and rename it to "listingId"
    const { listingId } = request.body as { listingId: string };

    // Safety check to prevent the database error you just saw
    if (!listingId) {
      return reply.status(400).send({
        error: "listingId (id) is missing in the request body",
      });
    }

    const isFav = await favoritesModel.isFavorited(userId, listingId);

    if (isFav) {
      await favoritesModel.removeFavorite(userId, listingId);
      return reply.send({ favorited: false });
    } else {
      await favoritesModel.addFavorite(userId, listingId);
      return reply.send({ favorited: true });
    }
  },

  async getFavorites(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request as any).user.id;

    const favorites = await favoritesModel.getUserFavorites(userId);
    return reply.send(favorites);
  },
};
