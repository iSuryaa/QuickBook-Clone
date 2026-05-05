import { useState, useEffect } from "react";
import { X, MapPin, Clock, Users, Radio, CheckCircle2, Phone, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";

interface QueueTrackerSheetProps {
  bookingId: string;
  businessName: string;
  businessAddress?: string;
  onClose: () => void;
}

export function QueueTrackerSheet({ bookingId, businessName, businessAddress, onClose }: QueueTrackerSheetProps) {
  const [position, setPosition] = useState(4);
  const total = 14;
  const estimatedWait = position * 5 + 2;

  useEffect(() => {
    const t = setInterval(() => {
      setPosition(p => Math.max(1, p - 1));
    }, 8000);
    return () => clearInterval(t);
  }, []);

  const progress = Math.max(10, ((total - position) / total) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 animate-fade-in" onClick={onClose}>
      <div className="bg-white w-full max-w-[540px] rounded-t-3xl max-h-[90vh] overflow-y-auto animate-slide-up pb-safe" onClick={e => e.stopPropagation()}>
        <div className="flex items-center px-5 pt-5 pb-4 border-b border-slate-100">
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center mr-3">
            <X size={18} />
          </button>
          <div className="flex-1">
            <p className="text-xs text-slate-400">{businessName}</p>
            <h2 className="font-bold text-base">Live Queue Tracker</h2>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <div className="absolute w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-bold text-emerald-600">Live</span>
          </div>
        </div>

        <div className="px-5 py-6 flex flex-col gap-5">
          <div className="bg-gradient-to-br from-indigo-500 to-violet-600 rounded-3xl p-6 text-white text-center">
            <p className="text-sm font-semibold opacity-75 mb-1">Your position</p>
            <p className="text-7xl font-black mb-1">#{position}</p>
            <p className="text-sm opacity-75">out of {total} in queue</p>
            <div className="mt-4 bg-white/20 rounded-full h-2.5 overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <StatCard icon={<Clock size={18} className="text-amber-500" />} label="Est. wait" value={`~${estimatedWait} min`} bg="bg-amber-50" />
            <StatCard icon={<Users size={18} className="text-blue-500" />} label="Ahead of you" value={`${position - 1} people`} bg="bg-blue-50" />
          </div>

          {businessAddress && (
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-start gap-3">
              <MapPin size={16} className="text-indigo-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-600">{businessAddress}</p>
                <p className="text-xs text-slate-400 mt-0.5">Head over when your position reaches #1–2</p>
              </div>
              <button className="shrink-0 w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
                <Navigation size={15} className="text-indigo-500" />
              </button>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-slate-100 p-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Queue Timeline</p>
            <div className="flex flex-col gap-0">
              {Array.from({length: Math.min(total, 8)}).map((_, i) => {
                const pos = i + 1;
                const isPast = pos < position;
                const isCurrent = pos === position;
                const isFuture = pos > position;
                return (
                  <div key={pos} className="flex items-center gap-3">
                    <div className="flex flex-col items-center">
                      <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold z-10",
                        isPast ? "bg-emerald-100 text-emerald-600" :
                        isCurrent ? "bg-indigo-500 text-white shadow-md shadow-indigo-200" :
                        "bg-slate-100 text-slate-400"
                      )}>
                        {isPast ? <CheckCircle2 size={13} /> : pos}
                      </div>
                      {pos < Math.min(total, 8) && (
                        <div className={cn("w-0.5 h-5", isPast ? "bg-emerald-200" : "bg-slate-100")} />
                      )}
                    </div>
                    <div className={cn("py-1.5 text-sm flex-1", isCurrent ? "font-bold text-indigo-600" : isPast ? "text-slate-400 line-through" : "text-slate-500")}>
                      {isCurrent ? (
                        <span className="flex items-center gap-2">
                          You are here
                          <span className="text-[10px] bg-indigo-100 text-indigo-500 font-bold px-2 py-0.5 rounded-full">YOUR TURN</span>
                        </span>
                      ) : isPast ? `Customer #${pos}` : `Customer #${pos}`}
                    </div>
                  </div>
                );
              })}
              {total > 8 && <p className="text-xs text-slate-400 mt-2 pl-10">+{total - 8} more in queue</p>}
            </div>
          </div>

          <div className="bg-indigo-50 rounded-2xl p-4 flex items-start gap-3 border border-indigo-100">
            <Radio size={16} className="text-indigo-500 shrink-0 mt-0.5 animate-pulse" />
            <p className="text-xs text-indigo-700 leading-relaxed">
              Queue updates automatically every few seconds. You'll be notified when it's almost your turn.
            </p>
          </div>

          <button onClick={onClose} className="w-full h-14 bg-slate-100 text-slate-700 rounded-2xl font-bold text-sm active:scale-[0.98] transition-transform">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, bg }: { icon: React.ReactNode; label: string; value: string; bg: string }) {
  return (
    <div className={cn("rounded-2xl p-4 flex flex-col gap-2", bg)}>
      {icon}
      <p className="text-xs text-slate-500 font-medium">{label}</p>
      <p className="font-black text-base text-slate-800">{value}</p>
    </div>
  );
}
