import { sql } from "../db/db";

interface ArtistSearchResult {
  id: string;
  username: string;
}

/**
 * Searches for artists by username
 */
export async function searchArtistsByName(
  query: string
): Promise<ArtistSearchResult[]> {
  const result = await sql<ArtistSearchResult>(
    `
    SELECT id, username 
    FROM users 
    WHERE role = 'artist' 
      AND username ILIKE $1 
    LIMIT 10
    `,
    [`%${query}%`]
  );

  return result.rows;
}
