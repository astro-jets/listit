import { FastifyRequest, FastifyReply } from "fastify";
import { listingModel } from "../models/listing.model";
import { processMultipartImages } from "../services/blob.service";

export const listingController = {
  async createListing(request: FastifyRequest, reply: FastifyReply) {
    const { fields, imageUrls } = await processMultipartImages(request, 3);

    const listing = await listingModel.createListing({
      ...fields,
      seller_id: 2, //request.user.id,
      images: imageUrls,
    });

    return reply.send(listing);
  },

  async getListings(request: FastifyRequest, reply: FastifyReply) {
    const res = await listingModel.getListings(6, 2);
    return reply.send(res);
  },
};
