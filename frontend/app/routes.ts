import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("pages/public/dashboard.tsx"),
  route("/profile", "pages/public/profile.tsx"),
  route("/messages", "pages/public/messages.tsx"),
  route("/myshop", "pages/public/myshop.tsx"),
  route("/analytics", "pages/public/analytics.tsx"),
] satisfies RouteConfig;
