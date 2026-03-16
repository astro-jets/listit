import { pool } from "../db/db";

export const shopModel = {
  async createShop(data: any) {
    const query = `
      INSERT INTO shops (name, bio, location, logo_url, seller_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const values = [
      data.name,
      data.bio,
      data.location,
      data.logo_url,
      data.seller_id,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },
};
