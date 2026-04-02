import { Pool } from "pg";

export async function resetDb(pool: Pool) {
  try {
    await pool.query(`
      DROP TABLE IF EXISTS audit_logs, reports, messages, reviews, 
      listing_images, favorites, listings, categories, shops, users, roles CASCADE;
    `);
    console.log("-----------------------------------------");
    console.log("🧨 Database wiped: All tables dropped.");
    console.log("-----------------------------------------");
  } catch (error) {
    console.error("❌ Reset failed:", error);
    throw error;
  }
}
