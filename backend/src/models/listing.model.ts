import { pool } from "../db/db";

export const listingModel = {
  // CREATE
  async createListing(data: any) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const listingResult = await client.query(
        `INSERT INTO listings (shop_id, seller_id, category_id, title, description, price)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *, FALSE::boolean as is_favorited`, // New listings are never favorited yet
        [
          data.shop_id,
          data.seller_id,
          data.category_id,
          data.title,
          data.description,
          data.price,
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

  // GET: Fetch shop listings with favorite check
  async getShopListings(shopId: string | number, userId?: string | null) {
    const result = await pool.query(
      `SELECT 
        l.*, 
        c.name as category_name,
        -- Use EXISTS for a clean, consistent boolean check
        EXISTS (
          SELECT 1 FROM favorites f 
          WHERE f.listing_id = l.id 
          AND f.user_id = $2::uuid
        )::boolean as is_favorited,
        -- Aggregating images into a clean JSON array
        COALESCE(
          (SELECT json_agg(li.image_url) 
           FROM listing_images li 
           WHERE li.listing_id = l.id), 
          '[]'
        ) as images
     FROM listings l
     LEFT JOIN categories c ON l.category_id = c.id
     WHERE l.shop_id = $1
     GROUP BY l.id, c.name
     ORDER BY l.created_at DESC`,
      [shopId, userId || null],
    );
    return result.rows;
  },

  // GET: Single listing with favorite check
  async getListingById(id: string | number, userId?: string | null) {
    const result = await pool.query(
      `SELECT 
      l.*, 
      c.name as category_name,
      s.name as shop_name, 
      s.logo_url as shop_logo,
      s.description as shop_description,
      s.is_approved as shop_is_approved,
      -- Check if THIS specific user has favorited THIS specific listing
      EXISTS (
        SELECT 1 FROM favorites f 
        WHERE f.listing_id = l.id 
        AND f.user_id = $2::uuid
      )::boolean as is_favorited,
      -- Aggregate images into a single JSON array without duplicates
      COALESCE(
        (SELECT json_agg(li.image_url) 
         FROM listing_images li 
         WHERE li.listing_id = l.id), 
        '[]'
      ) as images
    FROM listings l
    JOIN shops s ON l.shop_id = s.id
    LEFT JOIN categories c ON l.category_id = c.id
    WHERE l.id = $1
    GROUP BY l.id, s.id, c.name`,
      [id, userId || null],
    );

    return result.rows[0];
  },

  // UPDATE
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
       RETURNING *, FALSE::boolean as is_favorited`,
      [
        title || null,
        description || null,
        price || null,
        location || null,
        status || null,
        category_id || null,
        id,
      ],
    );
    return result.rows[0];
  },

  // GET: Featured
  async getFeaturedListings(
    limit: number,
    offset: number,
    userId?: string | null,
  ) {
    const listings = await pool.query(
      `SELECT 
        l.id, l.title, l.price, c.name as category_name, l.created_at,
        s.id as shop_id, s.name as shop_name,
        (CASE WHEN $3::uuid IS NOT NULL AND f.user_id = $3::uuid THEN TRUE ELSE FALSE END)::boolean as is_favorited,
        (SELECT image_url FROM listing_images WHERE listing_id = l.id LIMIT 1) as image
      FROM listings l
      INNER JOIN shops s ON l.shop_id = s.id
      LEFT JOIN categories c ON l.category_id = c.id
      LEFT JOIN favorites f ON l.id = f.listing_id AND f.user_id = $3::uuid
      WHERE s.is_approved = true AND l.status = 'available'
      ORDER BY l.created_at DESC
      LIMIT $1 OFFSET $2;`,
      [limit, offset, userId || null],
    );

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM listings l JOIN shops s ON l.shop_id = s.id
       WHERE s.is_approved = true AND l.status = 'available';`,
    );

    return {
      data: listings.rows,
      total: parseInt(countResult.rows[0].count, 10),
    };
  },

  // SEARCH
  async searchListings(searchTerm: string, userId?: string | null) {
    const query = `
    SELECT 
      l.*, 
      s.id as shop_id, s.name as shop_name, s.logo_url as shop_logo, s.description as shop_description,
      (CASE WHEN $2::uuid IS NOT NULL AND f.user_id = $2::uuid THEN TRUE ELSE FALSE END)::boolean as is_favorited,
      (SELECT image_url FROM listing_images WHERE listing_id = l.id LIMIT 1) as image
    FROM listings l
    JOIN shops s ON l.shop_id = s.id
    LEFT JOIN favorites f ON l.id = f.listing_id AND f.user_id = $2::uuid
    WHERE (l.title ILIKE $1 OR l.description ILIKE $1)
      AND s.is_approved = true 
      AND l.status = 'available'
    ORDER BY l.created_at DESC`;

    const { rows } = await pool.query(query, [
      `%${searchTerm}%`,
      userId || null,
    ]);

    // 1. Extract and deduplicate Shops
    const shopsMap = new Map();
    rows.forEach((row) => {
      if (!shopsMap.has(row.shop_id)) {
        shopsMap.set(row.shop_id, {
          id: row.shop_id,
          name: row.shop_name,
          logo_url: row.shop_logo,
          description: row.shop_description,
        });
      }
    });

    // 2. Clean up Listing objects (remove redundant shop fields if preferred)
    const listings = rows.map(
      ({ shop_logo, shop_description, ...listing }) => listing,
    );

    return {
      listings,
      shops: Array.from(shopsMap.values()),
    };
  },

  // GET: User's own listings
  async getListingsByUser(userId: string) {
    const result = await pool.query(
      `SELECT l.*, s.name as shop_name, s.logo_url as shop_logo,
        (CASE WHEN f.user_id IS NOT NULL THEN TRUE ELSE FALSE END)::boolean as is_favorited,
        COALESCE(json_agg(li.image_url) FILTER (WHERE li.image_url IS NOT NULL), '[]') as images
      FROM listings l
      JOIN shops s ON l.shop_id = s.id
      LEFT JOIN listing_images li ON l.id = li.listing_id
      LEFT JOIN favorites f ON l.id = f.listing_id AND f.user_id = $1
      WHERE s.owner_id = $1
      GROUP BY l.id, s.id, f.user_id
      ORDER BY l.created_at DESC`,
      [userId],
    );
    return result.rows;
  },

  async deleteListing(id: number): Promise<boolean> {
    const result = await pool.query(
      "DELETE FROM listings WHERE id = $1 RETURNING id",
      [id],
    );
    return (result.rowCount ?? 0) > 0;
  },

  async getListingImages(listingId: number): Promise<string[]> {
    const result = await pool.query(
      "SELECT image_url FROM listing_images WHERE listing_id = $1",
      [listingId],
    );
    return result.rows.map((row) => row.image_url);
  },
};
