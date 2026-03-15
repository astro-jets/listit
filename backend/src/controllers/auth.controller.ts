import { FastifyRequest, FastifyReply } from "fastify";
import { createUser, findUserByEmail, userExists } from "../models/auth.models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, UserRole } from "../types/user";
import { del } from "@vercel/blob";
import { request } from "http";
import * as ReleaseModel from "../models/release.model";
import {
  deleteReleaseRecord,
  deleteTrackRecord,
  getReleaseAssets,
  getTrackData,
} from "../models/release.model";

interface TrackParams {
  trackId: string;
}

interface ReleaseParams {
  id: string;
}

// Helper function to sign a JWT
const signToken = (user: User) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET || "fallback_secret_must_be_changed", // Use env var or fall back
    { expiresIn: "7d" }
  );
};

export class AuthController {
  // --- ARTIST REGISTRATION (DEFAULT ROLE) ---
  static async registerArtist(req: FastifyRequest, reply: FastifyReply) {
    const { username, email, password } = req.body as any;
    const defaultRole: UserRole = "artist";

    if (!email || !password) {
      return reply
        .code(400)
        .send({ error: "Email and password are required." });
    }

    if (await userExists(email)) {
      return reply.code(409).send({ error: "User already exists." });
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await createUser(email, hashed, username, defaultRole);

    // Return token on successful registration
    const token = signToken(newUser as User);
    return reply.code(201).send({
      token,
      user: {
        id: (newUser as User).id,
        username: (newUser as User).username,
        email: (newUser as User).email,
        role: (newUser as User).role,
      },
    });
  }

  // --- ADMIN REGISTRATION (Special Route) ---
  static async registerAdmin(req: FastifyRequest, reply: FastifyReply) {
    const { username, email, password } = req.body as any;
    const adminRole: UserRole = "admin";

    if (!email || !password) {
      return reply
        .code(400)
        .send({ error: "Email and password are required." });
    }

    if (await userExists(email)) {
      return reply
        .code(409)
        .send({ error: "Admin already exists with this email." });
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await createUser(email, hashed, username, adminRole);

    const token = signToken(newUser as User);
    return reply.code(201).send({
      token,
      user: {
        id: (newUser as User).id,
        email: (newUser as User).email,
        role: (newUser as User).role,
      },
    });
  }

  // --- LOGIN ---
  static async login(req: FastifyRequest, reply: FastifyReply) {
    const { email, password } = req.body as any;

    if (!email || !password) {
      return reply
        .code(400)
        .send({ error: "Email and password are required." });
    }

    const user = await findUserByEmail(email);
    if (!user) return reply.code(401).send({ error: "Invalid credentials" });

    // Check password validity
    const valid = await bcrypt.compare(password, user.password!);
    if (!valid) return reply.code(401).send({ error: "Invalid credentials" });

    // Generate and return JWT
    const token = signToken(user);

    // Avoid sending the password hash back
    const { password: _, ...userPayload } = user;

    return reply.send({ token, user: userPayload });
  }

  // Static deleteRelease so it can be called internally
  static async deleteRelease(
    request: FastifyRequest<{ Params: ReleaseParams }>,
    reply: FastifyReply,
    providedId?: string
  ) {
    const releaseId = providedId || request.params.id;

    const assets = await ReleaseModel.getReleaseAssets(releaseId);
    if (!assets) return reply.code(404).send({ message: "Release not found" });

    // DB Delete (Cascades to tracks table in Postgres)
    await ReleaseModel.deleteReleaseRecord(releaseId);

    // Vercel Blob Cleanup
    const filesToDelete = [...assets.audioUrls];
    if (assets.coverUrl) filesToDelete.push(assets.coverUrl);

    if (filesToDelete.length > 0) {
      await del(filesToDelete);
    }

    return reply.send({ message: "Release and all files deleted" });
  }

  static async deleteTrack(
    req: FastifyRequest<{ Params: TrackParams }>,
    reply: FastifyReply
  ) {
    const { trackId } = req.params;

    try {
      // 1. Get track data to find the parent Release ID
      const track = await getTrackData(trackId);
      if (!track) {
        return reply.code(404).send({ error: "Track not found." });
      }

      // 2. Use the COUNT method instead of fetching array
      const trackCount = await ReleaseModel.getTrackCountByRelease(
        track.release_id
      ); // <--- FIXED HERE

      // 3. LOGIC: If count is 1 or less, it means this is the last track.
      if (trackCount <= 1) {
        // Fetch assets for the PARENT release so we can delete the cover too
        const assets = await getReleaseAssets(track.release_id);

        // Delete Parent Release DB Record (Cascades to this track)
        await deleteReleaseRecord(track.release_id);

        // Cleanup files (Cover + Audio)
        if (assets) {
          const filesToDelete = [...assets.audioUrls];
          if (assets.coverUrl) filesToDelete.push(assets.coverUrl);
          if (filesToDelete.length > 0) await del(filesToDelete);
        }

        return reply.send({
          success: true,
          message:
            "Track deleted. Parent release was also removed as it became empty.",
        });
      }

      // 4. Normal Delete: Just delete this single track
      await deleteTrackRecord(trackId);

      // 5. Cleanup just the audio file for this track
      if (track.audio_url) {
        await del(track.audio_url);
      }

      return reply.send({
        success: true,
        message: "Track deleted successfully.",
      });
    } catch (error) {
      req.log.error(error);
      return reply.code(500).send({ error: "Failed to delete track." });
    }
  }
}
