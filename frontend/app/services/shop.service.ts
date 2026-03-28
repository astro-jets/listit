// shop.service.ts
import client from "~/api/client";

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const getMyShop = async () => {
  const res = await client.get("/shops/me", getAuthHeader());
  return res.data;
};

// Get shop by Id
export const getShopById = async (id: string) => {
  const res = await client.get(`/shops/${id}`, getAuthHeader());
  return res.data;
};

export const deleteShop = async (id: number) => {
  const res = await client.delete(`/shops/delete/${id}`, getAuthHeader());
  return res.data;
};

export const createShop = async (formData: FormData) => {
  const res = await client.post("/shops", formData, {
    headers: {
      ...getAuthHeader().headers,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const updateShop = async (
  id: number,
  data: { name: string; description: string },
) => {
  const res = await client.patch(`/shops/update/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return res.data;
};
