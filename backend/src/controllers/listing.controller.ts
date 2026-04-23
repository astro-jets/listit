import { FastifyRequest, FastifyReply } from "fastify";
import { listingModel } from "../models/listing.model";
import { processMultipartImages } from "../services/blob.service";
import { del } from "@vercel/blob";

export const listingController = {
  /**
   * POST /listings
   * Handles multipart/form-data for new listings including up to 5 images.
   */
  async createListing(request: FastifyRequest, reply: FastifyReply) {
    try {
      // 1. Injected from auth middleware (e.g., JWT)
      const userId = (request.user as any)?.id;

      // 2. Process images and text fields from the FormData
      const { fields, imageUrls } = await processMultipartImages(request, 5);

      // 3. Prepare data with correct types for PostgreSQL
      const listingData = {
        ...fields,
        seller_id: userId,
        shop_id: fields.shop_id ? parseInt(fields.shop_id) : null,
        category_id: fields.category_id ? parseInt(fields.category_id) : null,
        price: fields.price ? parseFloat(fields.price) : 0,
        images: imageUrls, // Passed to the model's transaction loop
      };

      if (!listingData.shop_id || !listingData.title) {
        return reply
          .status(400)
          .send({ error: "Shop ID and Title are required." });
      }

      const listing = await listingModel.createListing(listingData);
      return reply.status(201).send(listing);
    } catch (error: any) {
      console.error("Create Listing Error:", error);
      return reply.status(500).send({
        error:
          error.message ||
          "An unexpected error occurred while creating the listing.",
      });
    }
  },

  // GET /listings/shop/:shopId
  async getByShop(request: FastifyRequest, reply: FastifyReply) {
    const { shopId } = request.params as { shopId: string };

    // Extract the userId if the optionalAuthenticate middleware found a valid token
    // If no one is logged in, this will be null
    const userId = (request.user as any)?.id || null;

    // Pass both the shopId and the userId to the model
    const listings = await listingModel.getShopListings(shopId, userId);

    return reply.send(listings);
  },

  // GET /listings/search/:searchTerm
  async searchListing(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request.user as any)?.id || null; // Optional auth for favorite status
    const { searchTerm } = request.params as { searchTerm: string };
    const listings = await listingModel.searchListings(searchTerm, userId);
    return reply.send(listings);
  },

  /**
   * PATCH /listings/:id
   * Updates text/metadata. Note: Image updates are typically handled via a separate endpoint.
   */
  async update(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const body = request.body as any;

    try {
      // Ensure numeric fields are correctly typed if coming from a JSON body
      const updateData = {
        ...body,
        category_id: body.category_id ? parseInt(body.category_id) : undefined,
        price: body.price ? parseFloat(body.price) : undefined,
      };

      const updatedListing = await listingModel.updateListing(
        parseInt(id),
        updateData,
      );

      if (!updatedListing) {
        return reply.status(404).send({ message: "Listing not found" });
      }

      return reply.send(updatedListing);
    } catch (error) {
      return reply.status(500).send({ error: "Failed to update listing" });
    }
  },

  /**
   * DELETE /listings/:id
   * Cleans up both DB records and external Vercel Blob assets.
   */
  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const listingId = parseInt(id);

    try {
      // 1. Retrieve image URLs before DB deletion
      const imageUrls = await listingModel.getListingImages(listingId);

      // 2. Remove from DB
      const success = await listingModel.deleteListing(listingId);
      if (!success) {
        return reply.status(404).send({ message: "Listing not found" });
      }

      // 3. Remove blobs only if DB deletion was successful
      if (imageUrls && imageUrls.length > 0) {
        await del(imageUrls);
      }

      return reply.status(204).send();
    } catch (error) {
      console.error("Delete Error:", error);
      return reply
        .status(500)
        .send({ error: "Failed to delete listing or assets" });
    }
  },

  // GET /listings/my-listings
  async getMyListings(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request.user as any).id;
    const listings = await listingModel.getListingsByUser(userId);
    return reply.send(listings);
  },

  // GET /listings/:id
  async getOne(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const userId = (request.user as any)?.id || null; // Get from optional auth
    console.log("User ID ==========> ", userId);
    const listing = await listingModel.getListingById(id, userId);

    if (!listing) {
      return reply.status(404).send({ message: "Listing not found" });
    }

    return reply.send(listing);
  },

  /**
   * GET /listings/featured
   * Fetches public listings verified via the Unified Approval Logic (Shop-based).
   */
  async fetchFeaturedListings(request: FastifyRequest, reply: FastifyReply) {
    try {
      // Use optional chaining for public access; returns null for f.user_id if guest
      const userId = (request.user as any)?.id;
      console.log("DEBUG: Current User ID in Controller:", userId);
      // Handle pagination from query params (defaults: page 1, limit 12)
      const { page = 1, limit = 12 } = request.query as any;

      const pageNumber = Math.max(1, Number(page));
      const pageSize = Math.max(1, Number(limit));
      const offset = (pageNumber - 1) * pageSize;

      const result = await listingModel.getFeaturedListings(
        pageSize,
        offset,
        userId,
      );

      return reply.send({
        data: result.data || [],
        pagination: {
          total: result.total || 0,
          page: pageNumber,
          limit: pageSize,
          totalPages: Math.ceil((result.total || 0) / pageSize),
        },
      });
    } catch (error) {
      console.error("Featured Fetch Error:", error);
      return reply
        .status(500)
        .send({ error: "Failed to fetch featured content" });
    }
  },
};
