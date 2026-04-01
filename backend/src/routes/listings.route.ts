import { FastifyInstance } from "fastify";
import { listingController } from "../controllers/listing.controller";
import { authenticate } from "../hooks/auth.hooks";

export default async function listingsRoutes(app: FastifyInstance) {
  app.post("/", listingController.createListing);
  app.get("/shop/:shopId", listingController.getByShop);
  app.get("/search/:searchTerm", listingController.searchListing);
  app.patch("/:id", listingController.update);
  app.delete("/:id", listingController.delete);
  // Get listings for the logged-in user
  app.get(
    "/my-listings",
    { preHandler: authenticate },
    listingController.getMyListings,
  );
  app.get(
    "/featured",
    { preHandler: authenticate },
    listingController.fetchFeaturedListings,
  );
  // Get a single listing by ID (Public)
  app.get("/:id", listingController.getOne);
}
