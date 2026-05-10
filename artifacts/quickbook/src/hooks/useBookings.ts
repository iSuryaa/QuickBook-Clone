import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, type CreateBookingPayload } from "@/services/api";

export function useSlots(businessId: string, date: string) {
  return useQuery({
    queryKey: ["slots", businessId, date],
    queryFn: () => api.getSlots(businessId, date),
    enabled: !!businessId && !!date,
    staleTime: 60_000,
  });
}

export function useBookings(enabled: boolean) {
  return useQuery({
    queryKey: ["bookings"],
    queryFn: api.getBookings,
    enabled,
    staleTime: 30_000,
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
