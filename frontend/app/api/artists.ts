// In your client-side API file (e.g., ../../api/uploads.ts)

import axios from "axios";

// This interface is based on what CreateRelease.tsx is sending
interface UploadData {
  title: string;
  featuring: string;
  genre: string;
  isrc: string;
  releaseDate: string;
  isAlbum: boolean;
  cover: File; // The actual cover File object
  audio: File; // The actual audio File object
}

const BACKEND_URL = "http://localhost:5000/uploads/release"; // Corrected URL

export async function submitUpload(data: UploadData) {
  const formData = new FormData();

  // 1. Append Files
  // The keys "cover" and "audio" MUST match part.fieldname in artistController.ts
  formData.append("cover", data.cover);
  formData.append("audio", data.audio);

  // 2. Append Metadata Fields
  // The keys "title", "genre", etc. MUST match part.fieldname in artistController.ts
  formData.append("title", data.title);
  formData.append("featuring", data.featuring);
  formData.append("genre", data.genre);
  formData.append("isrc", data.isrc);
  formData.append("releaseDate", data.releaseDate);
  // Convert boolean to string for Fastify to parse as a field
  formData.append("isAlbum", String(data.isAlbum));

  try {
    const response = await axios.post(BACKEND_URL, formData, {
      // DO NOT set 'Content-Type': 'multipart/form-data'.
      // Axios and the browser handle this automatically when passing a FormData object.
      headers: {
        // ... Authentication headers would go here ...
      },
    });

    console.log("✅ Release Upload Success:", response.data);
    return response.data;
  } catch (error) {
    // Handle errors as you did before
    if (axios.isAxiosError(error) && error.response) {
      console.error("❌ Submission Failed:", error.response.data);
      throw new Error(error.response.data.error || "Failed to upload release.");
    } else {
      console.error("❌ An unexpected error occurred:", error);
      throw new Error("An unexpected network error occurred.");
    }
  }
}
