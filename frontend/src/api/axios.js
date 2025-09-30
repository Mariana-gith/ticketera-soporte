import axios from "axios";

const api = axios.create({
  baseURL: "/api", // siempre va a pasar por Nginx
});

export default api;
