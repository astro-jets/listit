// src/models/releases.model.ts

import { sql } from "../db/db"; // Assuming database connection is exported as 'sql'
import { ReleaseFormData, TrackFormData } from "../validators/release.schema";

// Interfaces for return types
interface ReleaseResult {
  id: string;
  title: string;
}

interface TrackResult {
  id: string;
}

/**
 * Inserts the core release metadata into the database.
 * @returns The ID and title of the newly created release.
 */
export async function insertRelease(
  data: Partial<ReleaseFormData>,
  coverUrl: string,
  primaryArtistId: string
): Promise<ReleaseResult> {
  const result = await sql<ReleaseResult>(
    `
        INSERT INTO releases 
        (title, release_type, release_date, cover_url, primary_artist_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, title
        `,
    [data.title, data.releaseType, data.releaseDate, coverUrl, primaryArtistId]
  );

  return result.rows[0];
}

/**
 * Inserts a track and links it to a release and the main artist within a database transaction.
 * Rolls back if any part of the operation fails.
 * @returns The ID of the newly created track.
 */
export async function insertTrackAndLink(
  trackMetadata: Partial<TrackFormData> & { trackNumber: string },
  audioUrl: string,
  releaseId: string,
  artistId: string
): Promise<TrackResult> {
  // Start transaction to ensure atomicity
  await sql("BEGIN");

  try {
    // 1. Insert into tracks
    const trackResult = await sql<TrackResult>(
      `
            INSERT INTO tracks 
            (title, genre, isrc_code, audio_url, duration_ms)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id
            `,
      [
        trackMetadata.title,
        trackMetadata.genre,
        trackMetadata.isrc,
        audioUrl,
        Number(trackMetadata.duration) * 1000, // Convert seconds to milliseconds
      ]
    );
    const trackId = trackResult.rows[0].id;

    // 2. Insert into release_tracks (sets the track order)
    await sql(
      `
            INSERT INTO release_tracks
            (release_id, track_id, track_number)
            VALUES ($1, $2, $3)
            `,
      [releaseId, trackId, Number(trackMetadata.trackNumber)]
    );

    // 3. Insert into track_artists (Link main artist)
    await sql(
      `
            INSERT INTO track_artists
            (track_id, artist_id, role)
            VALUES ($1, $2, 'main')
            `,
      [trackId, artistId]
    );

    await sql("COMMIT"); // Commit transaction

    return { id: trackId };
  } catch (error) {
    await sql("ROLLBACK"); // Rollback on error
    throw error; // Re-throw the error for the controller to handle logging/response
  }
}

/**
 * Fetches all releases for a specific artist.
 */
// src/models/release.model.ts

/**
 * Fetches all tracks for an artist, including their parent release metadata.
 * This performs a JOIN across releases, release_tracks, and tracks.
 */
export async function getReleasesByArtist(artistId: string): Promise<any[]> {
  const result = await sql(
    `
    SELECT 
        t.id, 
        t.title, 
        t.genre, 
        t.audio_url, 
        r.id AS release_id, 
        r.cover_url, 
        r.title AS release_title,
        r.release_date,
        r.release_type,
        r.is_published AS status,
        a.artist_name,
        rt.track_number
    FROM releases r
    JOIN release_tracks rt ON r.id = rt.release_id
    JOIN tracks t ON rt.track_id = t.id
    JOIN users a ON r.primary_artist_id = a.id
    WHERE r.primary_artist_id = $1 
    ORDER BY r.created_at DESC, rt.track_number ASC
    `,
    [artistId]
  );

  return result.rows;
}

export async function getReleasesByCategory(
  artistId: string,
  category: string
): Promise<any[]> {
  const result = await sql(
    `
    SELECT 
        t.id, 
        t.title, 
        t.genre, 
        t.audio_url, 
        r.cover_url, 
        r.release_type, 
        r.release_date,
        r.is_published AS status,
        a.artist_name
    FROM releases r
    JOIN release_tracks rt ON r.id = rt.release_id
    JOIN tracks t ON rt.track_id = t.id
    JOIN users a ON r.primary_artist_id = a.id
    WHERE r.primary_artist_id = $1 
    AND r.release_type = $2
    ORDER BY r.created_at DESC, rt.track_number ASC
    `,
    [artistId, category]
  );

  return result.rows;
}

export async function getReleasesById(id: string): Promise<any[]> {
  const result = await sql(
    `
    SELECT 
        t.id, 
        t.title, 
        t.genre, 
        t.audio_url, 
        r.cover_url, 
        r.release_type, 
        r.release_date,
        r.title AS release_title,
        r.is_published AS status,
        a.artist_name,
        rt.track_number
    FROM releases r
    JOIN release_tracks rt ON r.id = rt.release_id
    JOIN tracks t ON rt.track_id = t.id
    JOIN users a ON r.primary_artist_id = a.id
    WHERE r.id = $1 
    ORDER BY r.created_at DESC, rt.track_number ASC
    `,
    [id]
  );

  return result.rows;
}

/**
 * Fetches an artist's releases including all associated track data (audio URLs).
 * Uses JOINs across the normalized schema: releases -> release_tracks -> tracks.
 */
export async function getArtistLibrary(artistId: string, type: string) {
  let query = `
    SELECT 
      r.id AS "releaseId",
      r.title AS "releaseTitle",
      r.cover_url AS "coverUrl",
      r.release_type AS "releaseType",
      r.is_published AS "status",
      t.id AS "trackId",
      t.title AS "trackTitle",
      t.audio_url AS "audioUrl", -- Fetched from tracks table
      t.genre,
      t.duration_ms AS "duration",
      rt.track_number AS "trackNumber"
    FROM releases r
    JOIN release_tracks rt ON r.id = rt.release_id
    JOIN tracks t ON rt.track_id = t.id
    WHERE r.primary_artist_id = $1
  `;

  const params: any[] = [artistId];

  if (type) {
    query += ` AND r.release_type = $2`;
    params.push(type);
  }

  query += ` ORDER BY r.release_date DESC, rt.track_number ASC`;

  const result = await sql(query, params);
  return result.rows;
}

/**
 * Fetches assets for a release (Cover + all Tracks) for Vercel Blob cleanup.
 * Performs a LEFT JOIN to ensure we get the cover even if there are no tracks.
 */
export async function getReleaseAssets(releaseId: string) {
  const result = await sql(
    `
    SELECT r.cover_url, t.audio_url 
    FROM releases r
    LEFT JOIN tracks t ON r.id = t.release_id
    WHERE r.id = $1
  `,
    [releaseId]
  );

  if (result.rows.length === 0) return null;

  // The cover_url is repeated on every row, just take the first one
  const coverUrl = result.rows[0].cover_url;

  // Collect all non-null audio URLs
  const audioUrls = result.rows
    .map((row) => row.audio_url)
    .filter((url) => url !== null && url !== "");

  return {
    coverUrl,
    audioUrls,
  };
}

/**
 * Fetches a single track's data including its parent release ID and audio URL
 */
export async function getTrackData(trackId: string) {
  const result = await sql(
    `SELECT id, release_id, audio_url FROM tracks WHERE id = $1`,
    [trackId]
  );
  return result.rows[0] || null;
}

/**
 * Checks how many tracks exist for a specific release.
 */
export async function getTrackCountByRelease(
  releaseId: string
): Promise<number> {
  const result = await sql(
    `SELECT COUNT(*) as count FROM tracks WHERE release_id = $1`,
    [releaseId]
  );
  return parseInt(result.rows[0].count, 10);
}

/**
 * Deletes the release record.
 * PostgreSQL 'ON DELETE CASCADE' will automatically remove associated tracks.
 */
export async function deleteReleaseRecord(releaseId: string) {
  return await sql(`DELETE FROM releases WHERE id = $1`, [releaseId]);
}

/**
 * Deletes a single track record.
 */
export async function deleteTrackRecord(trackId: string) {
  return await sql(`DELETE FROM tracks WHERE id = $1`, [trackId]);
}
