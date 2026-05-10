import { X, MapPin, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const CITIES = [
  { name: "Mumbai", emoji: "🌊" },
  { name: "Delhi", emoji: "🏛️" },
  { name: "Bengaluru", emoji: "🌿" },
  { name: "Hyderabad", emoji: "🍖" },
  { name: "Chennai", emoji: "🎭" },
  { name: "Pune", emoji: "🎓" },
  { name: "Kolkata", emoji: "🎨" },
  { name: "Gurugram", emoji: "🏢" },
];

interface CitySelectorProps {
  selected: string;
  onSelect: (city: string) => void;
  onClose: () => void;
}

export function CitySelector({ selected, onSelect, onClose }: CitySelectorProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 animate-fade-in" onClick={onClose}>
      <div
        className="bg-white w-full max-w-[480px] md:max-w-md rounded-t-3xl md:rounded-3xl animate-slide-up md:mx-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center px-5 pt-5 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 flex-1">
            <MapPin size={16} className="text-indigo-500" />
            <h2 className="font-bold">Select City</h2>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 grid grid-cols-2 gap-3 pb-6">
          {CITIES.map(({ name, emoji }) => (
            <button
              key={name}
              onClick={() => { onSelect(name); onClose(); }}
              className={cn(
                "flex items-center gap-3 p-4 rounded-2xl border text-left transition-all active:scale-[0.98]",
                selected === name
                  ? "bg-indigo-50 border-indigo-300 shadow-sm shadow-indigo-100"
                  : "bg-slate-50 border-slate-100 hover:border-slate-200"
              )}
            >
              <span className="text-2xl">{emoji}</span>
              <span className={cn("flex-1 font-semibold text-sm", selected === name ? "text-indigo-700" : "text-slate-700")}>
                {name}
              </span>
              {selected === name && <Check size={15} className="text-indigo-500 shrink-0" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
