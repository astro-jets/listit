import { FastifyInstance } from "fastify";
import { listingController } from "../controllers/listing.controller";
import { authenticate, optionalAuthenticate } from "../hooks/auth.hooks";

export default async function listingsRoutes(app: FastifyInstance) {
  // --- PUBLIC ROUTES ---

  // Get featured listings (Available to guests and logged-in users)
  app.get(
    "/featured",
    { preHandler: optionalAuthenticate },
    listingController.fetchFeaturedListings,
  );

  // Search listings by title/description
  app.get(
    "/search/:searchTerm",
    { preHandler: optionalAuthenticate },
    listingController.searchListing,
  );

  // Get all listings belonging to a specific shop
  app.get(
    "/shop/:shopId",
    { preHandler: optionalAuthenticate },
    listingController.getByShop,
  );

  // --- PROTECTED ROUTES ---

  // Create a new listing (Requires multipart/form-data for images)
  app.post("/", { preHandler: authenticate }, listingController.createListing);

  // Update listing metadata (title, price, category, etc.)
  app.patch("/:id", { preHandler: authenticate }, listingController.update);

  // Delete a listing and its associated Vercel Blob assets
  app.delete("/:id", { preHandler: authenticate }, listingController.delete);

  // Get listings owned by the currently authenticated user
  app.get(
    "/my-listings",
    { preHandler: authenticate },
    listingController.getMyListings,
  );

  // Get a single listing by ID
  app.get(
    "/:id",
    { preHandler: optionalAuthenticate },
    listingController.getOne,
  );
}
