import { pool, sql } from "../db/db"; // Use your existing sql helper

export const shopModel = {
  async createShop(data: any) {
    const query = `
    INSERT INTO shops (
      name, 
      description, 
      location, 
      address_text, 
      logo_url, 
      banner_url, 
      owner_id
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `;

    const values = [
      data.name,
      data.bio, // Maps to 'description' column
      data.location, // Stored as JSONB
      data.address_text,
      data.logo_url,
      data.banner_url,
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

  async getShopById(shopId: number) {
    const query = `
    SELECT 
      s.*, 
      u.username as owner_name, 
      u.email as owner_email, 
      u.phone_number as owner_phone
    FROM shops s
    JOIN users u ON s.owner_id = u.id
    WHERE s.id = $1 
    LIMIT 1
  `;

    const { rows } = await sql(query, [shopId]);
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
  async getFeaturedShops() {
    const query = `SELECT * FROM shops WHERE is_approved = true ORDER BY created_at DESC LIMIT 10`;
    const { rows } = await sql(query);
    return rows;
  },
};
