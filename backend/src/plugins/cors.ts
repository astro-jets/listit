import fp from "fastify-plugin";
import cors from "@fastify/cors";

export default fp(async (app) => {
  app.register(cors, {
    origin: ["http://localhost:5173", "listit-ten.vercel.app"],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"], // MUST include DELETE
    allowedHeaders: ["Content-Type", "Authorization"],
  });
});
