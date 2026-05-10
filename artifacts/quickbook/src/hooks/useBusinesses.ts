import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";

export function useBusinesses(params?: { category?: string; search?: string }) {
  return useQuery({
    queryKey: ["businesses", params?.category, params?.search],
    queryFn: () => api.getBusinesses(params),
    staleTime: 60_000,
  });
}

export function useBusinessById(id: string | null) {
  return useQuery({
    queryKey: ["business", id],
    queryFn: () => api.getBusinessById(id!),
    enabled: !!id,
    staleTime: 60_000,
  });
}

export function useSlots(businessId: string | null, date: string) {
  return useQuery({
    queryKey: ["slots", businessId, date],
    queryFn: () => api.getSlots(businessId!, date),
    enabled: !!businessId && !!date,
    staleTime: 30_000,
  });
}
