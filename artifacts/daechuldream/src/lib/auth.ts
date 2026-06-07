import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";

export function getAdminToken() {
  return localStorage.getItem("admin_token");
}

export function setAdminToken(token: string) {
  localStorage.setItem("admin_token", token);
}

export function removeAdminToken() {
  localStorage.removeItem("admin_token");
}

export function useAuth() {
  const [token, setTokenState] = useState<string | null>(getAdminToken());
  const [, setLocation] = useLocation();

  const login = (newToken: string) => {
    setAdminToken(newToken);
    setTokenState(newToken);
    setLocation("/admin/dashboard");
  };

  const logout = () => {
    removeAdminToken();
    setTokenState(null);
    setLocation("/admin");
  };

  return { token, login, logout, isAuthenticated: !!token };
}
