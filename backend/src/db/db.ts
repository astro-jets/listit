import { Pool, QueryResult, QueryResultRow } from "pg"; // <-- Import QueryResult
import dotenv from "dotenv";

dotenv.config();

// Initialize the PostgreSQL Pool once
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/**
 * A wrapper function to execute queries using the initialized pool.
 * It uses a generic type <T> for the row structure.
 * * The return type must be Promise<QueryResult<T>>.
 */
export async function sql<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
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
