import { useState, useMemo, useEffect } from "react";
import { SlidersHorizontal, Search } from "lucide-react";
import { SearchBar } from "@/components/ui/SearchBar";
import { BusinessCard } from "@/features/businesses/BusinessCard";
import { FilterSheet, type Filters } from "@/features/businesses/FilterSheet";
import { BusinessCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { BUSINESSES, type CategoryId } from "@/data/mock";
import { cn } from "@/lib/utils";

const CATEGORY_TABS: { id: "all" | CategoryId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "hospital", label: "Hospital" },
  { id: "salon", label: "Salon" },
  { id: "hotel", label: "Hotel" },
  { id: "gym", label: "Gym" },
  { id: "restaurant", label: "Restaurant" },
  { id: "entertainment", label: "Cinema" },
  { id: "games", label: "Games" },
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
  const [activeCategory, setActiveCategory] = useState<"all" | CategoryId>((initialCategory as CategoryId) ?? "all");
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, [activeCategory]);

  useEffect(() => {
    if (initialCategory) setActiveCategory(initialCategory as CategoryId);
  }, [initialCategory]);

  const filtered = useMemo(() => {
    let list = activeCategory === "all" ? BUSINESSES : BUSINESSES.filter(b => b.category === activeCategory);
    if (filters.openOnly) list = list.filter(b => b.openNow);
    if (filters.minRating > 0) list = list.filter(b => b.rating >= filters.minRating);
    list = list.filter(b => b.distanceKm <= filters.maxDistanceKm);
    list = list.filter(b => filters.priceLevels.includes(b.priceLevel));
    if (searchQuery) list = list.filter(b =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return list;
  }, [activeCategory, filters, searchQuery]);

  const activeFilterCount =
    (filters.minRating > 0 ? 1 : 0) +
    (filters.maxDistanceKm < 10 ? 1 : 0) +
    (filters.openOnly ? 1 : 0) +
    (filters.priceLevels.length < 4 ? 1 : 0);

  return (
    <div className="pt-12 px-4 md:px-6">
      <h1 className="text-2xl font-black mb-4">Explore</h1>

      <div className="flex gap-2 mb-4">
        <SearchBar value={searchQuery} onChange={onSearchChange} placeholder="Search by name or area" className="flex-1" />
        <button
          onClick={() => setShowFilters(true)}
          className={cn(
            "w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 relative transition-all active:scale-95",
            activeFilterCount > 0 ? "bg-indigo-500 text-white border-indigo-500" : "bg-white text-slate-600 border-slate-100"
          )}
        >
          <SlidersHorizontal size={18} />
          {activeFilterCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white text-indigo-500 text-[9px] font-black rounded-full flex items-center justify-center border border-indigo-200 shadow">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-5">
        {CATEGORY_TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveCategory(id)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap border transition-all active:scale-95",
              activeCategory === id ? "bg-indigo-500 text-white border-indigo-500 shadow-sm shadow-indigo-200" : "bg-white text-slate-600 border-slate-200"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {!loading && (
        <p className="text-xs text-slate-400 mb-3 animate-fade-up">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        </p>
      )}

      <div className="flex flex-col gap-4 pb-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <BusinessCardSkeleton key={i} />)
          : filtered.length === 0
            ? <EmptyState icon={Search} title="No results found" description="Try adjusting your search terms or filters." />
            : filtered.map((b, i) => (
                <div key={b.id} className="animate-fade-up" style={{ animationDelay: `${i * 40}ms` }}>
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

      {showFilters && (
        <FilterSheet filters={filters} onApply={setFilters} onClose={() => setShowFilters(false)} />
      )}
    </div>
  );
}
