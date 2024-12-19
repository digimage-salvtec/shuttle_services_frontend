import axios from "axios";

const axios_client = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default axios_client;
