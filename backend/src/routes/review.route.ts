import { FastifyInstance } from "fastify";
import { ReviewController } from "../controllers/review.controller";
import { authenticate } from "../hooks/auth.hooks";

export default async function reviewRoutes(fastify: FastifyInstance) {
  // Public: Anyone can see reviews
  fastify.get("/listing/:id", ReviewController.getListingReviews);

  // Private: Must be logged in to post
  fastify.post(
    "/",
    { preHandler: authenticate },
    ReviewController.createReview,
  );

  // Private: Must be logged in to delete their own review
  fastify.delete(
    "/:id",
    { preHandler: authenticate },
    ReviewController.deleteReview,
  );
}
