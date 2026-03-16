import { pool } from "../db/db";

export const listingModel = {
  async createListing(data: any) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const listingResult = await client.query(
        `
      INSERT INTO listings
      (title, description, price, category, location, seller_id)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *
      `,
        [
          data.title,
          data.description,
          data.price,
          data.category,
          data.location,
          data.seller_id,
        ],
      );

      const listing = listingResult.rows[0];

      for (const url of data.images) {
        await client.query(
          `
        INSERT INTO listing_images (listing_id, image_url)
        VALUES ($1,$2)
        `,
          [listing.id, url],
        );
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

  async getListings(limit: number, offset: number) {
    const result = await pool.query(
      `SELECT 
        listings.*,
        shops.name AS shop_name,
        json_agg(listing_images.image_url) AS images
      FROM listings
      JOIN shops ON listings.shop_id = shops.id
      LEFT JOIN listing_images
      ON listings.id = listing_images.listing_id
      GROUP BY listings.id, shops.name
      ORDER BY listings.created_at DESC
      LIMIT $1 OFFSET $2`,
      [limit, offset],
    );

    return result.rows;
  },

  async getListingById(id: string) {
    const result = await pool.query(
      `SELECT 
        listings.*,
        shops.name AS shop_name,
        json_agg(listing_images.image_url) AS images
      FROM listings
      JOIN shops ON listings.shop_id = shops.id
      LEFT JOIN listing_images
      ON listings.id = listing_images.listing_id
      WHERE listings.id = $1
      GROUP BY listings.id, shops.name`,
      [id],
    );

    return result.rows[0];
  },

  async updateListing(id: string, data: any) {
    const { title, description, price, location } = data;

    const result = await pool.query(
      `UPDATE listings
       SET title=$1, description=$2, price=$3, location=$4
       WHERE id=$5
       RETURNING *`,
      [title, description, price, location, id],
    );

    return result.rows[0];
  },

  async deleteListing(id: string) {
    await pool.query(`DELETE FROM listings WHERE id=$1`, [id]);

    return { success: true };
  },

  async addListingImage(listing_id: string, image_url: string) {
    const result = await pool.query(
      `INSERT INTO listing_images (listing_id, image_url)
       VALUES ($1,$2)
       RETURNING *`,
      [listing_id, image_url],
    );

    return result.rows[0];
  },

  async deleteImage(image_id: string) {
    await pool.query(`DELETE FROM listing_images WHERE id=$1`, [image_id]);

    return { success: true };
  },

  async searchListings(search: string) {
    const result = await pool.query(
      `SELECT * FROM listings
       WHERE title ILIKE $1`,
      [`%${search}%`],
    );

    return result.rows;
  },

  async getListingsByShop(shop_id: string) {
    const result = await pool.query(
      `SELECT * FROM listings
       WHERE shop_id=$1
       ORDER BY created_at DESC`,
      [shop_id],
    );

    return result.rows;
  },
};
