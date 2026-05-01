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
  async getByShop(shopId: string | number) {
    const query = `
    SELECT 
      r.id, 
      u.username as "userName", 
      r.rating, 
      -- Calculate total average as a float across all matching rows
      -- We cast to numeric to ensure we don't lose decimal points
      AVG(r.rating::numeric) OVER() as "averageRating",
      r.comment, 
      TO_CHAR(r.created_at, 'DD MON YYYY') as date,
      COALESCE(l.title, 'General Shop Feedback') as "productName",
      CASE WHEN rr.id IS NOT NULL THEN true ELSE false END as replied,
      rr.reply_text as "replyText"
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    LEFT JOIN listings l ON r.listing_id = l.id
    LEFT JOIN review_replies rr ON r.id = rr.review_id
    WHERE 
      r.shop_id = $1 
      OR 
      l.shop_id = $1 
    ORDER BY r.created_at DESC
  `;

    const { rows } = await pool.query(query, [shopId]);

    // If there are no reviews, return an empty array or handle the null average
    if (rows.length === 0) return { reviews: [], average: 0 };

    // Since averageRating is the same on every row, we grab it from the first one
    // We parseFloat because pg-node often returns big numbers/decimals as strings
    const average = parseFloat(rows[0].averageRating || 0);

    return {
      reviews: rows,
      average: average,
    };
  },

  async delete(id: string, userId: string) {
    const { rowCount } = await pool.query(
      `DELETE FROM reviews WHERE id = $1 AND user_id = $2`,
      [id, userId],
    );
    return rowCount;
  },
};
