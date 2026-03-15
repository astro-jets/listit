// utils/blob.ts
import { put } from "@vercel/blob";

export async function uploadToBlob(
  file: AsyncIterable<Buffer> | Buffer,
  filename: string,
  contentType: string,
  folder: string
) {
  const blob = await put(`${folder}/${Date.now()}-${filename}`, file as any, {
    access: "public",
    contentType,
  });

  return blob.url;
}
