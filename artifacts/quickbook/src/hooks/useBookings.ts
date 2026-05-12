import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, type CreateBookingPayload } from "@/services/api";

export function useSlots(businessId: string, serviceId: string | undefined, date: string) {
  return useQuery({
    queryKey: ["slots", businessId, serviceId, date],
    queryFn: () => api.getSlots(businessId, date, serviceId),
    enabled: !!businessId && !!serviceId && !!date,
    staleTime: 60_000,
  });
}

export function useBookings(enabled: boolean) {
  return useQuery({
    queryKey: ["bookings"],
    queryFn: api.getBookings,
    enabled,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
    refetchInterval: 60_000,
  });
}

export function useCreateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBookingPayload) => api.createBooking(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bookings"] });
      qc.invalidateQueries({ queryKey: ["slots"] });
    },
  });
}

export function useCancelBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.cancelBooking(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

export function useSubmitRating() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { token: string; rating: number; comment?: string }) =>
      api.submitRating(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}
