import { pool } from "../db/db";

export const AdminService = {
  // --- APPROVAL SYSTEM ---
  async getPendingShops() {
    const { rows } = await pool.query(
      `SELECT s.*, u.username as owner_name FROM shops s 
       JOIN users u ON s.owner_id = u.id 
       WHERE is_approved = false ORDER BY created_at ASC`,
    );
    return rows;
  },
  // admin.model.ts

  async getShopVerificationDetails(shopId: string) {
    const query = `
    SELECT 
      s.*, 
      u.username as owner_name, 
      u.email as owner_email, 
      u.phone_number as owner_phone,
      u.is_verified as owner_account_verified,
      u.created_at as owner_joined_at,
      (SELECT COUNT(*) FROM listings WHERE shop_id = s.id) as total_listings
    FROM shops s
    JOIN users u ON s.owner_id = u.id
    WHERE s.id = $1
  `;
    const { rows } = await pool.query(query, [shopId]);
    return rows[0] || null;
  },
  async getAllListings() {
    const query = `
    SELECT 
      l.id, 
      l.title, 
      l.description, 
      l.price, 
      l.is_approved, 
      l.created_at,
      l.status,
      s.name as shop_name,
      u.username as owner_name,
      -- Grabs the first image found for this listing
      (SELECT image_url FROM listing_images WHERE listing_id = l.id LIMIT 1) as primary_image,
      -- Or grab ALL images as an array if you prefer
      COALESCE(
        (SELECT json_agg(image_url) FROM listing_images WHERE listing_id = l.id), 
        '[]'
      ) as images
    FROM listings l
    JOIN shops s ON l.shop_id = s.id
    JOIN users u ON s.owner_id = u.id
    ORDER BY l.created_at DESC
  `;

    const { rows } = await pool.query(query);
    return rows;
  },

  async approveShop(shopId: string) {
    const { rows } = await pool.query(
      "UPDATE shops SET is_approved = true WHERE id = $1 RETURNING *",
      [shopId],
    );
    return rows[0];
  },

  async approveListing(listingId: number) {
    const { rows } = await pool.query(
      "UPDATE listings SET is_approved = true WHERE id = $1 RETURNING *",
      [listingId],
    );
    return rows[0];
  },

  // --- USER MANAGEMENT ---
  async getAllUsers() {
    const { rows } = await pool.query(
      `SELECT u.id, u.username, u.email, r.name as role, u.created_at 
       FROM users u JOIN roles r ON u.role_id = r.id`,
    );
    return rows;
  },

  // --- ANALYTICS (Overview) ---
  async getStats() {
    const query = `
      SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM shops WHERE is_approved = true) as active_shops,
        (SELECT COUNT(*) FROM listings WHERE status = 'available') as active_listings,
        (SELECT COUNT(*) FROM reviews) as total_reviews
    `;
    const { rows } = await pool.query(query);
    return rows[0];
  },
  async getAllReviews() {
    const query = `
      SELECT 
        r.id, 
        r.rating, 
        r.comment, 
        r.created_at,
        u.username as author_name,
        l.title as listing_title,
        s.name as shop_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      JOIN listings l ON r.listing_id = l.id
      JOIN shops s ON l.shop_id = s.id
      ORDER BY r.created_at DESC
    `;
    const { rows } = await pool.query(query);
    return rows;
  },

  async deleteReview(id: number) {
    await pool.query("DELETE FROM reviews WHERE id = $1", [id]);
    return { success: true };
  },

  async updateReviewComment(id: number, newComment: string) {
    const { rows } = await pool.query(
      "UPDATE reviews SET comment = $1 WHERE id = $2 RETURNING *",
      [newComment, id],
    );
    return rows[0];
  },
  // backend/services/admin.service.ts
  async getGrowthMetrics() {
    const query = `
    WITH monthly_buckets AS (
      SELECT date_trunc('month', series_date) as month_date
      FROM generate_series(
        now() - interval '5 months', 
        now(), 
        interval '1 month'
      ) AS series_date
    )
    SELECT 
      to_char(mb.month_date, 'Mon') as name,
      (SELECT COUNT(*) FROM users WHERE date_trunc('month', created_at) = mb.month_date) as users,
      (SELECT COUNT(*) FROM shops WHERE date_trunc('month', created_at) = mb.month_date) as shops
    FROM monthly_buckets mb
    ORDER BY mb.month_date ASC;
  `;
    const { rows } = await pool.query(query);
    return rows;
  },
};
