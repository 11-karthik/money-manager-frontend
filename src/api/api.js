import axios from "axios";

const api = axios.create({
  baseURL: "https://money-manager-backend-1nlc.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;