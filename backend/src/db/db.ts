import { Pool, QueryResult, QueryResultRow } from "pg"; // <-- Import QueryResult
import dotenv from "dotenv";

dotenv.config();

// Render sets NODE_ENV to "production" by default
const isProduction = process.env.NODE_ENV === "production";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction
    ? { rejectUnauthorized: false } // Required for Render's self-signed certs
    : false,
});

export async function sql<T extends QueryResultRow = any>(
  text: string,
  params?: any[],
): Promise<QueryResult<T>> {
  // <-- CORRECT RETURN TYPE HERE
  try {
    const result = await pool.query<T>(text, params); // Use pool.query<T> to type the rows
    return result;
  } catch (error) {
    console.error("Database Query Error:", error);
    throw error;
  }
}
