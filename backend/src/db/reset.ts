import { Pool } from "pg";

export async function resetDb(pool: Pool) {
  try {
    // Dropping tables in an order that respects foreign key dependencies,
    // though CASCADE handles this automatically.
    await pool.query(`
      DROP TABLE IF EXISTS 
        review_replies,
        reviews, 
        listing_images, 
        favorites, 
        listings, 
        categories, 
        shops, 
        users, 
        roles 
      CASCADE;
    `);
    console.log("-----------------------------------------");
    console.log("🧨 Database wiped: All tables dropped.");
    console.log("-----------------------------------------");
  } catch (error) {
    console.error("❌ Reset failed:", error);
    throw error;
  }
}
