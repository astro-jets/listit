// src/hooks/auth.hook.ts
import { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";

export async function authenticate(req: FastifyRequest, reply: FastifyReply) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return reply.code(401).send({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    // Use your JWT_SECRET from .env
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret"
    ) as { id: string };

    // ATTACH THE USER: This is what the controller is looking for
    req.user = { id: decoded.id };
  } catch (err) {
    return reply.code(401).send({ error: "Invalid or expired token" });
  }
}
