import { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Clock, Users, Radio, CheckCircle2, Navigation, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";

interface QueueTrackerSheetProps {
  bookingId: string;
  businessName: string;
  businessAddress?: string;
  initialPosition?: number;
  totalInQueue?: number;
  onClose: () => void;
}

export function QueueTrackerSheet({ bookingId, businessName, businessAddress, initialPosition = 5, totalInQueue, onClose }: QueueTrackerSheetProps) {
  const total = totalInQueue ?? Math.max(initialPosition + 9, 14);
  const [position, setPosition] = useState(initialPosition);
  const estimatedWait = position * 5 + 2;
  const token = bookingId.replace("bk_", "Q-").slice(0, 10);

  useEffect(() => {
    const t = setInterval(() => {
      setPosition(p => Math.max(1, p - 1));
    }, 8000);
    return () => clearInterval(t);
  }, []);

  const progress = Math.max(8, ((total - position) / total) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 animate-fade-in" onClick={onClose}>
    <div className="w-full md:max-w-lg bg-white md:rounded-3xl max-h-[94vh] flex flex-col animate-slide-up overflow-hidden md:mx-4" onClick={e => e.stopPropagation()}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 bg-white shrink-0">
        <button onClick={onClose} className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-400 truncate">{businessName}</p>
          <h2 className="font-bold text-base leading-tight">Live Queue Tracker</h2>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="relative">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span className="text-xs font-bold text-emerald-600">Live</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 flex flex-col gap-4">

        {/* Position card */}
        <div className="bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl p-5 text-white text-center shadow-lg shadow-indigo-200">
          <p className="text-sm font-semibold opacity-75 mb-1">Your position</p>
          <p className="text-6xl font-black mb-1 tracking-tight">#{position}</p>
          <p className="text-sm opacity-70">out of {total} in queue</p>
          <div className="mt-4 bg-white/20 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs opacity-60 mt-2">{Math.round(progress)}% ahead of you</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-amber-50 rounded-xl p-3 flex items-center gap-2.5 border border-amber-100">
            <Clock size={18} className="text-amber-500 shrink-0" />
            <div>
              <p className="text-xs text-slate-500">Est. wait</p>
              <p className="font-black text-sm text-slate-800">~{estimatedWait} min</p>
            </div>
          </div>
          <div className="bg-blue-50 rounded-xl p-3 flex items-center gap-2.5 border border-blue-100">
            <Users size={18} className="text-blue-500 shrink-0" />
            <div>
              <p className="text-xs text-slate-500">Ahead</p>
              <p className="font-black text-sm text-slate-800">{Math.max(0, position - 1)} people</p>
            </div>
          </div>
        </div>

        {/* Token */}
        <div className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3">
          <Ticket size={18} className="text-indigo-400 shrink-0" />
          <div className="flex-1">
            <p className="text-xs text-slate-400">Your queue token</p>
            <p className="font-black text-lg text-indigo-500 tracking-widest">{token.toUpperCase()}</p>
          </div>
          <p className="text-xs text-slate-400">Show at counter</p>
        </div>

        {/* Address */}
        {businessAddress && (
          <div className="bg-slate-50 rounded-xl border border-slate-100 p-3 flex items-start gap-3">
            <MapPin size={15} className="text-indigo-400 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-600 font-medium leading-snug">{businessAddress}</p>
              <p className="text-xs text-slate-400 mt-0.5">Head over when position reaches #1–2</p>
            </div>
            <button className="shrink-0 w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
              <Navigation size={14} className="text-indigo-500" />
            </button>
          </div>
        )}

        {/* Timeline */}
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Queue Timeline</p>
          <div className="flex flex-col gap-0">
            {Array.from({ length: Math.min(total, 7) }).map((_, i) => {
              const pos = i + 1;
              const isPast = pos < position;
              const isCurrent = pos === position;
              return (
                <div key={pos} className="flex items-center gap-2.5">
                  <div className="flex flex-col items-center shrink-0">
                    <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold z-10",
                      isPast ? "bg-emerald-100 text-emerald-600" :
                      isCurrent ? "bg-indigo-500 text-white shadow-sm shadow-indigo-200" :
                      "bg-slate-100 text-slate-400"
                    )}>
                      {isPast ? <CheckCircle2 size={12} /> : pos}
                    </div>
                    {pos < Math.min(total, 7) && (
                      <div className={cn("w-0.5 h-4", isPast ? "bg-emerald-200" : "bg-slate-100")} />
                    )}
                  </div>
                  <div className={cn("py-0.5 text-sm flex-1",
                    isCurrent ? "font-bold text-indigo-600" :
                    isPast ? "text-slate-300 line-through" :
                    "text-slate-400"
                  )}>
                    {isCurrent ? (
                      <span className="flex items-center gap-2">
                        You are here
                        <span className="text-[9px] bg-indigo-100 text-indigo-500 font-bold px-1.5 py-0.5 rounded-full">YOUR TURN</span>
                      </span>
                    ) : `Customer #${pos}`}
                  </div>
                </div>
              );
            })}
            {total > 7 && <p className="text-xs text-slate-400 mt-1 pl-8">+{total - 7} more in queue</p>}
          </div>
        </div>

        {/* Live notice */}
        <div className="bg-indigo-50 rounded-xl border border-indigo-100 p-3 flex items-start gap-2.5">
          <Radio size={14} className="text-indigo-500 shrink-0 mt-0.5 animate-pulse" />
          <p className="text-xs text-indigo-700 leading-relaxed">
            Queue updates every few seconds. You'll be notified when it's almost your turn.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full h-12 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm active:scale-[0.98] transition-transform"
        >
          Close
        </button>

        <div className="h-2" />
      </div>
    </div>
    </div>
  );
}
