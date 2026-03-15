// src/controllers/releases.controller.ts

import { FastifyRequest, FastifyReply } from "fastify";
import { uploadToBlob } from "../utils/blob";
import { ReleaseFormData } from "../validators/release.schema";
import {
  getArtistLibrary,
  getReleasesByArtist,
  getReleasesById,
  insertRelease,
  insertTrackAndLink,
} from "../models/release.model";

interface AuthenticatedUser {
  id: string; // The ID is required for primaryArtistId
}

// Augment the Fastify interface to include the user property
declare module "fastify" {
  interface FastifyRequest {
    user: AuthenticatedUser;
  }
}

// ==========================================================

/**
 * Controller function for Step 1: Create the Release Container (Metadata + Cover */

export async function createRelease(req: FastifyRequest, reply: FastifyReply) {
  const primaryArtistId = req.user.id;
  const parts = req.parts();

  let metadata: Partial<ReleaseFormData> = {};
  let coverFileBuffer: Buffer | null = null;
  let coverFileName: string = "";
  let coverMimeType: string = "";

  try {
    for await (const part of parts) {
      if (part.type === "file") {
        if (part.fieldname === "coverFile") {
          // 1. Capture metadata about the file
          coverFileName = part.filename;
          coverMimeType = part.mimetype;

          // 2. CONVERT STREAM TO BUFFER IMMEDIATELY
          // This consumes the stream so it's no longer "locked"
          coverFileBuffer = await part.toBuffer();
        } else {
          // Always consume unused files to avoid hanging
          await part.toBuffer();
        }
      } else {
        (metadata as any)[part.fieldname] = part.value;
      }
    }

    if (!metadata.title || !coverFileBuffer) {
      return reply.code(400).send({ error: "Missing title or cover file." });
    }

    // 3. Pass the BUFFER to your upload function instead of the stream
    const coverUrl = await uploadToBlob(
      coverFileBuffer, // Pass buffer here
      coverFileName,
      coverMimeType,
      "covers"
    );

    const result = await insertRelease(metadata, coverUrl, primaryArtistId);

    return reply.send({
      releaseId: result.id,
      releaseTitle: result.title,
      message: "Release created successfully!",
    });
  } catch (error) {
    req.log.error(error);
    return reply.code(500).send({ error: "Internal Server Error" });
  }
}

/**
 * Controller function for Step 2: Add a Track to an existing Release.
 */
export async function addTrackToRelease(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const { releaseId } = req.params as { releaseId: string };
  const primaryArtistId = req.user.id;

  const parts = req.parts();
  let trackMetadata: any = {};
  let audioBuffer: Buffer | null = null;
  let audioFileName: string = "";
  let audioMimeType: string = "";

  try {
    for await (const part of parts) {
      if (part.type === "file") {
        if (part.fieldname === "audioFile") {
          // 1. Capture details and CONSUME the stream immediately
          audioFileName = part.filename;
          audioMimeType = part.mimetype;
          audioBuffer = await part.toBuffer();
        } else {
          await part.toBuffer(); // Drain other unexpected files
        }
      } else {
        trackMetadata[part.fieldname] = part.value;
      }
    }

    // 2. Validation (Check if we actually got the buffer)
    if (
      !audioBuffer ||
      !trackMetadata.title ||
      !trackMetadata.genre ||
      !trackMetadata.duration ||
      !trackMetadata.trackNumber
    ) {
      return reply.code(400).send({
        error: "Missing required track metadata, audio file, or track number.",
      });
    }

    // 3. Upload Audio File (Passing the Buffer, not the stream)
    const audioUrl = await uploadToBlob(
      audioBuffer,
      audioFileName,
      audioMimeType,
      "audio"
    );

    // 4. DB Insertion
    const result = await insertTrackAndLink(
      trackMetadata,
      audioUrl,
      releaseId,
      primaryArtistId
    );

    return reply.send({
      success: true,
      trackId: result.id,
      message: "Track added successfully.",
    });
  } catch (error) {
    req.log.error(error as Error, "Error on addTrack:");
    return reply.code(500).send({ error: "Server error adding track." });
  }
}

export const getReleases = async (req: FastifyRequest, reply: FastifyReply) => {
  const artistId = req.user.id;

  try {
    const data = await getReleasesByArtist(artistId);

    // Send the array directly to the frontend
    return reply.send(data);
  } catch (error) {
    req.log.error(error);
    return reply
      .code(500)
      .send({ error: "Failed to fetch tracks and releases." });
  }
};

export async function getMyLibrary(req: FastifyRequest, reply: FastifyReply) {
  const artistId = req.user.id;
  const { releaseType } = req.params as { releaseType: string };

  try {
    const library = await getArtistLibrary(artistId, releaseType);

    return reply.send({
      success: true,
      data: library,
    });
  } catch (error) {
    req.log.error(error as Error, "Library fetch error:");
    return reply.code(500).send({ error: "Failed to fetch music library." });
  }
}

export async function getReleaseById(req: FastifyRequest, reply: FastifyReply) {
  const { id } = req.params as { id: string };

  try {
    const release = await getReleasesById(id);

    return reply.send(release);
  } catch (error) {
    req.log.error(error as Error, "Release fetch error:");
    return reply.code(500).send({ error: "Failed to fetch release." });
  }
}

export const ReleaseController = {
  createRelease,
  addTrackToRelease,
  getReleases,
  getMyLibrary,
  getReleaseById,
};
