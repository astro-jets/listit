import { FastifyReply, FastifyRequest } from "fastify";
import { ReviewService } from "../models/review.model";
import { pool } from "../db/db";

export const ReviewController = {
  async createReview(req: FastifyRequest, reply: FastifyReply) {
    const { listing_id, rating, comment } = req.body as any;
    const user_id = (req as any).user.id; // Extract from JWT/Session

    try {
      const review = await ReviewService.create({
        listing_id,
        user_id,
        rating,
        comment,
      });
      return reply.code(201).send(review);
    } catch (error) {
      return reply
        .code(400)
        .send({ error: "Could not post review. Ensure rating is 1-5." });
    }
  },

  async createShopReview(req: FastifyRequest, reply: FastifyReply) {
    const { shop_id, rating, comment } = req.body as any;
    const user_id = (req as any).user.id; // Extract from JWT/Session

    try {
      const review = await ReviewService.createShopReview({
        shop_id,
        user_id,
        rating,
        comment,
      });
      return reply.code(201).send(review);
    } catch (error) {
      return reply.code(400).send(error);
    }
  },

  async getListingReviews(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const reviews = await ReviewService.getByListing(req.params.id);
    return reply.send(reviews);
  },
  async deleteReview(req: FastifyRequest, reply: FastifyReply) {
    const userId = (req as any).user.id;
    const { id } = req.params as { id: string };

    const deletedCount = await ReviewService.delete(id, userId);
    if (deletedCount) {
      return reply.send({ success: true });
    } else {
      return reply
        .code(403)
        .send({ error: "Not authorized to delete this review." });
    }
  },
  async getShopReviews(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string };
      const reviews = await ReviewService.getByShop(id);
      return reply.send(reviews);
    } catch (error) {
      return reply.code(500).send({ error: "Could not fetch shop" });
    }
  },

  // Post a reply to a review
  async replyToReview(req: FastifyRequest, reply: FastifyReply) {
    const { reviewId, replyText } = req.body as {
      reviewId: string;
      replyText: string;
    };
    const userId = req.user.id;

    // Verify the user owns the shop the review belongs to
    const checkQuery = `
      SELECT r.shop_id FROM reviews r 
      JOIN shops s ON r.shop_id = s.id 
      WHERE r.id = $1 AND s.owner_id = $2
    `;
    const { rows } = await pool.query(checkQuery, [reviewId, userId]);

    if (rows.length === 0)
      return reply.status(403).send({ error: "UNAUTHORIZED" });

    await pool.query(
      `INSERT INTO review_replies (review_id, shop_id, reply_text) VALUES ($1, $2, $3)`,
      [reviewId, rows[0].shop_id, replyText],
    );

    return { success: true };
  },
};
