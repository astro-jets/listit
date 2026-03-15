// src/routes/auth.route.ts
import { FastifyInstance } from "fastify";
import { AuthController } from "../controllers/auth.controller";

export default async function authRoutes(fastify: FastifyInstance) {
  // Registration for Artists: Now expects email, password, and username.
  // The username will be used as the initial artist_name.
  fastify.post("/register/artist", AuthController.registerArtist);

  // Registration for Admins
  fastify.post("/register/admin", AuthController.registerAdmin);

  // Login: Returns a JWT token to be used in the 'Authorization' header
  fastify.post("/login", AuthController.login);
}
