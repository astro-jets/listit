import { processMultipartImages } from "../services/blob.service";
import { FastifyRequest, FastifyReply } from "fastify";
import { createUser, findUserByEmail, userExists } from "../models/auth.models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, UserRole } from "../types/user";
import { del } from "@vercel/blob";

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
    process.env.JWT_SECRET || "fallback_secret_must_be_changed",
    { expiresIn: "7d" },
  );
};

export class AuthController {
  static async registerUser(req: FastifyRequest, reply: FastifyReply) {
    try {
      // 1. Process the multipart form data and upload avatar to Vercel Blob
      const { fields, imageUrls } = await processMultipartImages(req, 1);

      // Added phone_number to extracted fields
      const { username, email, password, bio, phone_number } = fields;
      const avatar_url = imageUrls.length > 0 ? imageUrls[0] : "";
      const defaultRole: UserRole = 2;

      // 2. Validation
      // Added phone_number to required field check
      if (!email || !password || !username || !phone_number) {
        return reply.code(400).send({
          error: "Username, email, phone number, and password are required.",
        });
      }

      if (await userExists(email)) {
        return reply.code(409).send({ error: "User already exists." });
      }

      // 3. Hash password and save to Database
      const hashed = await bcrypt.hash(password, 10);
      const newUser = await createUser(
        email,
        hashed,
        username,
        defaultRole,
        bio || "",
        avatar_url,
        phone_number, // Ensure your createUser model is updated to accept this argument
      );

      // 4. Generate Token and Response
      const token = signToken(newUser);

      return reply.code(201).send({
        token,
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          phone_number: newUser.phone_number,
          avatar_url: newUser.avatar_url,
        },
      });
    } catch (err: any) {
      return reply.code(500).send({
        error: err.message || "An error occurred during registration.",
      });
    }
  }

  // --- ADMIN REGISTRATION ---
  static async registerAdmin(req: FastifyRequest, reply: FastifyReply) {
    const { username, email, password, bio, phone_number } = req.body as any;
    const avatar_url = "";
    const adminRole: UserRole = 1;

    if (!email || !password || !phone_number) {
      return reply
        .code(400)
        .send({ error: "Email, password, and phone number are required." });
    }

    if (await userExists(email)) {
      return reply
        .code(409)
        .send({ error: "Admin already exists with this email." });
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await createUser(
      email,
      hashed,
      username,
      adminRole,
      bio,
      avatar_url,
      phone_number,
    );

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

    const valid = await bcrypt.compare(password, user.password!);
    if (!valid) return reply.code(401).send({ error: "Invalid credentials" });

    const token = signToken(user);

    // Avoid sending the password hash back
    const { password: _, ...userPayload } = user;

    return reply.send({ token, user: userPayload });
  }
}
