// services/listingService.ts

import client from "~/api/client";

export const registerUser = async (data: FormData) => {
  // Replace with your actual API endpoint
  const response = await client.post("/register/user", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const registerAdmin = async (data: FormData) => {
  // Replace with your actual API endpoint
  const response = await client.post("/register/admin", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const login = async (email: string, password: string) => {
  const res = await client.post("/login", { email, password });
  return res.data;
};

export const getMe = async () => {
  const res = await client.get("/auth/me");
  return res.data;
};
