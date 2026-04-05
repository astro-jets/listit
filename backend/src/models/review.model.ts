import { pool } from "../db/db";

export interface ReviewInput {
  listing_id?: number;
  shop_id?: number;
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
  async createShopReview(data: ReviewInput) {
    const { rows } = await pool.query(
      `INSERT INTO reviews (shop_id, user_id, rating, comment) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [data.shop_id, data.user_id, data.rating, data.comment],
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
  async getByShop(shopId: string) {
    const query = `
    SELECT 
      r.id, 
      u.username as "userName", 
      r.rating, 
      r.comment, 
      r.created_at as date,
      -- If it's a listing review, show the title. If shop review, show "General Feedback"
      COALESCE(l.title, 'General Shop Feedback') as "productName",
      COALESCE(CASE WHEN rr.id IS NOT NULL THEN true ELSE false END, false) as replied,
      rr.reply_text as "replyText"
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    LEFT JOIN listings l ON r.listing_id = l.id
    LEFT JOIN review_replies rr ON r.id = rr.review_id
    WHERE 
      r.shop_id = $1 -- Direct shop reviews
      OR 
      l.shop_id = $1 -- Reviews on listings belonging to this shop
    ORDER BY r.created_at DESC
  `;

    const { rows } = await pool.query(query, [shopId]);
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
