import { FastifyInstance } from "fastify";
import { listingController } from "../controllers/listing.controller";
import { authenticate } from "../hooks/auth.hooks";

export default async function listingsRoutes(fastify: FastifyInstance) {
  // fastify.addHook("preHandler", authenticate);
  // Create a listing
  fastify.post("/", listingController.createListing);
  fastify.get("/", listingController.getListings);
}
