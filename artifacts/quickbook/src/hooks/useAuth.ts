import { useState, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, type ApiUser } from "@/services/api";

const STORAGE_KEY = "qb_token";
const USER_KEY = "qb_user";

export function getStoredToken(): string | null {
  return localStorage.getItem(STORAGE_KEY);
}

export function getStoredUser(): ApiUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function useAuthState() {
  const [user, setUserState] = useState<ApiUser | null>(getStoredUser);
  const [token, setToken] = useState<string | null>(getStoredToken);

  const setAuth = useCallback((newToken: string, newUser: ApiUser) => {
    localStorage.setItem(STORAGE_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    setToken(newToken);
    setUserState(newUser);
  }, []);

  const updateUser = useCallback((u: ApiUser) => {
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    setUserState(u);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUserState(null);
  }, []);

  return { user, token, isLoggedIn: !!token && !!user, setAuth, updateUser, logout };
}

export function useSendOtp() {
  return useMutation({
    mutationFn: (phone: string) => api.sendOtp(phone),
  });
}

export function useVerifyOtp() {
  return useMutation({
    mutationFn: ({ phone, code }: { phone: string; code: string }) =>
      api.verifyOtp(phone, code),
  });
}

export function useUpdateProfile() {
  return useMutation({
    mutationFn: (data: { name: string; email?: string }) => api.updateProfile(data),
  });
}

export function useMe(enabled: boolean) {
  return useQuery({
    queryKey: ["me"],
    queryFn: api.getMe,
    enabled,
    staleTime: 5 * 60_000,
  });
}
