// services/shopService.ts
import axios from "axios";

export const createShop = async (shopData: FormData) => {
  // This matches the general structure expected by your backend hooks
  const response = await axios.post("/api/shops", shopData);
  return response.data;
};
