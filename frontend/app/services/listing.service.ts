// services/listingService.ts
import client from "~/api/client";

/**
 * Helper to get authorization headers.
 * If no token is found, it returns an empty object to prevent sending "Bearer null".
 */
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  if (!token) return {};
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

/**
 * Helper for public endpoints that benefit from auth context
 * (e.g., seeing "is_favorited: true" on a public listing)
 */
const getOptionalAuthHeader = () => getAuthHeader();

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

// Search listings with optional auth to check favorite status
export const searchListings = async (search: string) => {
  const res = await client.get(
    `/listings/search/${search}`,
    getOptionalAuthHeader(),
  );
  return res.data;
};

export const toggleFavorite = async (id: string | number) => {
  const res = await client.post(
    "/favorites/toggle",
    { listingId: id },
    getOptionalAuthHeader(),
  );
  return res.data;
};

/**
 * Fetch Featured Listings (Public)
 * Backend returns: { data: Listing[], pagination: { total, page, limit, totalPages } }
 */
export const getAllListings = async (page: number = 1, limit: number = 12) => {
  const res = await client.get(
    `/listings/featured?page=${page}&limit=${limit}`,
    getOptionalAuthHeader(),
  );
  return res.data;
};

export const getFavoriteListings = async () => {
  const res = await client.get(`/favorites`, getAuthHeader());
  return res.data;
};

// Fetches listings owned by the authenticated user's shop
export const getMyListings = async () => {
  const res = await client.get(`/listings/my-listings`, getAuthHeader());
  return res.data;
};

export const getFeaturedShops = async () => {
  const res = await client.get(`/shops/featured`);
  return res.data;
};

export const getShopListings = async (shopId: string | number) => {
  const res = await client.get(
    `/listings/shop/${shopId}`,
    getOptionalAuthHeader(),
  );
  return res.data;
};

export const getListingById = async (id: string | number) => {
  const res = await client.get(`/listings/${id}`, getOptionalAuthHeader());
  return res.data;
};

// Update existing listing (Fast Edit - JSON based)
export const updateListing = async (id: number, data: any) => {
  const res = await client.patch(`/listings/${id}`, data, getAuthHeader());
  return res.data;
};

// Delete listing and associated assets
export const deleteListing = async (id: number) => {
  const res = await client.delete(`/listings/${id}`, getAuthHeader());
  return res.data;
};
