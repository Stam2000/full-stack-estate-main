import axios from "axios";

const apiRequest = axios.create({
  baseURL: "https://full-stack-estate-main-k9cj.onrender.com/api",
  withCredentials: true,
});

export default apiRequest;
