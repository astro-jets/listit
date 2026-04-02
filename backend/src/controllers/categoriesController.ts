// src/controllers/category.controller.ts
import { FastifyRequest, FastifyReply } from "fastify";
import { CategoryService } from "../models/categories.model";

export const CategoryController = {
  async getAllCategories(req: FastifyRequest, reply: FastifyReply) {
    const categories = await CategoryService.getAll();
    return reply.send(categories);
  },

  async createCategory(req: FastifyRequest, reply: FastifyReply) {
    const { name, slug } = req.body as { name: string; slug: string };

    if (!name || !slug) {
      return reply.code(400).send({ error: "Name and Slug are required" });
    }

    try {
      const category = await CategoryService.create(name, slug);
      return reply.code(201).send(category);
    } catch (err: any) {
      if (err.code === "23505") {
        // Unique constraint violation
        return reply
          .code(409)
          .send({ error: "Category or Slug already exists" });
      }
      throw err;
    }
  },

  async deleteCategory(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const success = await CategoryService.delete(Number(id));

    if (!success) {
      return reply.code(404).send({ error: "Category not found" });
    }
    return reply.send({ success: true });
  },
};
