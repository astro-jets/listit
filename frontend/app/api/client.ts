import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

export const client = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

export const uploadClient = axios.create({
  baseURL: API_BASE,
});

export default client;
