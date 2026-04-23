import { FastifyRequest, FastifyReply } from "fastify";
import { AdminService } from "../models/admin.model";

export const AdminController = {
  async getDashboardStats(req: FastifyRequest, reply: FastifyReply) {
    const stats = await AdminService.getStats();
    return reply.send(stats);
  },
  async getShopDetailsForAdmin(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    try {
      const details = await AdminService.getShopVerificationDetails(id);
      if (!details) {
        return reply.code(404).send({ error: "Shop not found" });
      }
      return reply.send(details);
    } catch (error) {
      return reply
        .code(500)
        .send({ error: "Failed to fetch verification details" });
    }
  },
  async handleApproveShop(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const shop = await AdminService.approveShop(id);
    if (!shop) return reply.code(404).send({ error: "Shop not found" });
    return reply.send({ message: "Shop approved and live", shop });
  },

  async handleApproveListing(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const listing = await AdminService.approveListing(Number(id));
    if (!listing) return reply.code(404).send({ error: "Listing not found" });
    return reply.send({ message: "Listing approved", listing });
  },

  async getAllListings(req: FastifyRequest, reply: FastifyReply) {
    const listings = await AdminService.getAllListings();
    return reply.send(listings);
  },

  async listPendingContent(req: FastifyRequest, reply: FastifyReply) {
    const shops = await AdminService.getPendingShops();
    // You could also add getPendingListings here
    return reply.send(shops);
  },

  async getAllUsers(req: FastifyRequest, reply: FastifyReply) {
    const users = await AdminService.getAllUsers();
    return reply.send(users);
  },
  async getAllReviews(req: FastifyRequest, reply: FastifyReply) {
    const reviews = await AdminService.getAllReviews();
    return { data: reviews };
  },

  async handleUpdateReview(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const { comment } = req.body as { comment: string }; // Ensure your schema validates this
    const updated = await AdminService.updateReviewComment(Number(id), comment);
    return updated;
  },

  async handleDeleteReview(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    await AdminService.deleteReview(Number(id));
    return reply.status(204).send(); // 204 No Content is standard for DELETE
  },

  async getGrowthMetrics(req: FastifyRequest, reply: FastifyReply) {
    try {
      const metrics = await AdminService.getGrowthMetrics();

      // If no data exists for the period, return an empty array to prevent frontend crashes
      return {
        success: true,
        data: metrics || [],
      };
    } catch (error) {
      req.log.error(error);
      return reply.status(500).send({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch growth metrics",
      });
    }
  },
};
