import { Heart, X } from "lucide-react";
import { useBusinesses } from "@/hooks/useBusinesses";
import { BusinessCard } from "@/features/businesses/BusinessCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type { ApiBusiness } from "@/services/api";

interface FavouritesSheetProps {
  favIds: string[];
  onClose: () => void;
  onViewBusiness: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export function FavouritesSheet({ favIds, onClose, onViewBusiness, onToggleFavorite }: FavouritesSheetProps) {
  const { data } = useBusinesses({});
  const favBusinesses = (data?.businesses ?? []).filter((b: ApiBusiness) => favIds.includes(b.id));

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 animate-fade-in" onClick={onClose}>
      <div className="bg-slate-50 w-full max-w-[540px] rounded-t-3xl max-h-[85vh] flex flex-col animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-center px-5 pt-5 pb-4 bg-white border-b border-slate-100 shrink-0">
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center mr-3">
            <X size={18} />
          </button>
          <h2 className="font-bold flex-1">Favourites</h2>
          <span className="text-xs text-slate-400">{favBusinesses.length} saved</span>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4 pb-safe">
          {favBusinesses.length === 0 ? (
            <EmptyState icon={Heart} title="No favourites yet" description="Tap the heart icon on any business to save it here." />
          ) : favBusinesses.map((b: ApiBusiness) => (
            <BusinessCard key={b.id} business={b} isFavorite onToggleFavorite={onToggleFavorite} onClick={onViewBusiness} variant="compact" />
          ))}
        </div>
      </div>
    </div>
  );
}
