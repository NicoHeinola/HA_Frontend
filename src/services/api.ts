import axios from "axios";
import qs from "qs";

const api = axios.create({
  baseURL: (import.meta as any).env.VITE_API_URL,
  timeout: 30 * 1000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: (params) => {
    return qs.stringify(params, { arrayFormat: "brackets" });
  },
});

const basicAPI = axios.create({
  baseURL: (import.meta as any).env.VITE_API_URL,
  timeout: 30 * 1000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: (params) => {
    return qs.stringify(params, { arrayFormat: "brackets" });
  },
});

export default api;
export { basicAPI, api };
