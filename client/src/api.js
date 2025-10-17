import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:5500/api", // your backend
  baseURL:"https://evangadi-forum-2025-nyg9.onrender.com/api"
});

export default api;
