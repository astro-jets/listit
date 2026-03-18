import axios from "axios";

const API_BASE = import.meta.env.API_URL||'https://listit-c5yb.onrender.com/'

export const client = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

export const uploadClient = axios.create({
  baseURL: API_BASE,
});

export default client;
