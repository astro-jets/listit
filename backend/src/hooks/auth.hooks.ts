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
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret",
    ) as { id: string };

    req.user = { id: decoded.id };
  } catch (err) {
    return reply.code(401).send({ error: "Invalid or expired token" });
  }
}

// NEW: Matching the manual jwt logic for public routes
export async function optionalAuthenticate(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const authHeader = req.headers.authorization;

    // If no header, just exit silently (req.user remains undefined/null)
    if (!authHeader) return;

    const token = authHeader.split(" ")[1];
    if (!token) return;

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret",
    ) as { id: string };

    // If valid, attach the user so the controller can pass it to the model
    req.user = { id: decoded.id };
  } catch (err) {
    // If the token is expired or fake, we still let them through as a "guest"
    // We just don't attach the user object
    return;
  }
}
