import { sql } from "../db/db";
import { User, UserRole } from "../types/user";

/**
 * Creates a new user in the database including the Vercel Blob avatar URL and phone number.
 */
export async function createUser(
  email: string,
  password: string,
  username: string,
  role: UserRole,
  bio: string,
  avatar_url: string,
  phone_number: string, // Added phone_number argument
): Promise<User> {
  const { rows } = await sql<User>(
    `INSERT INTO users (email, password, username, role_id, bio, avatar_url, phone_number)
     VALUES ($1, $2, $3, $4, $5, $6, $7) 
     RETURNING id, email, username, role_id as role, avatar_url, bio, phone_number`,
    [email, password, username, role, bio, avatar_url, phone_number],
  );
  return rows[0];
}

/**
 * Finds a user by email, including their hashed password and phone number.
 */
export async function findUserByEmail(email: string): Promise<User | null> {
  const { rows } = await sql(
    `SELECT id, username, email, password, role_id as role, avatar_url, bio, phone_number 
     FROM users 
     WHERE email = $1`,
    [email],
  );
  return rows.length > 0 ? (rows[0] as User) : null;
}

/**
 * Checks if a user with the given email already exists.
 */
export async function userExists(email: string): Promise<boolean> {
  const { rowCount } = await sql(`SELECT id FROM users WHERE email = $1`, [
    email,
  ]);
  return (rowCount ?? 0) > 0;
}
