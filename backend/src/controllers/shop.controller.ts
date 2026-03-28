import { FastifyRequest, FastifyReply } from "fastify";
import { shopModel } from "../models/shop.model";
import { processMultipartImages } from "../services/blob.service";
import { del } from "@vercel/blob";

declare module "fastify" {
  interface AuthenticatedUser {
    id: string; // The ID is required for primaryArtistId
  }

  interface FastifyRequest {
    user: AuthenticatedUser;
  }
}

export const shopController = {
  async createShop(request: FastifyRequest, reply: FastifyReply) {
    try {
      // 1. Process multipart data (logo + fields)
      // Max 1 image for the shop logo
      const { fields, imageUrls } = await processMultipartImages(request, 1);

      // 2. Extract and Validate
      const { name, bio, location } = fields;
      const logo_url = imageUrls.length > 0 ? imageUrls[0] : null;

      if (!name || !location) {
        return reply
          .code(400)
          .send({ error: "Shop name and location are required." });
      }

      // 3. Prepare data for Model
      const shopData = {
        name,
        bio,
        location:
          typeof location === "string" ? JSON.parse(location) : location,
        logo_url,
        owner_id: (request as any).user.id, // Populated by authenticate hook
      };

      // 4. Save to database
      const shop = await shopModel.createShop(shopData);

      return reply.code(201).send(shop);
    } catch (error: any) {
      console.error("Shop Creation Error:", error);
      return reply.code(500).send({
        error: error.message || "Failed to create shop",
      });
    }
  },
  // 2. Get Current User's Shop
  async getMyShop(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (request as any).user.id;
      const shop = await shopModel.getShopByOwner(userId);
      return reply.send(shop);
    } catch (error) {
      return reply.code(500).send({ error: "Could not fetch shop" });
    }
  },

  async getShopById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const shopId = request.params as { id: string };
      const shop = await shopModel.getShopById(parseInt(shopId.id));
      return reply.send(shop);
    } catch (error) {
      return reply.code(500).send({ error: "Could not fetch shop" });
    }
  },

  // 3. Delete Shop
  async deleteShop(request: FastifyRequest, reply: FastifyReply) {
    // If you don't see this log, the request isn't reaching the function code
    console.log("--- DELETE SEQUENCE INITIATED ---");

    try {
      const { id } = request.params as { id: string };
      const user = (request as any).user;

      if (!user || !user.id) {
        return reply.code(401).send({ error: "User session not found" });
      }

      const shopId = parseInt(id);
      const userId = user.id;

      console.log(`Target Shop: ${shopId} | Authorized User: ${userId}`);

      // 1. Delete from DB and get the logo_url back in one go
      const deletedShop = await shopModel.deleteShop(shopId, userId);

      if (!deletedShop) {
        console.log("Delete failed: Shop not found or user is not the owner.");
        return reply
          .code(404)
          .send({ error: "Shop not found or unauthorized" });
      }

      // 2. Cleanup Vercel Blob
      if (deletedShop.logo_url) {
        try {
          await del(deletedShop.logo_url);
          console.log("Vercel Blob asset purged.");
        } catch (blobError) {
          console.error(
            "Blob cleanup failed, but DB record was removed:",
            blobError,
          );
        }
      }

      return reply.send({ message: "Shop and assets terminated successfully" });
    } catch (error) {
      console.error("CRITICAL ERROR DURING DELETE:", error);
      return reply.code(500).send({ error: "Internal Server Error" });
    }
  },

  // 4. Update Shop (Name & Description only for now)
  // Add to shopController
  async updateShop(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const { name, description } = request.body as {
        name: string;
        description: string;
      };
      const userId = (request as any).user.id;
      if (!name || !description) {
        return reply
          .code(400)
          .send({ error: "Name and description are required." });
      }
      const updatedShop = await shopModel.updateShop(
        userId,
        id,
        name,
        description,
      );
      if (!updatedShop) {
        return reply
          .code(404)
          .send({ error: "Shop not found or unauthorized" });
      }
      return reply.send(updatedShop);
    } catch (error) {
      return reply.code(500).send({ error: "Update failed" });
    }
  },
};
