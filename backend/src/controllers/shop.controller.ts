import { FastifyRequest, FastifyReply } from "fastify";
import { shopModel } from "../models/shop.model";
import { processMultipartImages } from "../services/blob.service";

export const shopController = {
  async createShop(request: FastifyRequest, reply: FastifyReply) {
    try {
      // 1. Process multipart data (fields and file)
      // Assuming processMultipartFields returns { fields, file }
      const { fields, imageUrls } = await processMultipartImages(request, 3);

      // 2. Validate and format data
      const shopData = {
        name: fields.name,
        bio: fields.bio,
        location: JSON.parse(fields.location), // Parse the stringified JSON
        logo_url: imageUrls[0], // Handle image upload logic
        seller_id: (request as any).user.id, // From auth hook
      };

      // 3. Save to database
      const shop = await shopModel.createShop(shopData);

      return reply.code(201).send(shop);
    } catch (error) {
      return reply.code(500).send({ error: "Failed to create shop" });
    }
  },
};
