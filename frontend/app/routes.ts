import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // Public Routes
  index("pages/Home.tsx"),
  route("/explore", "pages/Explore.tsx"),
  route("/shop/:id", "pages/Shop.tsx"),
  route("/product/:id", "pages/Product.tsx"),

  // Admin Routes
  route("/admin/analytics", "pages/admin/Analytics.tsx"),
  route("/admin/listings", "pages/admin/Listings.tsx"),
  route("/admin/shops", "pages/admin/Shops.tsx"),
  route("/admin/dashboard", "pages/admin/Dashboard.tsx"),

  // User Routes
  route("/dashboard", "pages/users/Dashboard.tsx"),
  route("/profile", "pages/users/Profile.tsx"),
  route("/reviews", "pages/users/Reviews.tsx"),
  route("/myshop", "pages/users/MyShop.tsx"),
  route("/inventory", "pages/users/Inventory.tsx"),
  route("/analytics", "pages/users/Analytics.tsx"),

  // Auth Routes
  route("/login", "pages/auth/Login.tsx"),
  route("/signup", "pages/auth/Signup.tsx"),
] satisfies RouteConfig;
