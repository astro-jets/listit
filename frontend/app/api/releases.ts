// app/api/releases.ts
// Requires: npm install axios

import axios from "axios";
import type { ReleaseFormData } from "~/validators/release.schema";
// Assuming ReleaseFormData and the API_BASE_URL are accessible

const API_BASE_URL = "http://localhost:3001/artist"; // Matches the prefix from app.ts

/**
 * Orchestrates the entire multi-step release submission process.
 */
export async function SubmitRelease(data: ReleaseFormData) {
  let releaseId: string;

  // ----------------------
  // STEP 1: CREATE RELEASE CONTAINER (Metadata + Cover)
  // Endpoint: POST /artist/releases
  // ----------------------
  console.log("Starting Step 1: Creating Release Container...");
  const releaseFormData = new FormData();
  releaseFormData.append("title", data.title);
  releaseFormData.append("releaseType", data.releaseType);
  releaseFormData.append("releaseDate", data.releaseDate);
  releaseFormData.append("coverFile", data.coverFile); // File object

  try {
    const response = await axios.post<{ releaseId: string }>(
      `${API_BASE_URL}/releases`,
      releaseFormData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          // NOTE: Include your Authorization token here if you have an auth system (e.g., JWT)
          // Authorization: `Bearer ${token}`
        },
      }
    );
    releaseId = response.data.releaseId;
    console.log(`Release container created with ID: ${releaseId}`);
  } catch (error) {
    throw new Error("Failed to create release container.");
  }

  // ----------------------
  // STEP 2: ATTACH ALL TRACKS (One API call per track)
  // Endpoint: POST /artist/releases/:releaseId/tracks
  // ----------------------
  console.log(`Starting Step 2: Attaching ${data.tracks.length} tracks...`);

  for (const [index, track] of data.tracks.entries()) {
    console.log(`Uploading Track ${index + 1}: ${track.title}`);

    const trackFormData = new FormData();
    trackFormData.append("title", track.title);
    trackFormData.append("genre", track.genre);
    trackFormData.append("isrc", track.isrc || "");
    trackFormData.append("duration", String(track.duration)); // Convert number to string
    trackFormData.append("trackNumber", String(index + 1)); // Enforce correct track numbering
    trackFormData.append("featuring", track.featuring || "");
    trackFormData.append("audioFile", track.audioFile); // File object

    try {
      await axios.post(
        `${API_BASE_URL}/releases/${releaseId}/tracks`,
        trackFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            // NOTE: Include your Authorization token here
          },
          // Optional: Add onUploadProgress callback for UI feedback
        }
      );
      console.log(`Track ${index + 1} uploaded successfully.`);
    } catch (error) {
      console.error(`Failed to upload track ${index + 1}.`, error);
      // In a production app, you would call a cleanup API to delete the partially created release
      throw new Error(`Track submission failed for ${track.title}.`);
    }
  }

  console.log("All tracks uploaded. Submission complete.");
}
