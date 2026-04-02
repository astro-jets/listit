import client from "~/api/client";
const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const ReviewApiService = {
  /**
   * Fetch all reviews for a specific listing
   */
  async getReviews(listingId: string | number) {
    const res = await client.get(`/reviews/listing/${listingId}`);
    return res.data;
  },

  /**
   * Submit a new review
   */
  async postReview(data: {
    listing_id: number;
    rating: number;
    comment: string;
  }) {
    const res = await client.post(`/reviews`, data, getAuthHeader());
    return res.data;
  },

  /**
   * Delete a review
   */
  async deleteReview(reviewId: string) {
    const res = await client.delete(`/reviews/${reviewId}`, getAuthHeader());
    return res.data;
  },
};
