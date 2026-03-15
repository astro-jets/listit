import { FastifyInstance } from "fastify";
import { uploadToBlob } from "../utils/blob";

export async function uploadRoutes(fastify: FastifyInstance) {
  fastify.post("/uploads", async (req, reply) => {
    const parts = req.parts();

    let metadata: any = {};
    let coverUrl = "";
    let audioUrl = "";

    for await (const part of parts) {
      if (part.type === "file") {
        if (part.fieldname === "cover") {
          coverUrl = await uploadToBlob(
            part.file,
            part.filename,
            part.mimetype,
            "covers"
          );
        }

        if (part.fieldname === "audio") {
          audioUrl = await uploadToBlob(
            part.file,
            part.filename,
            part.mimetype,
            "audio"
          );
        }
      } else {
        metadata[part.fieldname] = part.value;
      }
    }

    if (!coverUrl || !audioUrl) {
      return reply.code(400).send({ error: "Files missing" });
    }

    // ---- Save to DB ----
    const release = await fastify.pg.query(
      `
      INSERT INTO releases
      (title, featuring, genre, isrc, release_date, is_album, cover_url, audio_url)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *
      `,
      [
        metadata.title,
        metadata.featuring,
        metadata.genre,
        metadata.isrc,
        metadata.releaseDate,
        metadata.isAlbum === "true",
        coverUrl,
        audioUrl,
      ]
    );

    return reply.send({
      success: true,
      release: release.rows[0],
    });
  });
}
