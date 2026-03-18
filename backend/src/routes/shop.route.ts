import { FastifyInstance } from "fastify";
import { shopController } from "../controllers/shop.controller";
import { authenticate } from "../hooks/auth.hooks";

export default async function shopRoutes(fastify: FastifyInstance) {
  fastify.post("/", { preHandler: authenticate }, shopController.createShop);
  fastify.get("/me", { preHandler: authenticate }, shopController.getMyShop);
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
}
