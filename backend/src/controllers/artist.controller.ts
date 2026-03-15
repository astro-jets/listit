// src/controllers/artist.controller.ts
import { FastifyRequest, FastifyReply } from "fastify";
import { searchArtistsByName } from "../models/artist.model";

export async function searchArtists(req: FastifyRequest, reply: FastifyReply) {
  const { query } = req.query as { query: string };

  if (!query || query.length < 2) {
    return reply.send([]);
  }

  try {
    const artists = await searchArtistsByName(query);
    return reply.send(artists);
  } catch (error) {
    req.log.error(error);
    return reply.code(500).send({ error: "Failed to search artists" });
  }
}
