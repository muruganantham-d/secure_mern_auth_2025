import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api/auth",
  withCredentials: true, // important for cookies
});

export const registerUser = (data) => API.post("/register", data);
export const loginUser = (data) => API.post("/login", data);
export const logoutUser = () => API.post("/logout");
export const refreshToken = () => API.post("/refresh");
export const getProfile = () => API.get("/profile").then(res => res.data); // return actual user
