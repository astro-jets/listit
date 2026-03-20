// services/listingService.ts
import client from "~/api/client";
const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const submitListing = async (formData: FormData) => {
  const token = localStorage.getItem("token");
  const res = await client.post(`/listings`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

//Fetch listings for a specific shop
export const getShopListings = async (shopId: number) => {
  const res = await client.get(`/listings/shop/${shopId}`);
  return res.data;
};

// NEW: Update existing listing (Fast Edit)
export const updateListing = async (id: number, data: any) => {
  const res = await client.patch(`/listings/${id}`, data, getAuthHeader());
  return res.data;
};

// NEW: Delete listing
export const deleteListing = async (id: number) => {
  const res = await client.delete(`/listings/${id}`, getAuthHeader());
  return res.data;
};
