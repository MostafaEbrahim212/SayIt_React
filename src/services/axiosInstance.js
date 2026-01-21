import axios from "axios";

// هنا حط رابط السيرفر الأساسي بتاعك
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // عدل على حسب السيرفر بتاعك
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
