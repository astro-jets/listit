import { FastifyReply, FastifyRequest } from "fastify";
import { ReviewService } from "../models/review.model";

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
};
