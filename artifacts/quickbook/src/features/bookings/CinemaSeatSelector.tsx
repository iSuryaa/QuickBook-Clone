import { useMemo } from "react";
import { cn } from "@/lib/utils";

export interface SeatCategory {
  id: "recliner" | "premium" | "standard";
  label: string;
  price: number;
  labelColor: string;
  availableStyle: string;
  selectedStyle: string;
  legendColor: string;
  rows: string[];
}

export const SEAT_CATEGORIES: SeatCategory[] = [
  {
    id: "recliner",
    label: "RECLINER",
    price: 45000,
    labelColor: "text-violet-500",
    availableStyle: "bg-white border-violet-300 text-violet-600",
    selectedStyle: "bg-violet-500 border-violet-500 text-white",
    legendColor: "bg-violet-500",
    rows: ["A", "B"],
  },
  {
    id: "premium",
    label: "PREMIUM",
    price: 30000,
    labelColor: "text-blue-500",
    availableStyle: "bg-white border-blue-300 text-blue-600",
    selectedStyle: "bg-blue-500 border-blue-500 text-white",
    legendColor: "bg-blue-500",
    rows: ["C", "D", "E", "F"],
  },
  {
    id: "standard",
    label: "STANDARD",
    price: 20000,
    labelColor: "text-teal-500",
    availableStyle: "bg-white border-teal-300 text-teal-600",
    selectedStyle: "bg-teal-500 border-teal-500 text-white",
    legendColor: "bg-teal-500",
    rows: ["G", "H", "I", "J"],
  },
];

const COLS = 12;

const BOOKED_SEATS = new Set([
  "A2","A5","A10",
  "B5","B9","B10","B11",
  "C4","C8","C11","D2","D3","D5","D10","E5","E6","F3","F9","F10",
  "G3","G7","G8","H4","H5","H10","H11","I3","I4","I7","J7","J8",
]);

interface CinemaSeatSelectorProps {
  selected: string[];
  maxSeats: number;
  onSelectionChange: (seats: string[]) => void;
}

export function CinemaSeatSelector({ selected, maxSeats, onSelectionChange }: CinemaSeatSelectorProps) {
  const toggle = (seatId: string) => {
    if (BOOKED_SEATS.has(seatId)) return;
    if (selected.includes(seatId)) {
      onSelectionChange(selected.filter(s => s !== seatId));
    } else if (selected.length < maxSeats) {
      onSelectionChange([...selected, seatId]);
    }
  };

  return (
    <div className="flex flex-col gap-0">
      {/* Screen */}
      <div className="flex flex-col items-center mb-3">
        <div
          className="w-40 h-3 rounded-t-full opacity-40"
          style={{ background: "linear-gradient(to right, #818cf8, #a78bfa, #818cf8)", filter: "blur(2px)" }}
        />
        <div className="w-32 h-0.5 bg-slate-300 rounded-full" />
        <p className="text-[9px] font-black tracking-[0.35em] text-slate-400 mt-1.5">SCREEN</p>
      </div>

      {/* Seat rows by category */}
      {SEAT_CATEGORIES.map((cat, catIdx) => (
        <div key={cat.id}>
          {/* Category header */}
          <div className={cn("flex items-center justify-center gap-1.5 py-1.5", catIdx > 0 && "mt-1")}>
            <div className={cn("w-2 h-2 rounded-full", cat.legendColor)} />
            <span className={cn("text-[10px] font-black tracking-widest", cat.labelColor)}>
              {cat.label} • ₹{cat.price / 100}
            </span>
          </div>

          {/* Rows */}
          {cat.rows.map(row => (
            <div key={row} className="flex items-center gap-1 px-1 py-0.5">
              {/* Left label */}
              <span className="text-[10px] font-semibold text-slate-400 w-4 text-center shrink-0">{row}</span>

              {/* Seats */}
              <div className="flex gap-[3px] flex-1 justify-center">
                {Array.from({ length: COLS }, (_, ci) => {
                  const col = ci + 1;
                  const seatId = `${row}${col}`;
                  const isBooked = BOOKED_SEATS.has(seatId);
                  const isSelected = selected.includes(seatId);
                  return (
                    <button
                      key={col}
                      onClick={() => toggle(seatId)}
                      disabled={isBooked}
                      title={seatId}
                      className={cn(
                        "w-6 h-6 rounded-md border text-[8px] font-bold flex items-center justify-center transition-all shrink-0",
                        isBooked
                          ? "bg-slate-200 border-slate-200 text-slate-300 cursor-not-allowed"
                          : isSelected
                            ? cat.selectedStyle
                            : cn(cat.availableStyle, "hover:opacity-70 active:scale-90 cursor-pointer")
                      )}
                    >
                      {col}
                    </button>
                  );
                })}
              </div>

              {/* Right label */}
              <span className="text-[10px] font-semibold text-slate-400 w-4 text-center shrink-0">{row}</span>
            </div>
          ))}
        </div>
      ))}

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-slate-100 flex-wrap">
        {SEAT_CATEGORIES.map(cat => (
          <div key={cat.id} className="flex items-center gap-1.5">
            <div className={cn("w-3 h-3 rounded-sm", cat.legendColor)} />
            <span className="text-[10px] text-slate-500 font-medium">
              {cat.id === "recliner" ? "Recliner" : cat.id === "premium" ? "Premium" : "Standard"} ₹{cat.price / 100}
            </span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-slate-200" />
          <span className="text-[10px] text-slate-500 font-medium">Taken</span>
        </div>
      </div>
    </div>
  );
}

export function getSeatPrice(seatId: string): number {
  const row = seatId.charAt(0);
  const cat = SEAT_CATEGORIES.find(c => c.rows.includes(row));
  return cat?.price ?? 20000;
}

export function getSeatCategory(seatId: string): SeatCategory | undefined {
  const row = seatId.charAt(0);
  return SEAT_CATEGORIES.find(c => c.rows.includes(row));
}
