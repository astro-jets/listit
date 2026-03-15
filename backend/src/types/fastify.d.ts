import { FastifyInstance, FastifyRequest } from "fastify";
import { Pool } from "pg"; // <-- Import the Pool type from 'pg'

// Augment the FastifyInstance interface (which is `req.server` inside a route)
declare module "fastify" {
  interface FastifyInstance {
    // The Fastify instance has the Pool object decorated as 'pg'
    pg: Pool;
  }

  // OPTIONAL: You can also augment the Request object if you prefer accessing it via `req.pg`
  // interface FastifyRequest {
  //   pg: Pool;
  // }
}
