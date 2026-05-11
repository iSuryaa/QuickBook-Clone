import { useMemo } from "react";
import { Bell, MapPin, ChevronRight, ChevronDown, Hospital, Scissors, Building2, Dumbbell, UtensilsCrossed, Ticket, Gamepad2, Pill, AlertCircle } from "lucide-react";
import { SearchBar } from "@/components/ui/SearchBar";
import { BusinessCard } from "@/features/businesses/BusinessCard";
import { BusinessCardSkeleton } from "@/components/ui/Skeleton";
import { useBusinesses } from "@/hooks/useBusinesses";
import type { ApiBusiness } from "@/services/api";

const CATEGORIES = [
  { id: "hospital", name: "Hospital", icon: Hospital, color: "#3b82f6" },
  { id: "salon", name: "Salon & Spa", icon: Scissors, color: "#ec4899" },
  { id: "hotel", name: "Hotel", icon: Building2, color: "#14b8a6" },
  { id: "gym", name: "Gym", icon: Dumbbell, color: "#10b981" },
  { id: "restaurant", name: "Restaurant", icon: UtensilsCrossed, color: "#f59e0b" },
  { id: "entertainment", name: "Cinema", icon: Ticket, color: "#a855f7" },
  { id: "games", name: "Games", icon: Gamepad2, color: "#06b6d4" },
  { id: "pharmacy", name: "Pharmacy", icon: Pill, color: "#22c55e" },
];

interface HomeTabProps {
  onGoExplore: (category?: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onViewBusiness: (id: string) => void;
  onOpenNotifications: () => void;
  onOpenCitySelector: () => void;
  isLoggedIn: boolean;
  userName?: string;
  city: string;
  favIds: string[];
  onToggleFavorite: (id: string) => void;
}

export function HomeTab({ onGoExplore, searchQuery, onSearchChange, onViewBusiness, onOpenNotifications, onOpenCitySelector, isLoggedIn, userName, city, favIds, onToggleFavorite }: HomeTabProps) {
  const { data, isLoading, isError, refetch } = useBusinesses({});

  const businesses = data?.businesses ?? [];
  const featured = businesses.filter((b: ApiBusiness) => b.openNow).slice(0, 6);
  const popular = businesses.filter((b: ApiBusiness) => b.rating >= 4.5).slice(0, 6);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    const base = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
    return isLoggedIn && userName ? `${base}, ${userName.split(" ")[0]}` : base;
  }, [isLoggedIn, userName]);

  return (
    <div className="px-4 md:px-8 pt-5 pb-28">
      <div className="flex items-center justify-between mb-5">
        <div>
          <button
            onClick={onOpenCitySelector}
            className="flex items-center gap-1 text-xs text-slate-500 mb-0.5 hover:text-indigo-500 transition-colors"
          >
            <MapPin size={11} className="text-indigo-400" />
            <span>{city}</span>
            <ChevronDown size={11} className="text-slate-400" />
          </button>
          <h1 className="text-xl md:text-2xl font-black mt-0.5">{greeting}</h1>
        </div>
        <button
          onClick={onOpenNotifications}
          className="relative w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm active:scale-95 transition-transform"
        >
          <Bell size={18} className="text-slate-600" />
        </button>
      </div>

      <SearchBar
        value={searchQuery}
        onChange={v => { onSearchChange(v); if (v) onGoExplore(); }}
        placeholder="Search hospitals, salons, restaurants…"
        className="mb-6 w-full max-w-md md:max-w-xl"
      />

      {/* Categories */}
      <section className="mb-7">
        <h2 className="font-bold text-sm md:text-base mb-3">Categories</h2>
        <div className="relative">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 -mx-4 md:-mx-8 px-4 md:px-8">
            <button
              onClick={() => onGoExplore()}
              className="px-4 py-2 rounded-full text-sm font-semibold bg-indigo-500 text-white whitespace-nowrap shrink-0 active:scale-95 transition-transform"
            >
              All
            </button>
            {CATEGORIES.map(({ id, name, icon: Icon, color }) => (
              <button
                key={id}
                onClick={() => onGoExplore(id)}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-white border border-slate-200 text-slate-700 hover:border-slate-300 whitespace-nowrap shrink-0 active:scale-95 transition-transform"
              >
                <Icon size={14} style={{ color }} />
                {name}
              </button>
            ))}
          </div>
          <div className="absolute right-0 top-0 bottom-2 w-16 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none" />
        </div>
      </section>

      {isError && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-2xl px-4 py-3 mb-5">
          <AlertCircle size={16} className="text-red-400 shrink-0" />
          <p className="text-sm text-red-600 flex-1">Couldn't load listings.</p>
          <button onClick={() => refetch()} className="text-xs font-bold text-red-500 border border-red-200 px-3 py-1 rounded-full">Retry</button>
        </div>
      )}

      {/* Featured */}
      <section className="mb-7">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-bold text-sm md:text-base">Featured for you</h2>
            <div className="h-0.5 w-8 bg-indigo-500 rounded-full mt-1" />
          </div>
          <button onClick={() => onGoExplore()} className="text-xs text-indigo-500 font-semibold flex items-center gap-0.5 hover:text-indigo-600">
            See all <ChevronRight size={13} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => <BusinessCardSkeleton key={i} />)
            : featured.map((b: ApiBusiness, i: number) => (
                <div key={b.id} className="animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                  <BusinessCard business={b} isFavorite={favIds.includes(b.id)} onToggleFavorite={onToggleFavorite} onClick={onViewBusiness} />
                </div>
              ))
          }
        </div>
      </section>

      <div className="h-px bg-slate-100 mb-7" />

      {/* Popular */}
      <section className="mb-7">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-bold text-sm md:text-base">Popular near you</h2>
            <div className="h-0.5 w-8 bg-indigo-500 rounded-full mt-1" />
          </div>
          <button onClick={() => onGoExplore()} className="text-xs text-indigo-500 font-semibold flex items-center gap-0.5 hover:text-indigo-600">
            See all <ChevronRight size={13} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => <BusinessCardSkeleton key={i} />)
            : popular.map((b: ApiBusiness, i: number) => (
                <div key={b.id} className="animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                  <BusinessCard business={b} isFavorite={favIds.includes(b.id)} onToggleFavorite={onToggleFavorite} onClick={onViewBusiness} />
                </div>
              ))
          }
        </div>
      </section>
    </div>
  );
}
