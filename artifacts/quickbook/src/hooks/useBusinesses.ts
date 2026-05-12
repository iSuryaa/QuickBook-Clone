import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { api } from "@/services/api";
import { BUSINESSES } from "@/data/mock";
import type { ApiBusiness } from "@/services/api";

function mockToApiBusiness(b: typeof BUSINESSES[0]): ApiBusiness {
  return {
    id: b.id,
    name: b.name,
    category: b.category,
    address: b.address,
    imageUrl: b.imageUrl,
    photos: b.photos,
    rating: b.rating,
    reviewCount: b.reviewCount,
    distanceKm: b.distanceKm,
    priceLevel: b.priceLevel as ApiBusiness["priceLevel"],
    openNow: b.openNow,
    waitTimeMinutes: b.waitTimeMinutes,
    queueCount: b.queueCount,
    phone: b.phone ?? null,
    website: b.website ?? null,
    description: b.description,
    hours: b.hours,
    amenities: b.amenities,
    hoursDetail: b.hoursDetail ? JSON.stringify(b.hoursDetail) : null,
  };
}

export function useBusinesses(params?: { category?: string; search?: string }) {
  const query = useQuery({
    queryKey: ["businesses", params?.category, params?.search],
    queryFn: () => api.getBusinesses(params),
    staleTime: 60_000,
    refetchOnWindowFocus: true,
  });

  const mergedData = useMemo(() => {
    const apiBusinesses: ApiBusiness[] = query.data?.businesses ?? [];
    const apiIds = new Set(apiBusinesses.map(b => b.id));

    let mockFallback = BUSINESSES.filter(b => !apiIds.has(b.id));

    if (params?.category && params.category !== "all") {
      mockFallback = mockFallback.filter(b => b.category === params.category);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      mockFallback = mockFallback.filter(b =>
        b.name.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q)
      );
    }

    const converted = mockFallback.map(mockToApiBusiness);
    const businesses = [...apiBusinesses, ...converted];
    return { businesses, total: businesses.length };
  }, [query.data, params?.category, params?.search]);

  return {
    ...query,
    data: mergedData,
  };
}

export function useBusinessById(id: string | null) {
  return useQuery({
    queryKey: ["business", id],
    queryFn: () => api.getBusinessById(id!),
    enabled: !!id,
    staleTime: 60_000,
  });
}

export function useSlots(businessId: string | null, serviceId: string | undefined, date: string) {
  return useQuery({
    queryKey: ["slots", businessId, serviceId, date],
    queryFn: () => api.getSlots(businessId!, date, serviceId),
    enabled: !!businessId && !!serviceId && !!date,
    staleTime: 30_000,
  });
}
