import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("pages/public/Dashboard.tsx"),
  route("/profile", "pages/public/Profile.tsx"),
  route("/messages", "pages/public/Messages.tsx"),
  route("/myshop", "pages/public/MyShop.tsx"),
  route("/analytics", "pages/public/Analytics.tsx"),
] satisfies RouteConfig;
