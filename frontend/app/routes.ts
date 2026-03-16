import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("pages/public/Dashboard.tsx"),
  route("/admin/analytics", "pages/admin/Analytics.tsx"),
  route("/admin/listings", "pages/admin/Listings.tsx"),
  route("/admin/shops", "pages/admin/Shops.tsx"),
  route("/admin/", "pages/admin/Dashboard.tsx"),
  route("/profile", "pages/public/Profile.tsx"),
  route("/reviews", "pages/public/Reviews.tsx"),
  route("/myshop", "pages/public/MyShop.tsx"),
  route("/inventory", "pages/public/Inventory.tsx"),
  route("/analytics", "pages/public/Analytics.tsx"),
  route("/login", "pages/auth/Login.tsx"),
  route("/signup", "pages/auth/Signup.tsx"),
] satisfies RouteConfig;
