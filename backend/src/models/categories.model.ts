// src/services/category.service.ts
import { pool } from "../db/db";

export const CategoryService = {
  async getAll() {
    const { rows } = await pool.query(
      `SELECT * FROM categories ORDER BY name ASC`,
    );
    return rows;
  },

  async getById(id: number) {
    const { rows } = await pool.query(
      `SELECT * FROM categories WHERE id = $1`,
      [id],
    );
    return rows[0];
  },

  async create(name: string, slug: string) {
    const { rows } = await pool.query(
      `INSERT INTO categories (name, slug) VALUES ($1, $2) RETURNING *`,
      [name, slug],
    );
    return rows[0];
  },

  async delete(id: number) {
    const { rowCount } = await pool.query(
      `DELETE FROM categories WHERE id = $1`,
      [id],
    );
    return rowCount;
  },
};
