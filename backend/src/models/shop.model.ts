import { pool, sql } from "../db/db"; // Use your existing sql helper

export const shopModel = {
  async createShop(data: any) {
    const query = `
      INSERT INTO shops (name, description, location, logo_url, owner_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const values = [
      data.name,
      data.bio, // Maps to 'description' column
      data.location, // Stored as JSONB
      data.logo_url,
      data.owner_id,
    ];

    const { rows } = await sql(query, values);
    return rows[0];
  },

  //Find shop by owner
  async getShopByOwner(ownerId: string) {
    const { rows } = await sql(
      `SELECT * FROM shops WHERE owner_id = $1 LIMIT 1`,
      [ownerId],
    );
    return rows[0] || null;
  },

  async deleteShop(shopId: number, ownerId: string) {
    const query = `
      DELETE FROM shops 
      WHERE id = $1 AND owner_id = $2 
      RETURNING logo_url;
    `;

    const result = await pool.query(query, [shopId, ownerId]);
    return result.rows[0] || null;
  },

  async updateShop(
    userId: string,
    shopId: string,
    name: string,
    description: string,
  ) {
    const query = `
            UPDATE shops 
            SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP
            WHERE id = $3 AND owner_id = $4
            RETURNING *
        `;

    const { rows } = await sql(query, [name, description, shopId, userId]);

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  },
};
