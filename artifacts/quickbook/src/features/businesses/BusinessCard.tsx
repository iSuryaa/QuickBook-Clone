import { Star, Clock, MapPin, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPriceLevel, formatINR, getCategoryLabel, type Business } from "@/data/mock";

interface BusinessCardProps {
  business: Business;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onClick: (id: string) => void;
  variant?: "default" | "compact";
}

export function BusinessCard({ business, isFavorite, onToggleFavorite, onClick, variant = "default" }: BusinessCardProps) {
  if (variant === "compact") {
    return (
      <div
        onClick={() => onClick(business.id)}
        role="button" tabIndex={0} onKeyDown={e => e.key === "Enter" && onClick(business.id)}
        className="flex items-center gap-3 w-full bg-white rounded-2xl p-3 border border-slate-100 text-left active:scale-[0.98] transition-transform shadow-sm cursor-pointer"
      >
        <img src={business.imageUrl} alt={business.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">{business.name}</p>
          <p className="text-xs text-slate-400 truncate mt-0.5">{getCategoryLabel(business.category)}</p>
          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
            <span className="flex items-center gap-0.5">
              <Star size={10} className="text-amber-400 fill-amber-400" />
              {business.rating.toFixed(1)}
            </span>
            <span className="flex items-center gap-0.5">
              <MapPin size={10} />
              {business.distanceKm} km
            </span>
            <span className={cn("font-semibold", business.openNow ? "text-emerald-500" : "text-rose-400")}>
              {business.openNow ? "Open" : "Closed"}
            </span>
          </div>
        </div>
        <button
          onClick={e => { e.stopPropagation(); onToggleFavorite(business.id); }}
          className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center bg-slate-50"
        >
          <Heart size={15} className={cn(isFavorite ? "text-red-500 fill-red-500" : "text-slate-300")} />
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={() => onClick(business.id)}
      role="button" tabIndex={0} onKeyDown={e => e.key === "Enter" && onClick(business.id)}
      className="w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 text-left transition-transform active:scale-[0.99] hover:shadow-md cursor-pointer"
    >
      <div className="relative h-48">
        <img src={business.imageUrl} alt={business.name} className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        <button
          onClick={e => { e.stopPropagation(); onToggleFavorite(business.id); }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md"
        >
          <Heart size={15} className={cn(isFavorite ? "text-red-500 fill-red-500" : "text-slate-400")} />
        </button>
        <span className={cn(
          "absolute bottom-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full shadow",
          business.openNow ? "bg-emerald-500 text-white" : "bg-slate-600/90 text-white"
        )}>
          {business.openNow ? "Open" : "Closed"}
        </span>
        {business.openNow && business.queueCount > 0 && (
          <span className="absolute bottom-3 right-3 bg-indigo-500/90 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
            {business.queueCount} in queue
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-indigo-500 mb-0.5">{getCategoryLabel(business.category)}</p>
            <h3 className="font-bold text-sm leading-tight text-slate-800">{business.name}</h3>
          </div>
          <span className="text-xs text-slate-400 shrink-0 mt-4">{formatPriceLevel(business.priceLevel)}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500 mt-2 flex-wrap">
          <span className="flex items-center gap-1">
            <Star size={11} className="text-amber-400 fill-amber-400" />
            <span className="font-semibold text-slate-700">{business.rating.toFixed(1)}</span>
            <span className="text-slate-400">({business.reviewCount.toLocaleString()})</span>
          </span>
          <span className="flex items-center gap-1"><MapPin size={11} />{business.distanceKm} km</span>
          {business.waitTimeMinutes > 0 && (
            <span className="flex items-center gap-1"><Clock size={11} />~{business.waitTimeMinutes} min wait</span>
          )}
        </div>
        <p className="text-xs text-slate-400 mt-2 line-clamp-1">{business.address}</p>
      </div>
    </div>
  );
}
