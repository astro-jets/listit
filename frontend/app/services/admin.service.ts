// src/services/admin.service.ts
import { client } from "~/api/client";
const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});
/**
 * FETCH SYSTEM METRICS
 * Returns: { total_users, active_shops, active_listings, total_reviews }
 */
export const getAdminStats = async () => {
  const res = await client.get("/admin/stats", getAuthHeader());
  return res.data;
};

/**
 * SHOP MODERATION
 */
export const getPendingShops = async () => {
  const res = await client.get("/admin/pending", getAuthHeader());
  return res.data;
};

// src/services/admin.service.ts

export const getAllListings = async () => {
  const res = await client.get("/admin/listings", getAuthHeader()); // Ensure this route exists on Fastify
  return res.data;
};

export const deleteListing = async (id: number) => {
  const res = await client.delete(`/admin/listings/${id}`, getAuthHeader());
  return res.data;
};

export const approveShop = async (shopId: number) => {
  const res = await client.patch(
    `/admin/approve-shop/${shopId}`,
    {}, // Empty Body
    getAuthHeader(), // Config/Headers
  );
  return res.data;
};

export const rejectShop = async (shopId: number) => {
  // Usually a DELETE or setting status to 'rejected'
  const res = await client.delete(`/admin/shops/${shopId}`, getAuthHeader());
  return res.data;
};

/**
 * LISTING MODERATION
 */
export const getPendingListings = async () => {
  const res = await client.get("/admin/pending-listings", getAuthHeader());
  return res.data;
};

export const approveListing = async (listingId: number) => {
  const res = await client.patch(
    `/admin/approve-listing/${listingId}`,
    {}, // Empty Body
    getAuthHeader(),
  );
  return res.data;
};

/**
 * USER & ROLE MANAGEMENT
 */
export const getAllUsers = async (search = "") => {
  const res = await client.get(`/admin/users/all`, getAuthHeader());
  return res.data;
};

export const updateUserRole = async (userId: string, roleId: number) => {
  const res = await client.patch(
    `/admin/users/${userId}/role`,
    { roleId },
    getAuthHeader(),
  );
  return res.data;
};

export const banUser = async (userId: string) => {
  // Logic to either delete or set a 'banned' status/role
  const res = await client.post(`/admin/users/${userId}/ban`, getAuthHeader());
  return res.data;
};

/**
 * CATEGORY MANAGEMENT (CRUD)
 */
export const createCategory = async (name: string, slug: string) => {
  const res = await client.post(
    "/admin/categories",
    { name, slug },
    getAuthHeader(),
  );
  return res.data;
};

export const deleteCategory = async (categoryId: number) => {
  const res = await client.delete(
    `/admin/categories/${categoryId}`,
    getAuthHeader(),
  );
  return res.data;
};
/**
 * REVIEWS MANAGEMENT
 * Handles the CRUD operations for user feedback and ratings.
 */

// 1. Fetch all reviews with expanded details (Author, Listing, Shop)
export const getAllReviews = async () => {
  const res = await client.get("/admin/reviews", getAuthHeader());
  // Digging into .data in case your backend wraps the response
  return res.data?.data || res.data;
};

// 2. Delete a review permanently
export const deleteReview = async (reviewId: number) => {
  const res = await client.delete(
    `/admin/reviews/${reviewId}`,
    getAuthHeader(),
  );
  return res.data;
};

// 3. Update/Moderate a review comment
// Note: We pass an empty object or the new comment as the body
export const updateReview = async (reviewId: number, comment: string) => {
  const res = await client.patch(
    `/admin/reviews/${reviewId}`,
    { comment }, // The request body
    getAuthHeader(), // The config/headers
  );
  return res.data;
};

// 4. (Optional) Toggle review visibility/approval if your DB supports it
export const toggleReviewStatus = async (
  reviewId: number,
  isHidden: boolean,
) => {
  const res = await client.patch(
    `/admin/reviews/${reviewId}/status`,
    { is_hidden: isHidden },
    getAuthHeader(),
  );
  return res.data;
};
export const getGrowthMetrics = async () => {
  const res = await client.get("/admin/metrics", getAuthHeader());

  // Extract the data array from the standard response wrapper
  return res.data?.data || [];
};
