// lib/uploadthing.ts
import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "~/api/uploadthing/core";
// Adjust path as needed

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>();
