import { useState } from "react";
import { CalendarDays } from "lucide-react";
import { BookingCard } from "@/features/bookings/BookingCard";
import { BookingDetailSheet } from "@/features/bookings/BookingDetailSheet";
import { BookingCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { useBookings, useCancelBooking } from "@/hooks/useBookings";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/Toast";
import type { ApiBooking } from "@/services/api";

type StatusFilter = "all" | "upcoming" | "in-queue" | "completed" | "cancelled";

const TABS: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "upcoming", label: "Upcoming" },
  { id: "in-queue", label: "In Queue" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

interface BookingsTabProps {
  isLoggedIn: boolean;
  onGoHome: () => void;
  onViewQueue: (bookingId: string, businessName: string, businessAddress?: string) => void;
  onLogin: () => void;
}

export function BookingsTab({ isLoggedIn, onGoHome, onViewQueue, onLogin }: BookingsTabProps) {
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("all");
  const [detailBooking, setDetailBooking] = useState<ApiBooking | null>(null);

  const { data, isLoading } = useBookings(isLoggedIn);
  const cancelBooking = useCancelBooking();

  if (!isLoggedIn) {
    return (
      <div className="pt-12 px-4 md:px-6">
        <h1 className="text-2xl font-black mb-6">My Bookings</h1>
        <EmptyState
          icon={CalendarDays}
          title="Sign in to view bookings"
          description="Your appointments and queue status will appear here."
          action={{ label: "Sign in", onClick: onLogin }}
        />
      </div>
    );
  }

  const bookings = data?.bookings ?? [];
  const filtered = activeFilter === "all" ? bookings : bookings.filter((b: ApiBooking) => b.status === activeFilter);

  const handleCancel = (id: string) => {
    cancelBooking.mutate(id, {
      onSuccess: (result) => {
        toast(`Cancelled — ${result.message}`, "success");
      },
      onError: (e: any) => toast(e.message ?? "Cancel failed", "error"),
    });
  };

  return (
    <div className="pt-12 px-4 md:px-6">
      <h1 className="text-2xl font-black mb-4">My Bookings</h1>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-5">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveFilter(id)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap border transition-all active:scale-95",
              activeFilter === id ? "bg-indigo-500 text-white border-indigo-500 shadow-sm shadow-indigo-200" : "bg-white text-slate-600 border-slate-200"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4 pb-6">
        {isLoading
          ? Array.from({ length: 2 }).map((_, i) => <BookingCardSkeleton key={i} />)
          : filtered.length === 0
            ? <EmptyState
                icon={CalendarDays}
                title="No bookings here"
                description="Your bookings will appear once you schedule an appointment."
                action={{ label: "Explore businesses", onClick: onGoHome }}
              />
            : filtered.map((b: ApiBooking, i: number) => (
                <div key={b.id} className="animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
                  <BookingCard
                    booking={b}
                    businessName={b.businessName ?? b.businessId}
                    serviceName={b.serviceName ?? ""}
                    onViewDetails={() => setDetailBooking(b)}
                    onCancel={handleCancel}
                    onViewQueue={() => onViewQueue(b.id, b.businessName ?? "", b.businessAddress)}
                  />
                </div>
              ))
        }
      </div>

      {detailBooking && (
        <BookingDetailSheet
          booking={detailBooking}
          businessName={detailBooking.businessName ?? detailBooking.businessId}
          businessAddress={detailBooking.businessAddress}
          onClose={() => setDetailBooking(null)}
          onCancel={handleCancel}
          onViewQueue={() => {
            setDetailBooking(null);
            onViewQueue(detailBooking.id, detailBooking.businessName ?? "", detailBooking.businessAddress);
          }}
        />
      )}
    </div>
  );
}
