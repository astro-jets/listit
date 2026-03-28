import { Pool } from "pg";
import { pool } from "../db/db";

export const listingModel = {
  // CREATE: Handles the listing and its multiple images
  async createListing(data: any) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Matching your schema: shop_id, title, description, price, location, status
      const listingResult = await client.query(
        `INSERT INTO listings (shop_id, title, description, price, location)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [
          data.shop_id,
          data.title,
          data.description,
          data.price,
          data.location || null,
        ],
      );

      const listing = listingResult.rows[0];

      // Handle images for the listing_images table
      if (data.images && data.images.length > 0) {
        for (const url of data.images) {
          await client.query(
            `INSERT INTO listing_images (listing_id, image_url) VALUES ($1, $2)`,
            [listing.id, url],
          );
        }
      }

      await client.query("COMMIT");
      return listing;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  },

  async getShopListings(shopId: string) {
    const result = await pool.query(
      `SELECT l.*, 
       COALESCE(json_agg(li.image_url) FILTER (WHERE li.image_url IS NOT NULL), '[]') as images
       FROM listings l
       LEFT JOIN listing_images li ON l.id = li.listing_id
       WHERE l.shop_id = $1
       GROUP BY l.id`,
      [shopId],
    );
    return result.rows;
  },

  async getListingsByUser(userId: string) {
    const result = await pool.query(
      `
      SELECT 
        l.*, 
        s.name as shop_name, 
        s.logo_url as shop_logo,
        COALESCE(json_agg(li.image_url) FILTER (WHERE li.image_url IS NOT NULL), '[]') as images
      FROM listings l
      JOIN shops s ON l.shop_id = s.id
      LEFT JOIN listing_images li ON l.id = li.listing_id
      WHERE s.owner_id = $1
      GROUP BY l.id, s.id
      ORDER BY l.created_at DESC
      `,
      [userId],
    );
    return result.rows;
  },

  // 2. GET SINGLE LISTING BY ID
  // Includes full shop details for the product page
  async getListingById(id: string) {
    const result = await pool.query(
      `
      SELECT 
        l.*, 
        s.name as shop_name, 
        s.logo_url as shop_logo,
        s.description as shop_description,
        COALESCE(json_agg(li.image_url) FILTER (WHERE li.image_url IS NOT NULL), '[]') as images
      FROM listings l
      JOIN shops s ON l.shop_id = s.id
      LEFT JOIN listing_images li ON l.id = li.listing_id
      WHERE l.id = $1
      GROUP BY l.id, s.id
      `,
      [id],
    );
    return result.rows[0];
  },
  // Helper to get images before deletion
  async getListingImages(listingId: number): Promise<string[]> {
    const result = await pool.query(
      "SELECT image_url FROM listing_images WHERE listing_id = $1",
      [listingId],
    );
    return result.rows.map((row) => row.image_url);
  },

  // Update logic matching your exact columns
  async updateListing(id: number, data: any) {
    const { title, description, price, location, status } = data;

    const result = await pool.query(
      `UPDATE listings 
       SET title = COALESCE($1, title), 
           description = COALESCE($2, description), 
           price = COALESCE($3, price), 
           location = COALESCE($4, location),
           status = COALESCE($5, status),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $6 
       RETURNING *`,
      [
        title || null,
        description || null,
        price || null,
        location ? JSON.stringify(location) : null,
        status || null,
        id,
      ],
    );
    return result.rows[0];
  },

  // Delete logic
  async deleteListing(id: number): Promise<boolean> {
    const result = await pool.query(
      "DELETE FROM listings WHERE id = $1 RETURNING id",
      [id],
    );
    return (result.rowCount ?? 0) > 0;
  },

  async getFeaturedListings(limit: number, offset: number) {
    // 1. Fetch the listings with shop details and the first image
    const listings = await pool.query(
      `SELECT 
      l.id,
      l.title,
      l.price,
      l.location,
      l.category,
      l.created_at,
      s.name as shop_name,
      (
        SELECT image_url 
        FROM listing_images 
        WHERE listing_id = l.id 
        LIMIT 1
      ) as image
    FROM listings l
    INNER JOIN shops s ON l.shop_id = s.id
    WHERE l.is_approved = true
      AND l.status = 'available'
    ORDER BY l.created_at DESC
    LIMIT $1 OFFSET $2;
    `,
      [limit, offset],
    );

    // 2. Count total matches using the exact same filters
    const countResult = await pool.query(
      `SELECT COUNT(*) 
     FROM listings l
     INNER JOIN shops s ON l.shop_id = s.id
     WHERE l.is_approved = true
       AND l.status = 'available';
    `,
    );

    return {
      data: listings.rows,
      total: parseInt(countResult.rows[0].count, 10),
    };
  },

  async searchListings(searchTerm: string) {
    const query = `
      SELECT 
        l.*, 
        s.name as shop_name,
        (SELECT image_url FROM listing_images WHERE listing_id = l.id LIMIT 1) as main_image
      FROM listings l
      JOIN shops s ON l.shop_id = s.id
      WHERE 
        (l.title ILIKE $1 OR l.description ILIKE $1 OR l.category ILIKE $1)
        AND l.is_approved = true
        AND l.status = 'available'
      ORDER BY l.created_at DESC
    `;

    // The % symbols allow for partial matching (e.g., "sword" finds "Iron Sword")
    const values = [`%${searchTerm}%`];
    const { rows } = await pool.query(query, values);
    return rows;
  },
};
