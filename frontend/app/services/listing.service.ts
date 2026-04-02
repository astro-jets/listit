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

export const getCategories = async () => {
  const res = await client.get(`/categories`);
  return res.data;
};

// search listings with optional query
export const searchListings = async (search: string) => {
  const res = await client.get(`/listings/search/${search}`);
  return res.data;
};

export const toggleFavorite = async (id: string) => {
  try {
    const res = await client.post(
      "/favorites/toggle",
      { listingId: id },
      getAuthHeader(),
    );

    return res.data;
  } catch (err) {
    console.error(err);
  }
};

//Fetch All listings
export const getAllListings = async (page: number) => {
  const res = await client.get(
    `/listings/featured?page=${page}&limit=12`,
    getAuthHeader(),
  );
  return res.data;
};

export const getFavoriteListings = async () => {
  const res = await client.get(`/favorites`, getAuthHeader());
  return res.data;
};

export const getFeaturedShops = async () => {
  const res = await client.get(`/shops/featured`);
  return res.data;
};

//Fetch listings for a specific shop
export const getShopListings = async (shopId: string) => {
  const res = await client.get(`/listings/shop/${shopId}`);
  return res.data;
};

export const getListingById = async (id: string | number) => {
  const res = await client.get(`/listings/${id}`);
  return res.data; // This returns the listing + shop metadata + images array
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
