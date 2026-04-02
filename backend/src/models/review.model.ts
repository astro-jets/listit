import { pool } from "../db/db";

export interface ReviewInput {
  listing_id: number;
  user_id: string;
  rating: number;
  comment: string;
}

export const ReviewService = {
  async create(data: ReviewInput) {
    const { rows } = await pool.query(
      `INSERT INTO reviews (listing_id, user_id, rating, comment) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [data.listing_id, data.user_id, data.rating, data.comment],
    );
    return rows[0];
  },

  async getByListing(listingId: string) {
    const { rows } = await pool.query(
      `SELECT r.*, u.username, u.avatar_url 
       FROM reviews r 
       JOIN users u ON r.user_id = u.id 
       WHERE r.listing_id = $1 
       ORDER BY r.created_at DESC`,
      [listingId],
    );
    return rows;
  },

  async delete(id: string, userId: string) {
    const { rowCount } = await pool.query(
      `DELETE FROM reviews WHERE id = $1 AND user_id = $2`,
      [id, userId],
    );
    return rowCount;
  },
};
