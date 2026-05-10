import { useMemo } from "react";
import { Bell, MapPin, ChevronRight, Hospital, Scissors, Building2, Dumbbell, UtensilsCrossed, Ticket, Gamepad2, AlertCircle } from "lucide-react";
import { SearchBar } from "@/components/ui/SearchBar";
import { BusinessCard } from "@/features/businesses/BusinessCard";
import { BusinessCardSkeleton } from "@/components/ui/Skeleton";
import { useBusinesses } from "@/hooks/useBusinesses";
import type { ApiBusiness } from "@/services/api";

const CATEGORIES = [
  { id: "hospital", name: "Hospital", icon: Hospital, color: "#ef4444" },
  { id: "salon", name: "Salon & Spa", icon: Scissors, color: "#ec4899" },
  { id: "hotel", name: "Hotel", icon: Building2, color: "#3b82f6" },
  { id: "gym", name: "Gym", icon: Dumbbell, color: "#10b981" },
  { id: "restaurant", name: "Restaurant", icon: UtensilsCrossed, color: "#f59e0b" },
  { id: "entertainment", name: "Cinema", icon: Ticket, color: "#a855f7" },
  { id: "games", name: "Games", icon: Gamepad2, color: "#06b6d4" },
];

interface HomeTabProps {
  onGoExplore: (category?: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onViewBusiness: (id: string) => void;
  onOpenNotifications: () => void;
  isLoggedIn: boolean;
  userName?: string;
  favIds: string[];
  onToggleFavorite: (id: string) => void;
}

export function HomeTab({ onGoExplore, searchQuery, onSearchChange, onViewBusiness, onOpenNotifications, isLoggedIn, userName, favIds, onToggleFavorite }: HomeTabProps) {
  const { data, isLoading, isError, refetch } = useBusinesses({});

  const businesses = data?.businesses ?? [];
  const featured = businesses.filter((b: ApiBusiness) => b.openNow).slice(0, 5);
  const popular = businesses.slice(2, 8);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    const base = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
    return isLoggedIn && userName ? `${base}, ${userName.split(" ")[0]}` : base;
  }, [isLoggedIn, userName]);

  return (
    <div className="px-4 md:px-8 pt-12 pb-2">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <MapPin size={11} className="text-indigo-400" /> Nearby
          </p>
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
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-sm md:text-base">Categories</h2>
          <button onClick={() => onGoExplore()} className="text-xs text-indigo-500 font-semibold flex items-center gap-0.5">
            All <ChevronRight size={13} />
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map(({ id, name, icon: Icon, color }) => (
            <button key={id} onClick={() => onGoExplore(id)} className="flex flex-col items-center gap-2 shrink-0 active:scale-90 transition-transform">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm" style={{ backgroundColor: `${color}18` }}>
                <Icon size={24} style={{ color }} />
              </div>
              <span className="text-xs font-semibold text-slate-600 text-center leading-tight max-w-[60px]">{name}</span>
            </button>
          ))}
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
          <h2 className="font-bold text-sm md:text-base">Featured for you</h2>
          <button onClick={() => onGoExplore()} className="text-xs text-indigo-500 font-semibold flex items-center gap-0.5">
            See all <ChevronRight size={13} />
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="w-64 shrink-0"><BusinessCardSkeleton /></div>)
            : featured.map((b: ApiBusiness, i: number) => (
                <div key={b.id} className="w-72 shrink-0 animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                  <BusinessCard business={b} isFavorite={favIds.includes(b.id)} onToggleFavorite={onToggleFavorite} onClick={onViewBusiness} />
                </div>
              ))
          }
        </div>
      </section>

      {/* Popular */}
      <section className="mb-7">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-sm md:text-base">Popular near you</h2>
          <button onClick={() => onGoExplore()} className="text-xs text-indigo-500 font-semibold flex items-center gap-0.5">
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
