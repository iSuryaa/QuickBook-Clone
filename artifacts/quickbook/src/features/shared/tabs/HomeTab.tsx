import { useMemo, useState, useEffect } from "react";
import { Bell, MapPin, ChevronRight, Hospital, Scissors, Building2, Dumbbell, UtensilsCrossed, Ticket, Gamepad2 } from "lucide-react";
import { SearchBar } from "@/components/ui/SearchBar";
import { BusinessCard } from "@/features/businesses/BusinessCard";
import { BusinessCardSkeleton } from "@/components/ui/Skeleton";
import { BUSINESSES, type CategoryId } from "@/data/mock";

const CATEGORIES = [
  { id: "hospital" as CategoryId, name: "Hospital", icon: Hospital, color: "#ef4444" },
  { id: "salon" as CategoryId, name: "Salon & Spa", icon: Scissors, color: "#ec4899" },
  { id: "hotel" as CategoryId, name: "Hotel", icon: Building2, color: "#3b82f6" },
  { id: "gym" as CategoryId, name: "Gym", icon: Dumbbell, color: "#10b981" },
  { id: "restaurant" as CategoryId, name: "Restaurant", icon: UtensilsCrossed, color: "#f59e0b" },
  { id: "entertainment" as CategoryId, name: "Cinema", icon: Ticket, color: "#a855f7" },
  { id: "games" as CategoryId, name: "Games", icon: Gamepad2, color: "#06b6d4" },
];

interface HomeTabProps {
  onGoExplore: (category?: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onViewBusiness: (id: string) => void;
  onOpenNotifications: () => void;
  isLoggedIn: boolean;
  userName?: string;
  unreadCount: number;
  favIds: string[];
  onToggleFavorite: (id: string) => void;
}

export function HomeTab({ onGoExplore, searchQuery, onSearchChange, onViewBusiness, onOpenNotifications, isLoggedIn, userName, unreadCount, favIds, onToggleFavorite }: HomeTabProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  const featured = BUSINESSES.filter(b => b.openNow).slice(0, 5);
  const popular = BUSINESSES.slice(2, 7);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  }, []);

  return (
    <div className="px-4 pt-12 pb-2 md:px-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <MapPin size={11} className="text-indigo-400" /> Nearby
          </p>
          <h1 className="text-2xl font-black mt-0.5">
            {isLoggedIn ? `Hi, ${userName?.split(" ")[0]}` : greeting}
          </h1>
        </div>
        <button
          onClick={onOpenNotifications}
          className="relative w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm active:scale-95 transition-transform"
        >
          <Bell size={18} className="text-slate-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-indigo-500 text-white text-[9px] font-black rounded-full flex items-center justify-center px-1">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </div>

      <SearchBar
        value={searchQuery}
        onChange={v => { onSearchChange(v); if (v) onGoExplore(); }}
        placeholder="Search hospitals, salons, restaurants…"
        className="mb-6"
      />

      <section className="mb-7">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-base">Categories</h2>
          <button onClick={() => onGoExplore()} className="text-xs text-indigo-500 font-semibold flex items-center gap-0.5">
            All <ChevronRight size={13} />
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map(({ id, name, icon: Icon, color }) => (
            <button
              key={id}
              onClick={() => onGoExplore(id)}
              className="flex flex-col items-center gap-2 shrink-0 active:scale-90 transition-transform"
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm" style={{ backgroundColor: `${color}18` }}>
                <Icon size={24} style={{ color }} />
              </div>
              <span className="text-xs font-semibold text-slate-600 text-center leading-tight max-w-[60px]">{name}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="mb-7">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-base">Featured for you</h2>
          <button onClick={() => onGoExplore()} className="text-xs text-indigo-500 font-semibold flex items-center gap-0.5">
            See all <ChevronRight size={13} />
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="w-64 shrink-0"><BusinessCardSkeleton /></div>
              ))
            : featured.map((b, i) => (
                <div key={b.id} className="w-72 shrink-0 animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                  <BusinessCard
                    business={b}
                    isFavorite={favIds.includes(b.id)}
                    onToggleFavorite={onToggleFavorite}
                    onClick={onViewBusiness}
                  />
                </div>
              ))
          }
        </div>
      </section>

      <section className="mb-7">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-base">Popular near you</h2>
          <button onClick={() => onGoExplore()} className="text-xs text-indigo-500 font-semibold flex items-center gap-0.5">
            See all <ChevronRight size={13} />
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <BusinessCardSkeleton key={i} />)
            : popular.map((b, i) => (
                <div key={b.id} className="animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                  <BusinessCard
                    business={b}
                    isFavorite={favIds.includes(b.id)}
                    onToggleFavorite={onToggleFavorite}
                    onClick={onViewBusiness}
                    variant="compact"
                  />
                </div>
              ))
          }
        </div>
      </section>
    </div>
  );
}
