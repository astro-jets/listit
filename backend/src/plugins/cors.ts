// src/plugins/cors.ts
import fp from "fastify-plugin";
import cors from "@fastify/cors";

export default fp(async (app) => {
  app.register(cors, {
    // The origin must include the protocol (http:// or https://)
    // and must not have a trailing slash.
    origin: [
      "http://localhost:5173", // Local development (Vite default)
      "https://listit-ten.vercel.app", // Your production frontend
    ],

    // Explicitly listing methods ensures 'OPTIONS' preflight requests
    // and standard CRUD operations work across different browsers.
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

    // Allowed headers must include 'Authorization' if you are using
    // JWT tokens or any custom auth hooks.
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],

    // Set to true if you need to support cookies,
    // authorization headers, or TLS client certificates.
    credentials: true,
  });
});
