import { useState, useMemo } from "react";
import { ArrowLeft, Share2, Heart, Star, MapPin, Clock, Phone, Globe, Users, ChevronRight, CheckCircle2, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBusinessById } from "@/hooks/useBusinesses";
import type { ApiBusiness, ApiService, ApiStaff } from "@/services/api";
import { PhotoLightbox } from "@/features/shared/PhotoLightbox";

function formatINR(paise: number) {
  return `₹${(paise / 100).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}
function formatDuration(mins: number) {
  if (mins < 60) return `${mins} min`;
  return `${Math.floor(mins / 60)}h ${mins % 60 > 0 ? `${mins % 60}m` : ""}`.trim();
}

const MOCK_REVIEWS = [
  { id: "r1", name: "Priya M.", rating: 5, text: "Absolutely brilliant experience. Staff was warm and professional.", time: "2 days ago", avatar: "P" },
  { id: "r2", name: "Arjun K.", rating: 4, text: "Very efficient and clean. Only minor wait time issue.", time: "1 week ago", avatar: "A" },
  { id: "r3", name: "Sneha R.", rating: 5, text: "Highly recommend! Booked via QuickBook, no queue at all.", time: "2 weeks ago", avatar: "S" },
  { id: "r4", name: "Vikram T.", rating: 4, text: "Great service overall. Will definitely visit again soon.", time: "3 weeks ago", avatar: "V" },
  { id: "r5", name: "Meera J.", rating: 5, text: "Exceptional quality. One of the best in the city without a doubt.", time: "1 month ago", avatar: "M" },
];

const CATEGORY_LABELS: Record<string, string> = {
  hospital: "Hospital", salon: "Salon & Spa", hotel: "Hotel",
  gym: "Gym", restaurant: "Restaurant", entertainment: "Cinema", games: "Gaming",
};

type SubPage = "photos" | "reviews" | "services" | null;
const DAY_KEYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface BusinessDetailSheetProps {
  businessId: string;
  onClose: () => void;
  onBook: (business: ApiBusiness & { services: ApiService[]; staff: ApiStaff[] }) => void;
  onJoinQueue: (business: ApiBusiness) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export function BusinessDetailSheet({ businessId, onClose, onBook, onJoinQueue, isFavorite, onToggleFavorite }: BusinessDetailSheetProps) {
  const [photoIdx, setPhotoIdx] = useState(0);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [subPage, setSubPage] = useState<SubPage>(null);

  const { data: business, isLoading, isError } = useBusinessById(businessId);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 animate-fade-in">
        <div className="w-full md:max-w-2xl bg-white md:rounded-3xl max-h-[94vh] flex items-center justify-center md:mx-4 py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-indigo-200 border-t-indigo-500 animate-spin" />
            <p className="text-sm text-slate-400">Loading…</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !business) {
    return (
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 animate-fade-in">
        <div className="w-full md:max-w-2xl bg-white md:rounded-3xl max-h-[94vh] flex items-center justify-center md:mx-4 py-20">
          <div className="text-center px-6">
            <p className="font-bold text-slate-700 mb-2">Failed to load business</p>
            <button onClick={onClose} className="text-indigo-500 font-semibold text-sm">Go back</button>
          </div>
        </div>
      </div>
    );
  }

  const photos = business.photos.length > 0 ? business.photos : [business.imageUrl];
  const hasQueue = business.category === "hospital" || business.category === "salon";
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" }).slice(0, 3);
  const hoursDetail = business.hoursDetail ? JSON.parse(business.hoursDetail) as Record<string, string> : null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: business.name, text: business.description, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
    }
  };

  if (subPage) {
    return (
      <SubPageWrapper title={subPage === "photos" ? "Photos" : subPage === "reviews" ? `Reviews (${business.reviewCount})` : "All Services"} onClose={() => setSubPage(null)}>
        {subPage === "photos" && (
          <div className="grid grid-cols-3 gap-1 p-3">
            {photos.map((p, i) => (
              <button key={i} onClick={() => setLightboxIdx(i)} className="aspect-square overflow-hidden active:opacity-80 transition-opacity">
                <img src={p} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
            {lightboxIdx !== null && <PhotoLightbox photos={photos} startIndex={lightboxIdx} onClose={() => setLightboxIdx(null)} />}
          </div>
        )}
        {subPage === "reviews" && (
          <div className="px-4 py-4 flex flex-col gap-3">
            <div className="flex items-center gap-4 bg-white rounded-2xl border border-slate-100 p-4">
              <div className="text-center shrink-0">
                <p className="text-5xl font-black text-slate-800">{business.rating.toFixed(1)}</p>
                <Stars rating={business.rating} size={12} />
                <p className="text-xs text-slate-400 mt-1">{business.reviewCount.toLocaleString()} reviews</p>
              </div>
              <RatingBars />
            </div>
            {MOCK_REVIEWS.map(r => <ReviewCard key={r.id} review={r} />)}
          </div>
        )}
        {subPage === "services" && (
          <div className="px-4 py-3 flex flex-col gap-2">
            <p className="text-xs text-slate-400 px-1 mb-1">Prices for reference — you pay only the platform booking fee</p>
            {business.services.map(svc => (
              <div key={svc.id} className="flex items-center justify-between bg-white rounded-xl border border-slate-100 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{svc.name}</p>
                  {svc.duration > 0 && <p className="text-xs text-slate-400 mt-0.5">{formatDuration(svc.duration)}</p>}
                </div>
                <span className="text-sm font-bold text-slate-700 ml-3 shrink-0">{svc.price === 0 ? "Free" : formatINR(svc.price)}</span>
              </div>
            ))}
          </div>
        )}
      </SubPageWrapper>
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 animate-fade-in" onClick={onClose}>
      <div className="w-full md:max-w-2xl bg-white md:rounded-3xl max-h-[94vh] flex flex-col animate-slide-up overflow-hidden md:mx-4" onClick={e => e.stopPropagation()}>
        <div className="relative shrink-0" style={{ height: "48vw", maxHeight: 220, minHeight: 160 }}>
          <img src={photos[photoIdx]} alt={business.name} className="w-full h-full object-cover" />
          {photos.length > 1 && (
            <>
              <button onClick={() => setPhotoIdx(i => (i - 1 + photos.length) % photos.length)}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                <ArrowLeft size={14} className="text-white" />
              </button>
              <button onClick={() => setPhotoIdx(i => (i + 1) % photos.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center rotate-180">
                <ArrowLeft size={14} className="text-white" />
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {photos.map((_, i) => (
                  <button key={i} onClick={() => setPhotoIdx(i)}
                    className={cn("rounded-full transition-all", i === photoIdx ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50")} />
                ))}
              </div>
            </>
          )}
          <button onClick={onClose} className="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/35 backdrop-blur-sm flex items-center justify-center">
            <ArrowLeft size={16} className="text-white" />
          </button>
          <div className="absolute top-3 right-3 flex gap-2">
            <button onClick={handleShare} className="w-8 h-8 rounded-full bg-black/35 backdrop-blur-sm flex items-center justify-center">
              <Share2 size={14} className="text-white" />
            </button>
            <button onClick={() => onToggleFavorite(business.id)} className="w-8 h-8 rounded-full bg-black/35 backdrop-blur-sm flex items-center justify-center">
              <Heart size={14} className={cn(isFavorite ? "text-red-400 fill-red-400" : "text-white")} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          <div className="px-4 pt-3 pb-3 bg-white">
            <div className="flex items-center justify-between mb-1">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full border border-indigo-100">
                {CATEGORY_LABELS[business.category] ?? business.category}
              </span>
              <span className={cn("text-xs font-bold", business.openNow ? "text-emerald-500" : "text-slate-400")}>
                {business.openNow ? "Open now" : "Closed"}
              </span>
            </div>
            <h1 className="text-xl font-black text-slate-900 leading-tight">{business.name}</h1>
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              <Star size={13} className="text-amber-400 fill-amber-400" />
              <span className="text-sm font-bold text-slate-800">{business.rating.toFixed(1)}</span>
              <span className="text-sm text-slate-400">({business.reviewCount.toLocaleString()})</span>
              <span className="text-slate-300">·</span>
              <MapPin size={11} className="text-slate-400" />
              <span className="text-sm text-slate-500">{business.distanceKm} km</span>
              <span className="text-slate-300">·</span>
              <span className="text-sm text-slate-500">{Array.from({ length: business.priceLevel }, () => "₹").join("")}</span>
            </div>
          </div>

          {(business.waitTimeMinutes > 0 || business.queueCount > 0) && (
            <div className="px-4 pb-3 flex gap-3">
              <div className="flex-1 flex items-center gap-2.5 bg-slate-50 rounded-xl px-3 py-2.5 border border-slate-100">
                <Clock size={16} className="text-indigo-400 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">Avg wait</p>
                  <p className="text-sm font-bold text-slate-800">{business.waitTimeMinutes} min</p>
                </div>
              </div>
              <div className="flex-1 flex items-center gap-2.5 bg-slate-50 rounded-xl px-3 py-2.5 border border-slate-100">
                <Users size={16} className="text-indigo-400 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">In queue</p>
                  <p className="text-sm font-bold text-slate-800">{business.queueCount} people</p>
                </div>
              </div>
            </div>
          )}

          <div className="px-4 pb-4 flex gap-3">
            {business.phone && (
              <a href={`tel:${business.phone}`} className="flex-1 flex items-center justify-center gap-2 h-10 bg-slate-100 rounded-xl text-sm font-semibold text-slate-700 active:opacity-75">
                <Phone size={15} className="text-slate-500" /> Call
              </a>
            )}
            <button className="flex-1 flex items-center justify-center gap-2 h-10 bg-slate-100 rounded-xl text-sm font-semibold text-slate-700 active:opacity-75">
              <Navigation size={15} className="text-slate-500" /> Directions
            </button>
          </div>

          <div className="h-px bg-slate-100 mx-4" />

          <div className="px-4 py-4">
            <h2 className="font-bold text-base text-slate-900 mb-2">About</h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-3">{business.description}</p>
            <div className="bg-slate-50 rounded-xl border border-slate-100 overflow-hidden">
              {business.address && (
                <div className="flex items-center gap-3 px-3 py-2.5 border-b border-slate-100">
                  <MapPin size={14} className="text-slate-400 shrink-0" />
                  <span className="text-sm text-slate-600">{business.address}</span>
                </div>
              )}
              {business.phone && (
                <div className="flex items-center gap-3 px-3 py-2.5 border-b border-slate-100">
                  <Phone size={14} className="text-slate-400 shrink-0" />
                  <span className="text-sm text-slate-600">{business.phone}</span>
                </div>
              )}
              {business.website && (
                <div className="flex items-center gap-3 px-3 py-2.5">
                  <Globe size={14} className="text-slate-400 shrink-0" />
                  <span className="text-sm text-indigo-500">{business.website}</span>
                </div>
              )}
            </div>
          </div>

          <div className="h-px bg-slate-100 mx-4" />

          {photos.length > 0 && (
            <div className="px-4 py-4">
              <div className="flex items-center justify-between mb-2.5">
                <h2 className="font-bold text-base text-slate-900">Photos</h2>
                {photos.length > 3 && (
                  <button onClick={() => setSubPage("photos")} className="text-xs text-indigo-500 font-semibold flex items-center gap-0.5">
                    See all <ChevronRight size={12} />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {photos.slice(0, 3).map((p, i) => (
                  <button key={i} onClick={() => setLightboxIdx(i)} className="aspect-[4/3] rounded-lg overflow-hidden active:opacity-80 transition-opacity">
                    <img src={p} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="h-px bg-slate-100 mx-4" />

          {business.amenities.length > 0 && (
            <>
              <div className="px-4 py-4">
                <h2 className="font-bold text-base text-slate-900 mb-2.5">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {business.amenities.map(a => (
                    <span key={a} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-600 rounded-full text-xs font-semibold border border-slate-200">
                      <CheckCircle2 size={11} className="text-indigo-400" /> {a}
                    </span>
                  ))}
                </div>
              </div>
              <div className="h-px bg-slate-100 mx-4" />
            </>
          )}

          {hoursDetail && (
            <>
              <div className="px-4 py-4">
                <h2 className="font-bold text-base text-slate-900 mb-2.5">Opening hours</h2>
                <div className="flex flex-col divide-y divide-slate-50">
                  {DAY_KEYS.map(day => {
                    const hrs = hoursDetail[day] ?? "—";
                    const isToday = day === today;
                    return (
                      <div key={day} className={cn("flex items-center justify-between py-2", isToday && "bg-indigo-50/50 -mx-1 px-1 rounded-lg")}>
                        <span className={cn("text-sm", isToday ? "font-bold text-indigo-600" : "font-medium text-slate-600")}>
                          {day}{isToday && <span className="ml-1.5 text-[10px] font-bold text-indigo-500">• Today</span>}
                        </span>
                        <span className={cn("text-sm", hrs === "Closed" ? "text-red-400 font-semibold" : isToday ? "font-semibold text-indigo-600" : "text-slate-500")}>
                          {hrs}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="h-px bg-slate-100 mx-4" />
            </>
          )}

          {business.services.length > 0 && (
            <div className="px-4 py-4">
              <div className="flex items-center justify-between mb-2.5">
                <h2 className="font-bold text-base text-slate-900">Services</h2>
                {business.services.length > 2 && (
                  <button onClick={() => setSubPage("services")} className="text-xs text-indigo-500 font-semibold flex items-center gap-0.5">
                    See all <ChevronRight size={12} />
                  </button>
                )}
              </div>
              <div className="flex flex-col divide-y divide-slate-100 bg-white rounded-xl border border-slate-100 overflow-hidden">
                {business.services.slice(0, 2).map(svc => (
                  <div key={svc.id} className="flex items-center justify-between px-4 py-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800">{svc.name}</p>
                      {svc.duration > 0 && <p className="text-xs text-slate-400 mt-0.5">{formatDuration(svc.duration)}</p>}
                    </div>
                    <span className="text-sm font-bold text-slate-700 ml-3 shrink-0">{svc.price === 0 ? "Free" : formatINR(svc.price)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="h-px bg-slate-100 mx-4" />

          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-2.5">
              <h2 className="font-bold text-base text-slate-900">Reviews</h2>
              <button onClick={() => setSubPage("reviews")} className="text-xs text-indigo-500 font-semibold flex items-center gap-0.5">
                See all ({MOCK_REVIEWS.length}) <ChevronRight size={12} />
              </button>
            </div>
            <div className="flex flex-col gap-2.5">
              {MOCK_REVIEWS.slice(0, 2).map(r => <ReviewCard key={r.id} review={r} />)}
            </div>
          </div>

          <div className="h-24" />
        </div>

        <div className="shrink-0 bg-white border-t border-slate-100 px-4 py-3 flex gap-3">
          {hasQueue && (
            <button onClick={() => onJoinQueue(business)} className="flex-1 h-12 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform border border-slate-200">
              <Users size={15} className="text-indigo-500" /> Join Queue
            </button>
          )}
          <button
            onClick={() => onBook(business)}
            className={cn("h-12 bg-indigo-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform shadow-md shadow-indigo-200", hasQueue ? "flex-1" : "w-full")}
          >
            Book Now
          </button>
        </div>
      </div>
      </div>

      {lightboxIdx !== null && (
        <PhotoLightbox photos={photos} startIndex={lightboxIdx} onClose={() => setLightboxIdx(null)} />
      )}
    </>
  );
}

function Stars({ rating, size = 11 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5 justify-center mt-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={size} className={i < Math.floor(rating) ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"} />
      ))}
    </div>
  );
}

function RatingBars() {
  return (
    <div className="flex-1 flex flex-col gap-1.5">
      {[5, 4, 3, 2, 1].map(star => (
        <div key={star} className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 w-3 shrink-0">{star}</span>
          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-amber-400 rounded-full" style={{ width: `${star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 7 : star === 2 ? 2 : 1}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: { id: string; name: string; rating: number; text: string; time: string; avatar: string } }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-3">
      <div className="flex items-center gap-2.5 mb-1.5">
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
          <span className="font-bold text-indigo-500 text-xs">{review.avatar}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm leading-none">{review.name}</p>
          <p className="text-xs text-slate-400 mt-0.5">{review.time}</p>
        </div>
        <div className="flex gap-0.5 shrink-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={9} className={i < review.rating ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"} />
          ))}
        </div>
      </div>
      <p className="text-sm text-slate-600 leading-relaxed">{review.text}</p>
    </div>
  );
}

function SubPageWrapper({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-black/60 animate-fade-in">
      <div className="w-full md:max-w-2xl bg-white md:rounded-3xl max-h-[94vh] flex flex-col animate-slide-up overflow-hidden md:mx-4">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 bg-white shrink-0">
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
            <ArrowLeft size={18} />
          </button>
          <h2 className="font-bold text-base flex-1">{title}</h2>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar pb-safe">{children}</div>
      </div>
    </div>
  );
}
