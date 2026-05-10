import { Calendar, Clock, ChevronRight, XCircle, Radio } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ApiBooking } from "@/services/api";

type BookingStatus = "upcoming" | "in-queue" | "completed" | "cancelled";

const STATUS_CONFIG: Record<BookingStatus, { label: string; color: string; bg: string }> = {
  upcoming:   { label: "Upcoming",  color: "text-blue-600",    bg: "bg-blue-50"    },
  "in-queue": { label: "In Queue",  color: "text-amber-600",   bg: "bg-amber-50"   },
  completed:  { label: "Completed", color: "text-emerald-600", bg: "bg-emerald-50" },
  cancelled:  { label: "Cancelled", color: "text-slate-500",   bg: "bg-slate-100"  },
};

interface BookingCardProps {
  booking: ApiBooking;
  businessName: string;
  serviceName?: string;
  onViewDetails: () => void;
  onCancel: (id: string) => void;
  onViewQueue: () => void;
}

export function BookingCard({ booking, businessName, serviceName, onViewDetails, onCancel, onViewQueue }: BookingCardProps) {
  const status = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.upcoming;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
      <div className="flex items-start gap-3 p-4">
        {booking.businessImageUrl && (
          <img src={booking.businessImageUrl} alt={businessName} className="w-14 h-14 rounded-xl object-cover shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-bold text-sm truncate">{businessName}</p>
              {serviceName && <p className="text-xs text-slate-400 truncate mt-0.5">{serviceName}</p>}
            </div>
            <span className={cn("text-xs font-bold px-2.5 py-1 rounded-full shrink-0", status.color, status.bg)}>
              {status.label}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 flex-wrap">
            <span className="flex items-center gap-1">
              <Calendar size={11} />{new Date(booking.date + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
            </span>
            <span className="flex items-center gap-1"><Clock size={11} />{booking.time}</span>
            <span className="font-mono text-indigo-500 font-bold">{booking.token}</span>
          </div>
        </div>
      </div>

      {booking.status === "in-queue" && booking.queuePosition != null && (
        <div className="mx-4 mb-4 bg-amber-50 rounded-xl p-3 border border-amber-100">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-amber-500 animate-ping opacity-75" />
              </div>
              <p className="text-xs font-bold text-amber-700">Live Queue</p>
            </div>
            {booking.estimatedWait != null && (
              <span className="text-xs text-amber-600 font-semibold">~{booking.estimatedWait} min wait</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-amber-100 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${Math.max(10, 100 - ((booking.queuePosition! / (booking.totalQueue ?? 10)) * 100))}%` }} />
            </div>
            <span className="text-xs text-amber-700 font-bold whitespace-nowrap">#{booking.queuePosition} / {booking.totalQueue}</span>
          </div>
        </div>
      )}

      <div className="flex border-t border-slate-50 divide-x divide-slate-50">
        <button onClick={onViewDetails} className="flex-1 py-3 text-xs font-semibold text-slate-600 flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-colors">
          Details <ChevronRight size={13} />
        </button>
        {booking.status === "in-queue" && (
          <button onClick={onViewQueue} className="flex-1 py-3 text-xs font-bold text-amber-600 flex items-center justify-center gap-1.5 hover:bg-amber-50 transition-colors">
            <Radio size={13} className="animate-pulse" /> Track Queue
          </button>
        )}
        {booking.status === "upcoming" && (
          <button onClick={() => onCancel(booking.id)} className="flex-1 py-3 text-xs font-semibold text-red-500 flex items-center justify-center gap-1.5 hover:bg-red-50 transition-colors">
            <XCircle size={13} /> Cancel
          </button>
        )}
      </div>
    </div>
  );
}
