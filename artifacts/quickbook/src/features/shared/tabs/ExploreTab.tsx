import { useState, useMemo, useEffect } from "react";
import { SlidersHorizontal, Search, AlertCircle } from "lucide-react";
import { SearchBar } from "@/components/ui/SearchBar";
import { BusinessCard } from "@/features/businesses/BusinessCard";
import { FilterSheet, type Filters } from "@/features/businesses/FilterSheet";
import { BusinessCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { useBusinesses } from "@/hooks/useBusinesses";
import { cn } from "@/lib/utils";
import type { ApiBusiness } from "@/services/api";

type CategoryId = "all" | "hospital" | "salon" | "hotel" | "gym" | "restaurant" | "entertainment" | "games" | "pharmacy";

const CATEGORY_TABS: { id: CategoryId; label: string }[] = [
  { id: "all", label: "All" }, { id: "hospital", label: "Hospital" }, { id: "salon", label: "Salon" },
  { id: "hotel", label: "Hotel" }, { id: "gym", label: "Gym" }, { id: "restaurant", label: "Restaurant" },
  { id: "entertainment", label: "Cinema" }, { id: "games", label: "Games" }, { id: "pharmacy", label: "Pharmacy" },
];

const DEFAULT_FILTERS: Filters = { minRating: 0, maxDistanceKm: 10, openOnly: false, priceLevels: [1, 2, 3, 4] };

interface ExploreTabProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  initialCategory?: string;
  onViewBusiness: (id: string) => void;
  favIds: string[];
  onToggleFavorite: (id: string) => void;
}

export function ExploreTab({ searchQuery, onSearchChange, initialCategory, onViewBusiness, favIds, onToggleFavorite }: ExploreTabProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryId>((initialCategory as CategoryId) ?? "all");
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (initialCategory) setActiveCategory(initialCategory as CategoryId);
  }, [initialCategory]);

  const { data, isLoading, isError, refetch } = useBusinesses({
    category: activeCategory === "all" ? undefined : activeCategory,
  });

  const filtered = useMemo(() => {
    let list = data?.businesses ?? [];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((b: ApiBusiness) =>
        b.name.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        b.address.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q)
      );
    }
    if (filters.openOnly) list = list.filter((b: ApiBusiness) => b.openNow);
    if (filters.minRating > 0) list = list.filter((b: ApiBusiness) => b.rating >= filters.minRating);
    list = list.filter((b: ApiBusiness) => b.distanceKm <= filters.maxDistanceKm);
    list = list.filter((b: ApiBusiness) => filters.priceLevels.includes(b.priceLevel));
    return list;
  }, [data?.businesses, searchQuery, filters]);

  const activeFilterCount =
    (filters.minRating > 0 ? 1 : 0) +
    (filters.maxDistanceKm < 10 ? 1 : 0) +
    (filters.openOnly ? 1 : 0) +
    (filters.priceLevels.length < 4 ? 1 : 0);

  return (
    <div className="pt-12 px-4 md:px-8">
      <h1 className="text-xl md:text-2xl font-black mb-4">Explore</h1>

      <div className="flex gap-2 mb-4">
        <SearchBar value={searchQuery} onChange={onSearchChange} placeholder="Search by name, category or area" className="flex-1 max-w-md md:max-w-xl" />
        <button
          onClick={() => setShowFilters(true)}
          className={cn("w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 relative transition-all active:scale-95",
            activeFilterCount > 0 ? "bg-indigo-500 text-white border-indigo-500" : "bg-white text-slate-600 border-slate-100")}
        >
          <SlidersHorizontal size={18} />
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-white border border-indigo-200 text-indigo-500 text-[9px] font-black rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      <div className="relative mb-1">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 -mx-4 md:-mx-8 px-4 md:px-8">
          {CATEGORY_TABS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveCategory(id)}
              className={cn(
                "px-3 py-1.5 md:px-4 md:py-2 rounded-full text-sm md:text-base font-semibold whitespace-nowrap border shrink-0 transition-all active:scale-95",
                activeCategory === id ? "bg-indigo-500 text-white border-indigo-500 shadow-sm shadow-indigo-200" : "bg-white text-slate-600 border-slate-200"
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="absolute right-0 top-0 bottom-3 w-12 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none" />
      </div>

      {isError && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-2xl px-4 py-3 mb-4">
          <AlertCircle size={16} className="text-red-400 shrink-0" />
          <p className="text-sm text-red-600 flex-1">Couldn't load listings.</p>
          <button onClick={() => refetch()} className="text-xs font-bold text-red-500 border border-red-200 px-3 py-1 rounded-full">Retry</button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-28">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <BusinessCardSkeleton key={i} />)
          : filtered.length === 0
            ? (
              <div className="col-span-full min-h-[50vh] flex items-center justify-center">
                <EmptyState
                  icon={Search}
                  title="No results found"
                  description={searchQuery ? `No businesses match "${searchQuery}". Try a different search term.` : "Try a different category or adjust your filters."}
                />
              </div>
            )
            : filtered.map((b: ApiBusiness, i: number) => (
                <div key={b.id} className="animate-fade-up" style={{ animationDelay: `${i * 40}ms` }}>
                  <BusinessCard business={b} isFavorite={favIds.includes(b.id)} onToggleFavorite={onToggleFavorite} onClick={onViewBusiness} />
                </div>
              ))
        }
      </div>

      {showFilters && <FilterSheet filters={filters} onApply={setFilters} onClose={() => setShowFilters(false)} />}
    </div>
  );
}
