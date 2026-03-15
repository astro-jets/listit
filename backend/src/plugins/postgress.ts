import fp from "fastify-plugin";
import { Pool } from "pg";

export default fp(async (app) => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  app.decorate("pg", pool);

  app.addHook("onClose", async () => {
    await pool.end();
  });
});
