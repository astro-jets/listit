import fp from "fastify-plugin";
import cors from "@fastify/cors";

export default fp(async (app) => {
  app.register(cors, {
    origin: ["http://localhost:5173", "http://localhost:3000"],
  });
});
