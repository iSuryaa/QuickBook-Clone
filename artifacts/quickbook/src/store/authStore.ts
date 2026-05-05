import { useState, useEffect } from "react";

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
}

const STORAGE_KEY = "qb_user";

function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function useAuthStore() {
  const [user, setUser] = useState<User | null>(getStoredUser);

  const login = (u: User) => {
    setUser(u);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return { user, isLoggedIn: !!user, login, logout };
}
