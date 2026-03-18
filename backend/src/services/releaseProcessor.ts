import { pool } from "../db/db";

export function simulateProcessing(releaseId: number) {
  setTimeout(async () => {
    // Ensure all tracks exist
    const { rows } = await pool.query(
      `
      SELECT COUNT(*)::int AS count
      FROM tracks
      WHERE release_id = $1
      `,
      [releaseId]
    );

    if (rows[0].count === 0) {
      // no tracks → revert to DRAFT
      await pool.query(`UPDATE releases SET status = 'DRAFT' WHERE id = $1`, [
        releaseId,
      ]);
      return;
    }

    // Move to PENDING_REVIEW
    await pool.query(
      `
      UPDATE releases
      SET status = 'PENDING_REVIEW'
      WHERE id = $1
        AND status = 'PROCESSING'
      `,
      [releaseId]
    );
  }, 7000); // 7 seconds (transcoding simulation)
}
