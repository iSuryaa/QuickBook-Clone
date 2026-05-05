import { X, Calendar, Clock, Users, MapPin, Ticket, CheckCircle2, XCircle, Radio } from "lucide-react";
import { cn } from "@/lib/utils";
import { BUSINESSES, type Booking } from "@/data/mock";

interface BookingDetailSheetProps {
  booking: Booking;
  businessName: string;
  businessAddress?: string;
  onClose: () => void;
  onCancel: (id: string) => void;
  onViewQueue: () => void;
}

const STATUS_CONFIG = {
  upcoming:   { label: "Upcoming",  color: "text-blue-600",    bg: "bg-blue-50"     },
  "in-queue": { label: "In Queue",  color: "text-amber-600",   bg: "bg-amber-50"    },
  completed:  { label: "Completed", color: "text-emerald-600", bg: "bg-emerald-50"  },
  cancelled:  { label: "Cancelled", color: "text-slate-500",   bg: "bg-slate-100"   },
};

export function BookingDetailSheet({ booking, businessName, businessAddress, onClose, onCancel, onViewQueue }: BookingDetailSheetProps) {
  const business = BUSINESSES.find(b => b.id === booking.businessId);
  const service = business?.services.find(s => s.id === booking.serviceId);
  const staff = business?.staff.find(s => s.id === booking.staffId);
  const status = STATUS_CONFIG[booking.status];

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
          {business && (
            <div className="flex items-center gap-3">
              <img src={business.imageUrl} alt={business.name} className="w-16 h-16 rounded-2xl object-cover" />
              <div>
                <p className="font-bold text-base">{businessName}</p>
                {businessAddress && <p className="text-xs text-slate-400 mt-0.5">{businessAddress}</p>}
              </div>
            </div>
          )}

          <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100 text-center">
            <p className="text-xs text-indigo-500 font-semibold mb-1">Booking Token</p>
            <p className="text-3xl font-black text-indigo-600 tracking-widest">{booking.token}</p>
            <p className="text-xs text-indigo-400 mt-1">Show this at the venue</p>
          </div>

          <div className="bg-slate-50 rounded-2xl border border-slate-100 divide-y divide-slate-100">
            {service && <DetailRow icon={<Ticket size={14} className="text-indigo-400" />} label="Service" value={service.name} />}
            {staff && <DetailRow icon={<Users size={14} className="text-indigo-400" />} label="Staff" value={staff.name} />}
            <DetailRow icon={<Calendar size={14} className="text-indigo-400" />} label="Date" value={new Date(booking.date + "T00:00:00").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} />
            <DetailRow icon={<Clock size={14} className="text-indigo-400" />} label="Time" value={booking.time} />
            <DetailRow icon={<Users size={14} className="text-indigo-400" />} label="People" value={`${booking.persons}`} />
          </div>

          {booking.status === "in-queue" && (
            <button onClick={onViewQueue} className="w-full h-14 bg-amber-500 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-amber-200 active:scale-[0.98] transition-transform">
              <Radio size={16} className="animate-pulse" /> Track Live Queue
            </button>
          )}

          {booking.status === "upcoming" && (
            <button onClick={() => { onCancel(booking.id); onClose(); }} className="w-full py-3.5 rounded-2xl font-semibold text-sm text-red-500 border border-red-100 bg-red-50 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
              <XCircle size={16} /> Cancel Booking
            </button>
          )}

          <button onClick={onClose} className="w-full py-3.5 rounded-2xl font-semibold text-sm text-slate-600 bg-slate-100 active:scale-[0.98] transition-transform">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <span className="shrink-0">{icon}</span>
      <span className="text-sm text-slate-400 w-20 shrink-0">{label}</span>
      <span className="text-sm font-semibold text-slate-700 flex-1 text-right">{value}</span>
    </div>
  );
}
