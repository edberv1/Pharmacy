// utils/auth.js
import {jwtDecode} from "jwt-decode";

export const decodeToken = (token) => {
  try {
    return jwtDecode(token);
  } catch (e) {
    console.error("Failed to decode token", e);
    return null;
  }
};
