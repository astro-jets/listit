import { FastifyRequest, FastifyReply } from "fastify";
import { listingModel } from "../models/listing.model";
import { processMultipartImages } from "../services/blob.service";
import { del } from "@vercel/blob";

export const listingController = {
  // POST /listings
  async createListing(request: FastifyRequest, reply: FastifyReply) {
    // 1. Process images (max 5) and text fields from the FormData
    const { fields, imageUrls } = await processMultipartImages(request, 5);

    const listing = await listingModel.createListing({
      ...fields,
      images: imageUrls,
    });

    return reply.status(201).send(listing);
  },

  // GET /listings/shop/:shopId
  async getByShop(request: FastifyRequest, reply: FastifyReply) {
    const { shopId } = request.params as { shopId: string };
    const listings = await listingModel.getShopListings(shopId);
    return reply.send(listings);
  },

  // PATCH /listings/:id
  async update(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const data = request.body as any;

    const updatedListing = await listingModel.updateListing(parseInt(id), data);

    if (!updatedListing) {
      return reply.status(404).send({ message: "Listing not found" });
    }

    return reply.send(updatedListing);
  },

  // DELETE /listings/:id
  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const listingId = parseInt(id);

    try {
      // 1. Get all image URLs associated with this listing before deleting it
      // (Because ON DELETE CASCADE will wipe the DB references immediately)
      const imageUrls = await listingModel.getListingImages(listingId);

      // 2. Delete from database
      const success = await listingModel.deleteListing(listingId);

      if (!success) {
        return reply.status(404).send({ message: "Listing not found" });
      }

      // 3. If the DB delete was successful, remove files from Vercel
      if (imageUrls.length > 0) {
        // del() can take a single string or an array of strings
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
    // Assuming you have the user ID from your JWT/Auth middleware
    const userId = (request.user as any).id;
    const listings = await listingModel.getListingsByUser(userId);
    return reply.send(listings);
  },

  // GET /listings/:id
  async getOne(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const listing = await listingModel.getListingById(id);

    if (!listing) {
      return reply.status(404).send({ message: "Listing not found" });
    }

    return reply.send(listing);
  },

  async fetchFeaturedListings(request: FastifyRequest, reply: FastifyReply) {
    const { page = 1, limit = 12 } = request.params as any;

    const pageNumber = Number(page);
    const pageSize = Number(limit);
    const offset = (pageNumber - 1) * pageSize;

    const result = await listingModel.getFeaturedListings(pageSize, offset);

    return reply.send({
      data: result,
      pagination: {
        total: result.total,
        page: pageNumber,
        limit: pageSize,
        totalPages: Math.ceil(result.total / pageSize),
      },
    });
  },
};
