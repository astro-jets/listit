// services/listingService.ts
import client from "~/api/client";

export const submitListing = async (data: FormData) => {
  // Replace with your actual API endpoint
  const response = await client.post("/listings", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
