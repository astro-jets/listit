import { FastifyInstance } from "fastify";
import { shopController } from "../controllers/shop.controller";
import { authenticate, optionalAuthenticate } from "../hooks/auth.hooks";
import { ReviewController } from "../controllers/review.controller";

export default async function shopRoutes(fastify: FastifyInstance) {
  fastify.post("/", { preHandler: authenticate }, shopController.createShop);
  fastify.get("/me", { preHandler: authenticate }, shopController.getMyShop);
  fastify.get("/featured", shopController.getFeaturedShops);
  fastify.patch(
    "/update/:id",
    { preHandler: authenticate },
    shopController.updateShop,
  );
  fastify.delete(
    "/delete/:id",
    { preHandler: authenticate },
    shopController.deleteShop,
  );
  fastify.get(
    "/reviews/:shopId",
    { preHandler: authenticate },
    ReviewController.getShopReviews,
  );
  fastify.post(
    "/reviews/reply",
    { preHandler: authenticate },
    ReviewController.replyToReview,
  );
  fastify.get(
    "/dashboard",
    { preHandler: authenticate },
    shopController.getDashboardData,
  );
  fastify.get(
    "/:id",
    { preHandler: optionalAuthenticate },
    shopController.getShopById,
  );
}
