import { FastifyInstance } from "fastify";
import { AdminController } from "../controllers/admin.controller";
import { authenticate } from "../hooks/auth.hooks";

export async function adminRoutes(fastify: FastifyInstance) {
  // Global Admin Protection
  fastify.addHook("preHandler", authenticate);

  // --- ANALYTICS & USERS ---
  fastify.get("/stats", AdminController.getDashboardStats);
  fastify.get("/users/all", AdminController.getAllUsers);

  // --- CONTENT MODERATION (Shops & Listings) ---
  fastify.get("/pending", AdminController.listPendingContent);
  fastify.get("/listings", AdminController.getAllListings);
  fastify.patch("/approve-shop/:id", AdminController.handleApproveShop);
  fastify.patch("/approve-listing/:id", AdminController.handleApproveListing);

  // --- REVIEW MANAGEMENT (New Routes) ---
  /**
   * GET /admin/reviews
   * Returns all reviews with joined Author and Listing data
   */
  fastify.get("/reviews", AdminController.getAllReviews);

  /**
   * PATCH /admin/reviews/:id
   * Allows moderators to edit comment text (moderation)
   */
  fastify.patch("/reviews/:id", AdminController.handleUpdateReview);

  /**
   * DELETE /admin/reviews/:id
   * Permanently removes a review from the database
   */
  fastify.delete("/reviews/:id", AdminController.handleDeleteReview);

  fastify.get("/metrics", AdminController.getGrowthMetrics);
}
