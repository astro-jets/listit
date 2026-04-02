import { pool } from "../db/db";

export const listingModel = {
  // CREATE: Now includes category_id and handles images in a transaction
  async createListing(data: any) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const listingResult = await client.query(
        `INSERT INTO listings (shop_id, seller_id, category_id, title, description, price, location)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [
          data.shop_id,
          data.seller_id,
          data.category_id, // New: Foreign Key to categories table
          data.title,
          data.description,
          data.price,
          data.location || null, // String location
        ],
      );

      const listing = listingResult.rows[0];

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

  async getShopListings(shopId: string | number) {
    const result = await pool.query(
      `SELECT l.*, c.name as category_name,
       COALESCE(json_agg(li.image_url) FILTER (WHERE li.image_url IS NOT NULL), '[]') as images
       FROM listings l
       LEFT JOIN categories c ON l.category_id = c.id
       LEFT JOIN listing_images li ON l.id = li.listing_id
       WHERE l.shop_id = $1
       GROUP BY l.id, c.name`,
      [shopId],
    );
    return result.rows;
  },

  async getListingById(id: string | number) {
    const result = await pool.query(
      `
      SELECT 
        l.*, 
        c.name as category_name,
        s.name as shop_name, 
        s.logo_url as shop_logo,
        s.description as shop_description,
        COALESCE(json_agg(li.image_url) FILTER (WHERE li.image_url IS NOT NULL), '[]') as images
      FROM listings l
      JOIN shops s ON l.shop_id = s.id
      LEFT JOIN categories c ON l.category_id = c.id
      LEFT JOIN listing_images li ON l.id = li.listing_id
      WHERE l.id = $1
      GROUP BY l.id, s.id, c.name
      `,
      [id],
    );
    return result.rows[0];
  },

  async updateListing(id: number, data: any) {
    const { title, description, price, location, status, category_id } = data;

    const result = await pool.query(
      `UPDATE listings 
       SET title = COALESCE($1, title), 
           description = COALESCE($2, description), 
           price = COALESCE($3, price), 
           location = COALESCE($4, location),
           status = COALESCE($5, status),
           category_id = COALESCE($6, category_id),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 
       RETURNING *`,
      [
        title || null,
        description || null,
        price || null,
        location || null, // Treated as string for listings
        status || null,
        category_id || null,
        id,
      ],
    );
    return result.rows[0];
  },

  async getFeaturedListings(limit: number, offset: number, userId?: string) {
    const listings = await pool.query(
      `SELECT 
        l.id,
        l.title,
        l.price,
        l.location,
        c.name as category_name,
        l.created_at,
        s.id as shop_id,
        s.name as shop_name,
        (CASE WHEN f.user_id IS NOT NULL THEN TRUE ELSE FALSE END) as is_favorited,
        (
          SELECT image_url 
          FROM listing_images 
          WHERE listing_id = l.id 
          LIMIT 1
        ) as image
      FROM listings l
      INNER JOIN shops s ON l.shop_id = s.id
      LEFT JOIN categories c ON l.category_id = c.id
      LEFT JOIN favorites f ON l.id = f.listing_id AND f.user_id = $3
      WHERE l.is_approved = true
        AND l.status = 'available'
      ORDER BY l.created_at DESC
      LIMIT $1 OFFSET $2;
    `,
      [limit, offset, userId || null],
    );

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM listings WHERE is_approved = true AND status = 'available';`,
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
        c.name as category_name,
        (SELECT image_url FROM listing_images WHERE listing_id = l.id LIMIT 1) as image
      FROM listings l
      JOIN shops s ON l.shop_id = s.id
      LEFT JOIN categories c ON l.category_id = c.id
      WHERE 
        (l.title ILIKE $1 OR l.description ILIKE $1 OR c.name ILIKE $1)
        AND l.is_approved = true
        AND l.status = 'available'
      ORDER BY l.created_at DESC
    `;

    const values = [`%${searchTerm}%`];
    const { rows } = await pool.query(query, values);
    return rows;
  },

  async deleteListing(id: number): Promise<boolean> {
    const result = await pool.query(
      "DELETE FROM listings WHERE id = $1 RETURNING id",
      [id],
    );
    return (result.rowCount ?? 0) > 0;
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

  // Helper to get images before deletion
  async getListingImages(listingId: number): Promise<string[]> {
    const result = await pool.query(
      "SELECT image_url FROM listing_images WHERE listing_id = $1",
      [listingId],
    );
    return result.rows.map((row) => row.image_url);
  },
};
