import axios from "axios";

const API = axios.create({
  baseURL: "https://pos-inventory-management-system-1.onrender.com/api",
  timeout: 10000, //  important for render delay
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;