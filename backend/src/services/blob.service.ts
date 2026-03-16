// services/blob.service.ts

import { FastifyRequest } from "fastify";
import { put } from "@vercel/blob";

export async function processMultipartImages(
  request: FastifyRequest,
  maxImages = 3,
) {
  const parts = request.parts();

  const fields: any = {};
  const imageUrls: string[] = [];

  for await (const part of parts) {
    if (part.type === "file") {
      const buffer = await part.toBuffer();

      const blob = await put(`listing-${Date.now()}-${part.filename}`, buffer, {
        access: "public",
      });

      imageUrls.push(blob.url);
    } else {
      fields[part.fieldname] = part.value;
    }
  }

  if (imageUrls.length > maxImages) {
    throw new Error(`Maximum ${maxImages} images allowed`);
  }

  return { fields, imageUrls };
}
