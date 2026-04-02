import { pool } from "../db/db";
export const favoritesModel = {
  async addFavorite(userId: string, listingId: string) {
    const query = `
      INSERT INTO favorites (user_id, listing_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, listing_id) DO NOTHING
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [userId, listingId]);
    return rows[0];
  },

  async removeFavorite(userId: string, listingId: string) {
    const query = `
      DELETE FROM favorites
      WHERE user_id = $1 AND listing_id = $2
    `;
    await pool.query(query, [userId, listingId]);
  },

  async isFavorited(userId: string, listingId: string) {
    const query = `
      SELECT 1 FROM favorites
      WHERE user_id = $1 AND listing_id = $2
    `;
    const { rows } = await pool.query(query, [userId, listingId]);
    return rows.length > 0;
  },

  async getUserFavorites(userId: string) {
    const query = `
    SELECT 
      l.*, 
      c.name as category_name,
      (
        SELECT image_url 
        FROM listing_images 
        WHERE listing_id = l.id 
        LIMIT 1
      ) as image,
      TRUE as is_favorited -- Since we are selecting FROM the favorites table
    FROM favorites f
    JOIN listings l ON l.id = f.listing_id
    JOIN categories c ON l.category_id = c.id
    WHERE f.user_id = $1
    ORDER BY f.created_at DESC
  `;

    try {
      const { rows } = await pool.query(query, [userId]);
      return rows;
    } catch (error) {
      console.error("Error fetching user favorites:", error);
      throw error;
    }
  },
};
