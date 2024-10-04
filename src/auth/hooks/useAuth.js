import { useState } from "react";

export const useAuth = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const saveToken = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
  };

  const removeToken = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const isAuthenticated = () => !!token;

  return { token, saveToken, removeToken, isAuthenticated };
};
