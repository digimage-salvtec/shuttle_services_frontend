import axios from "axios";

const axios_client = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}`,
});

export default axios_client;
