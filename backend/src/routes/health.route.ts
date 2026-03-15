import { FastifyPluginAsync } from "fastify";

const healthRoute: FastifyPluginAsync = async (app) => {
  app.get("/", async () => {
    return { status: "ok", service: "Upload API" };
  });
};

export default healthRoute;
