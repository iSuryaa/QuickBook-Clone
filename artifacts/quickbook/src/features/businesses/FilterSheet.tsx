import { X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export interface Filters {
  minRating: number;
  maxDistanceKm: number;
  openOnly: boolean;
  priceLevels: number[];
}

interface FilterSheetProps {
  filters: Filters;
  onApply: (f: Filters) => void;
  onClose: () => void;
}

export function FilterSheet({ filters, onApply, onClose }: FilterSheetProps) {
  const [local, setLocal] = useState<Filters>({ ...filters });

  const togglePrice = (p: number) => {
    setLocal(prev => ({
      ...prev,
      priceLevels: prev.priceLevels.includes(p) ? prev.priceLevels.filter(x => x !== p) : [...prev.priceLevels, p],
    }));
  };

  const reset = () => setLocal({ minRating: 0, maxDistanceKm: 10, openOnly: false, priceLevels: [1,2,3,4] });

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 animate-fade-in" onClick={onClose}>
      <div className="bg-white w-full max-w-[540px] md:max-w-md md:rounded-3xl rounded-t-3xl animate-slide-up pb-safe md:mx-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center px-5 pt-5 pb-4 border-b border-slate-100">
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center mr-3">
            <X size={18} />
          </button>
          <h2 className="font-bold flex-1">Filters</h2>
          <button onClick={reset} className="text-xs text-indigo-500 font-semibold">Reset</button>
        </div>

        <div className="px-5 py-5 flex flex-col gap-6 max-h-[60vh] overflow-y-auto">
          <section>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Open Now</p>
            <button
              onClick={() => setLocal(p => ({ ...p, openOnly: !p.openOnly }))}
              className={cn("px-5 py-2.5 rounded-full border text-sm font-semibold transition-all", local.openOnly ? "bg-indigo-500 text-white border-indigo-500" : "bg-white text-slate-600 border-slate-200")}
            >
              Show open only
            </button>
          </section>

          <section>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Minimum Rating</p>
            <div className="flex gap-2">
              {[0, 3, 3.5, 4, 4.5].map(r => (
                <button key={r} onClick={() => setLocal(p => ({ ...p, minRating: r }))}
                  className={cn("px-4 py-2 rounded-full border text-sm font-semibold transition-all", local.minRating === r ? "bg-indigo-500 text-white border-indigo-500" : "bg-white text-slate-600 border-slate-200")}
                >
                  {r === 0 ? "Any" : `${r}+`}
                </button>
              ))}
            </div>
          </section>

          <section>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Max Distance: {local.maxDistanceKm} km</p>
            <input type="range" min={1} max={10} step={1} value={local.maxDistanceKm}
              onChange={e => setLocal(p => ({ ...p, maxDistanceKm: Number(e.target.value) }))}
              className="w-full accent-indigo-500"
            />
          </section>

          <section>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Price Level</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map(p => (
                <button key={p} onClick={() => togglePrice(p)}
                  className={cn("px-4 py-2 rounded-full border text-sm font-semibold transition-all", local.priceLevels.includes(p) ? "bg-indigo-500 text-white border-indigo-500" : "bg-white text-slate-600 border-slate-200")}
                >
                  {"₹".repeat(p)}
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="px-5 py-4 border-t border-slate-100">
          <button onClick={() => { onApply(local); onClose(); }}
            className="w-full h-14 bg-indigo-500 text-white rounded-2xl font-bold text-sm shadow-md shadow-indigo-200 active:scale-[0.98] transition-transform">
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
