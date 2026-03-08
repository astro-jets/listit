import client from "./client";

export const login = async (email: string, password: string) => {
  const res = await client.post("/auth/login", { email, password });
  return res.data;
};

export const getMe = async () => {
  const res = await client.get("/auth/me");
  return res.data;
};
