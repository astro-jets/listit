import { sql } from "../db/db";
import { User, UserRole } from "../types/user";

/**
 * Creates a new user in the database.
 */
export async function createUser(
  email: string,
  password: string,
  username: string,
  role: UserRole
): Promise<User> {
  const { rows } = await sql<User>(
    // Note: We use username for artist_name on creation, which the user can change later.
    `INSERT INTO users (email, password, username, role, artist_name)
     VALUES ($1, $2, $3, $4, $5) 
     RETURNING id, email, username, role, artist_name`,
    [email, password, username, role, username] // <-- PASSING USERNAME TWICE ($3, $5)
  );
  return rows[0];
}

/**
 * Finds a user by email, including their hashed password.
 */
export async function findUserByEmail(email: string): Promise<User | null> {
  const { rows } = await sql(
    `SELECT id, username, email, password, role FROM users WHERE email = $1`,
    [email]
  );
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Checks if a user with the given email already exists.
 */
export async function userExists(email: string): Promise<boolean> {
  const { rowCount } = await sql(`SELECT id FROM users WHERE email = $1`, [
    email,
  ]);
  return rowCount! > 0;
}
