import { X, Calendar, Clock, Users, MapPin, Ticket, CheckCircle2, XCircle, Radio } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ApiBooking } from "@/services/api";

interface BookingDetailSheetProps {
  booking: ApiBooking;
  businessName: string;
  businessAddress?: string;
  onClose: () => void;
  onCancel: (id: string) => void;
  onViewQueue: () => void;
}

const STATUS_CONFIG = {
  upcoming:   { label: "Upcoming",  color: "text-blue-600",    bg: "bg-blue-50"    },
  "in-queue": { label: "In Queue",  color: "text-amber-600",   bg: "bg-amber-50"   },
  completed:  { label: "Completed", color: "text-emerald-600", bg: "bg-emerald-50" },
  cancelled:  { label: "Cancelled", color: "text-slate-500",   bg: "bg-slate-100"  },
};

export function BookingDetailSheet({ booking, businessName, businessAddress, onClose, onCancel, onViewQueue }: BookingDetailSheetProps) {
  const status = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.upcoming;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 animate-fade-in" onClick={onClose}>
      <div className="bg-white w-full max-w-[540px] rounded-t-3xl max-h-[90vh] overflow-y-auto animate-slide-up pb-safe" onClick={e => e.stopPropagation()}>
        <div className="flex items-center px-5 pt-5 pb-4 border-b border-slate-100">
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center mr-3">
            <X size={18} />
          </button>
          <h2 className="font-bold flex-1">Booking Details</h2>
          <span className={cn("text-xs font-bold px-3 py-1.5 rounded-full", status.color, status.bg)}>
            {status.label}
          </span>
        </div>

        <div className="px-5 py-5 flex flex-col gap-4">
          {booking.businessImageUrl && (
            <img src={booking.businessImageUrl} alt={businessName} className="w-full h-40 rounded-2xl object-cover" />
          )}

          <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-indigo-400 shrink-0" />
              <div>
                <p className="font-bold text-sm">{businessName}</p>
                {businessAddress && <p className="text-xs text-slate-400 mt-0.5">{businessAddress}</p>}
              </div>
            </div>
            {booking.serviceName && (
              <div className="flex items-center gap-2 border-t border-slate-100 pt-2.5">
                <CheckCircle2 size={14} className="text-indigo-400 shrink-0" />
                <span className="text-sm text-slate-600">{booking.serviceName}</span>
              </div>
            )}
            <div className="flex items-center gap-2 border-t border-slate-100 pt-2.5">
              <Calendar size={14} className="text-indigo-400 shrink-0" />
              <span className="text-sm text-slate-600">
                {new Date(booking.date + "T00:00:00").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </span>
            </div>
            <div className="flex items-center gap-2 border-t border-slate-100 pt-2.5">
              <Clock size={14} className="text-indigo-400 shrink-0" />
              <span className="text-sm text-slate-600">{booking.time}</span>
            </div>
            {booking.persons > 1 && (
              <div className="flex items-center gap-2 border-t border-slate-100 pt-2.5">
                <Users size={14} className="text-indigo-400 shrink-0" />
                <span className="text-sm text-slate-600">{booking.persons} person{booking.persons > 1 ? "s" : ""}</span>
              </div>
            )}
          </div>

          <div className="bg-indigo-50 rounded-2xl border border-indigo-100 p-4 flex items-center gap-3">
            <Ticket size={16} className="text-indigo-500 shrink-0" />
            <div>
              <p className="text-xs text-indigo-500 font-semibold">Booking Token</p>
              <p className="text-xl font-black text-indigo-600 tracking-widest">{booking.token}</p>
            </div>
          </div>

          {booking.seats && booking.seats.length > 0 && (
            <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Selected Seats</p>
              <div className="flex flex-wrap gap-2">
                {booking.seats.map(s => (
                  <span key={s} className="px-2.5 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-700">{s}</span>
                ))}
              </div>
            </div>
          )}

          <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Payment</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Platform fee</span>
              <span className="text-sm font-bold text-indigo-500">₹{(booking.platformFee / 100).toFixed(0)}</span>
            </div>
          </div>

          {booking.status === "in-queue" && (
            <button onClick={onViewQueue} className="flex items-center justify-center gap-2 w-full h-12 bg-amber-500 text-white rounded-xl font-bold text-sm active:scale-[0.98] transition-transform">
              <Radio size={15} className="animate-pulse" /> Track Live Queue
            </button>
          )}
          {booking.status === "upcoming" && (
            <button onClick={() => onCancel(booking.id)} className="flex items-center justify-center gap-2 w-full h-12 bg-red-50 text-red-500 border border-red-100 rounded-xl font-bold text-sm active:scale-[0.98] transition-transform">
              <XCircle size={15} /> Cancel Booking
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
