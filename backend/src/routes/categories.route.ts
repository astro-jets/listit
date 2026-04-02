// src/routes/category.routes.ts
import { FastifyInstance } from "fastify";
import { CategoryController } from "../controllers/categoriesController";

export async function categoryRoutes(fastify: FastifyInstance) {
  // Public route for the frontend dropdown
  fastify.get("/", CategoryController.getAllCategories);

  // Protected routes (Add your auth hook here if needed)
  fastify.post("/", CategoryController.createCategory);
  fastify.delete("/:id", CategoryController.deleteCategory);
}
