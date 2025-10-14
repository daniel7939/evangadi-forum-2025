import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5500/api", // your backend
});

export default api;
