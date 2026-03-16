import { FastifyRequest, FastifyReply } from "fastify";
import { listingModel } from "../models/listing.model";
import { processMultipartImages } from "../services/blob.service";

export const listingController = {
  async getListing(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;

    const listing = await listingModel.getListingById(id);

    return reply.send(listing);
  },

  async updateListing(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;

    const listing = await listingModel.updateListing(id, request.body);

    return reply.send(listing);
  },

  async deleteListing(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;

    const result = await listingModel.deleteListing(id);

    return reply.send(result);
  },

  async searchListings(
    request: FastifyRequest<{ Querystring: { q: string } }>,
    reply: FastifyReply,
  ) {
    const { q } = request.query;

    const listings = await listingModel.searchListings(q);

    return reply.send(listings);
  },

  async createListing(request: FastifyRequest, reply: FastifyReply) {
    const { fields, imageUrls } = await processMultipartImages(request, 3);

    const listing = await listingModel.createListing({
      ...fields,
      seller_id: request.user.id,
      images: imageUrls,
    });

    return reply.send(listing);
  },
};
