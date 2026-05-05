import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export function SearchBar({ value, onChange, placeholder = "Search…", className, autoFocus }: SearchBarProps) {
  return (
    <div className={cn("relative", className)}>
      <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full h-12 pl-10 pr-10 rounded-2xl bg-white border border-slate-100 text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm placeholder:text-slate-400"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center"
        >
          <X size={12} className="text-slate-500" />
        </button>
      )}
    </div>
  );
}
