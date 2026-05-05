import { useState, useEffect } from "react";
import { CalendarDays } from "lucide-react";
import { BookingCard } from "@/features/bookings/BookingCard";
import { BookingDetailSheet } from "@/features/bookings/BookingDetailSheet";
import { BookingCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { BUSINESSES, type Booking, type BookingStatus } from "@/data/mock";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/Toast";

const TABS: { id: "all" | BookingStatus; label: string }[] = [
  { id: "all", label: "All" },
  { id: "upcoming", label: "Upcoming" },
  { id: "in-queue", label: "In Queue" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

interface BookingsTabProps {
  isLoggedIn: boolean;
  bookings: Booking[];
  onGoHome: () => void;
  onViewQueue: (bookingId: string, businessName: string, businessAddress?: string) => void;
  onCancel: (id: string) => void;
}

export function BookingsTab({ isLoggedIn, bookings, onGoHome, onViewQueue, onCancel }: BookingsTabProps) {
  const [activeFilter, setActiveFilter] = useState<"all" | BookingStatus>("all");
  const [loading, setLoading] = useState(true);
  const [detailBooking, setDetailBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="pt-12 px-4 md:px-6">
        <h1 className="text-2xl font-black mb-6">My Bookings</h1>
        <EmptyState
          icon={CalendarDays}
          title="Sign in to view bookings"
          description="Your appointments and queue status will appear here."
          action={{ label: "Sign in", onClick: onGoHome }}
        />
      </div>
    );
  }

  const filtered = activeFilter === "all" ? bookings : bookings.filter(b => b.status === activeFilter);

  const getBizName = (businessId: string) => BUSINESSES.find(b => b.id === businessId)?.name ?? businessId;
  const getBizAddress = (businessId: string) => BUSINESSES.find(b => b.id === businessId)?.address;
  const getServiceName = (businessId: string, serviceId: string) => {
    const biz = BUSINESSES.find(b => b.id === businessId);
    return biz?.services.find(s => s.id === serviceId)?.name ?? serviceId;
  };

  const handleCancel = (id: string) => {
    onCancel(id);
    toast("Booking cancelled", "success");
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
        {loading
          ? Array.from({ length: 2 }).map((_, i) => <BookingCardSkeleton key={i} />)
          : filtered.length === 0
            ? <EmptyState icon={CalendarDays} title="No bookings here" description="Your bookings will appear once you schedule an appointment." action={{ label: "Explore businesses", onClick: onGoHome }} />
            : filtered.map((b, i) => (
                <div key={b.id} className="animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
                  <BookingCard
                    booking={b}
                    businessName={getBizName(b.businessId)}
                    serviceName={getServiceName(b.businessId, b.serviceId)}
                    onViewDetails={() => setDetailBooking(b)}
                    onCancel={handleCancel}
                    onViewQueue={() => onViewQueue(b.id, getBizName(b.businessId), getBizAddress(b.businessId))}
                  />
                </div>
              ))
        }
      </div>

      {detailBooking && (
        <BookingDetailSheet
          booking={detailBooking}
          businessName={getBizName(detailBooking.businessId)}
          businessAddress={getBizAddress(detailBooking.businessId)}
          onClose={() => setDetailBooking(null)}
          onCancel={handleCancel}
          onViewQueue={() => {
            setDetailBooking(null);
            onViewQueue(detailBooking.id, getBizName(detailBooking.businessId), getBizAddress(detailBooking.businessId));
          }}
        />
      )}
    </div>
  );
}
