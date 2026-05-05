import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Armchair } from "lucide-react";

export interface SeatCategory {
  id: "recliner" | "premium" | "standard";
  label: string;
  price: number;
  color: string;
  selectedColor: string;
  rows: string[];
}

export const SEAT_CATEGORIES: SeatCategory[] = [
  { id: "recliner", label: "RECLINER", price: 45000, color: "border-violet-400 text-violet-600", selectedColor: "bg-violet-500 border-violet-500 text-white", rows: ["A", "B"] },
  { id: "premium", label: "PREMIUM",  price: 30000, color: "border-blue-400 text-blue-600",   selectedColor: "bg-blue-500 border-blue-500 text-white",   rows: ["C", "D", "E", "F", "G"] },
  { id: "standard", label: "STANDARD", price: 20000, color: "border-teal-400 text-teal-600",   selectedColor: "bg-teal-500 border-teal-500 text-white",   rows: ["H", "I", "J"] },
];

const COLS = 12;

function useBooked() {
  return useMemo(() => {
    const booked = new Set<string>();
    const seed = [
      "A2","A5","A10","B5","B9","B10","B11",
      "C4","C8","C11","D2","D3","D5","D10","E1","E6","E11","F5","F6","G3","G9","G10",
      "H5","H11","H12","I3","I4","I5","J7","J8"
    ];
    seed.forEach(s => booked.add(s));
    return booked;
  }, []);
}

interface CinemaSeatSelectorProps {
  selected: string[];
  maxSeats: number;
  onSelectionChange: (seats: string[]) => void;
}

export function CinemaSeatSelector({ selected, maxSeats, onSelectionChange }: CinemaSeatSelectorProps) {
  const booked = useBooked();

  const toggle = (seatId: string) => {
    if (booked.has(seatId)) return;
    if (selected.includes(seatId)) {
      onSelectionChange(selected.filter(s => s !== seatId));
    } else if (selected.length < maxSeats) {
      onSelectionChange([...selected, seatId]);
    }
  };

  const getCategoryForRow = (row: string) =>
    SEAT_CATEGORIES.find(c => c.rows.includes(row))!;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center mb-1">
        <div className="w-48 h-2 bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-400 rounded-full blur-sm opacity-80" />
        <div className="w-36 h-1 bg-slate-300 rounded-full mt-1" />
        <p className="text-[10px] font-black tracking-[0.3em] text-slate-400 mt-2">SCREEN</p>
      </div>

      {SEAT_CATEGORIES.map(cat => (
        <div key={cat.id}>
          <p className={`text-center text-xs font-black tracking-widest mb-2 ${cat.selectedColor.includes("violet") ? "text-violet-500" : cat.selectedColor.includes("blue") ? "text-blue-500" : "text-teal-500"}`}>
            {cat.label} • {cat.price === 45000 ? "₹450" : cat.price === 30000 ? "₹300" : "₹200"}
          </p>
          <div className="flex flex-col gap-1.5">
            {cat.rows.map(row => (
              <div key={row} className="flex items-center gap-1">
                <span className="text-[10px] font-bold text-slate-400 w-4 shrink-0 text-right">{row}</span>
                <div className="flex gap-1 flex-1 justify-center flex-wrap">
                  {Array.from({ length: COLS }, (_, ci) => {
                    const col = ci + 1;
                    const seatId = `${row}${col}`;
                    const isBooked = booked.has(seatId);
                    const isSelected = selected.includes(seatId);
                    return (
                      <button
                        key={col}
                        onClick={() => toggle(seatId)}
                        disabled={isBooked}
                        className={cn(
                          "w-7 h-7 rounded-lg border-2 text-[9px] font-bold transition-all flex items-center justify-center active:scale-90",
                          isBooked
                            ? "bg-slate-200 border-slate-200 text-slate-400 cursor-not-allowed"
                            : isSelected
                              ? cat.selectedColor
                              : `bg-white ${cat.color} hover:opacity-80`
                        )}
                      >
                        {col}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex items-center justify-center gap-6 mt-2 border-t border-slate-100 pt-4">
        <Legend color="bg-slate-200 border-slate-200" label="Booked" />
        <Legend color="bg-white border-violet-400" label="Available" />
        <Legend color="bg-violet-500 border-violet-500" label="Selected" />
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-4 h-4 rounded border-2 ${color}`} />
      <span className="text-xs text-slate-500">{label}</span>
    </div>
  );
}

export function getSeatPrice(seatId: string): number {
  const row = seatId.charAt(0);
  const cat = SEAT_CATEGORIES.find(c => c.rows.includes(row));
  return cat?.price ?? 20000;
}
