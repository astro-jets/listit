import { FastifyInstance } from "fastify";
import { listingController } from "../controllers/listing.controller";
import { authenticate } from "../hooks/auth.hooks";

export default async function listingsRoutes(fastify: FastifyInstance) {
  // fastify.get("/", listingController.getListings);

  fastify.get("/search", listingController.searchListings);

  fastify.get("/:id", listingController.getListing);

  // Create a listing
  fastify.post(
    "/",
    {
      preHandler: authenticate,
    },
    listingController.createListing,
  );
}
