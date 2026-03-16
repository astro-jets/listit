// services/listingService.ts
import axios from "axios";

export const submitListing = async (data: FormData) => {
  // Replace with your actual API endpoint
  const response = await axios.post("/api/listings", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
