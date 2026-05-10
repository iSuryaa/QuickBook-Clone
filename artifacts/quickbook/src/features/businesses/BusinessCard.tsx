import { useState } from "react";
import { Star, Clock, MapPin, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ApiBusiness } from "@/services/api";

const CATEGORY_LABELS: Record<string, string> = {
  hospital: "Hospital", salon: "Salon & Spa", hotel: "Hotel",
  gym: "Gym", restaurant: "Restaurant", entertainment: "Cinema",
  games: "Gaming", pharmacy: "Pharmacy",
};

const CATEGORY_GRADIENTS: Record<string, string> = {
  hospital: "from-blue-400 to-blue-600",
  salon: "from-pink-400 to-purple-500",
  hotel: "from-teal-400 to-teal-600",
  gym: "from-emerald-400 to-green-600",
  restaurant: "from-orange-400 to-red-500",
  entertainment: "from-purple-500 to-violet-700",
  games: "from-cyan-400 to-blue-500",
  pharmacy: "from-green-400 to-emerald-600",
};

const CATEGORY_ICONS: Record<string, string> = {
  hospital: "🏥", salon: "💆", hotel: "🏨", gym: "💪",
  restaurant: "🍽️", entertainment: "🎬", games: "🎮", pharmacy: "💊",
};

function formatPriceLevel(level: number) {
  return "₹".repeat(level) + "·".repeat(4 - level);
}

interface BusinessCardProps {
  business: ApiBusiness;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onClick: (id: string) => void;
  variant?: "default" | "compact";
}

function CardImage({ business, className }: { business: ApiBusiness; className?: string }) {
  const [imgError, setImgError] = useState(false);
  const gradient = CATEGORY_GRADIENTS[business.category] ?? "from-indigo-400 to-violet-500";
  const icon = CATEGORY_ICONS[business.category] ?? "🏪";

  if (imgError || !business.imageUrl) {
    return (
      <div className={cn(`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`, className)}>
        <span className="text-5xl opacity-80">{icon}</span>
      </div>
    );
  }

  return (
    <div className={cn(`relative w-full h-full bg-gradient-to-br ${gradient}`, className)}>
      <img
        src={business.imageUrl}
        alt={business.name}
        className="w-full h-full object-cover"
        loading="lazy"
        onError={() => setImgError(true)}
      />
    </div>
  );
}

function CompactImage({ business }: { business: ApiBusiness }) {
  const [imgError, setImgError] = useState(false);
  const gradient = CATEGORY_GRADIENTS[business.category] ?? "from-indigo-400 to-violet-500";
  const icon = CATEGORY_ICONS[business.category] ?? "🏪";

  if (imgError || !business.imageUrl) {
    return (
      <div className={cn(`w-16 h-16 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0`)}>
        <span className="text-2xl">{icon}</span>
      </div>
    );
  }

  return (
    <div className={cn(`w-16 h-16 rounded-xl bg-gradient-to-br ${gradient} shrink-0 overflow-hidden`)}>
      <img
        src={business.imageUrl}
        alt={business.name}
        className="w-full h-full object-cover"
        loading="lazy"
        onError={() => setImgError(true)}
      />
    </div>
  );
}

export function BusinessCard({ business, isFavorite, onToggleFavorite, onClick, variant = "default" }: BusinessCardProps) {
  if (variant === "compact") {
    return (
      <div
        onClick={() => onClick(business.id)}
        role="button" tabIndex={0} onKeyDown={e => e.key === "Enter" && onClick(business.id)}
        className="flex items-center gap-3 w-full bg-white rounded-2xl p-3 border border-slate-100 text-left active:scale-[0.98] transition-transform shadow-sm cursor-pointer"
      >
        <CompactImage business={business} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">{business.name}</p>
          <p className="text-xs text-slate-400 truncate mt-0.5">{CATEGORY_LABELS[business.category] ?? business.category}</p>
          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
            <span className="flex items-center gap-0.5">
              <Star size={10} className="text-amber-400 fill-amber-400" />
              {business.rating.toFixed(1)}
            </span>
            <span className="flex items-center gap-0.5">
              <MapPin size={10} />{business.distanceKm} km
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
      className="w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 text-left transition-transform active:scale-[0.99] hover:shadow-md cursor-pointer block"
    >
      <div className="relative h-48 overflow-hidden">
        <CardImage business={business} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        <button
          onClick={e => { e.stopPropagation(); onToggleFavorite(business.id); }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md"
        >
          <Heart size={15} className={cn(isFavorite ? "text-red-500 fill-red-500" : "text-slate-400")} />
        </button>
        <span className={cn("absolute bottom-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full shadow", business.openNow ? "bg-emerald-500 text-white" : "bg-slate-600/90 text-white")}>
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
            <p className="text-xs font-semibold text-indigo-500 mb-0.5">{CATEGORY_LABELS[business.category] ?? business.category}</p>
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
