import { useState, useMemo } from "react";
import { X, Star, MapPin, Clock, Phone, Heart, ChevronRight, Users, CheckCircle2, ArrowRight, Images, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatINR, formatPriceLevel, formatDuration, getCategoryLabel, BUSINESSES, type Business, type Service, type StaffMember } from "@/data/mock";
import { PhotoLightbox } from "@/features/shared/PhotoLightbox";

interface BusinessDetailSheetProps {
  businessId: string;
  onClose: () => void;
  onBook: (business: Business) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

const MOCK_REVIEWS = [
  { id: "r1", name: "Priya M.", rating: 5, text: "Absolutely brilliant experience. Staff was warm and professional.", time: "2 days ago", avatar: "P" },
  { id: "r2", name: "Arjun K.", rating: 4, text: "Very efficient and clean. Only minor wait time issue.", time: "1 week ago", avatar: "A" },
  { id: "r3", name: "Sneha R.", rating: 5, text: "Highly recommend! Booked via QuickBook, no queue at all.", time: "2 weeks ago", avatar: "S" },
  { id: "r4", name: "Vikram T.", rating: 4, text: "Great service overall. Will definitely visit again soon.", time: "3 weeks ago", avatar: "V" },
  { id: "r5", name: "Meera J.", rating: 5, text: "Exceptional quality. One of the best in the city without a doubt.", time: "1 month ago", avatar: "M" },
];

type SubSheet = "photos" | "reviews" | "services" | "hours" | null;

export function BusinessDetailSheet({ businessId, onClose, onBook, isFavorite, onToggleFavorite }: BusinessDetailSheetProps) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [subSheet, setSubSheet] = useState<SubSheet>(null);
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const business = useMemo(() => BUSINESSES.find(b => b.id === businessId), [businessId]);

  if (!business) return null;

  const today = new Date().toLocaleDateString("en-IN", { weekday: "long" }).slice(0, 3);
  const todayHours = business.hoursDetail?.[today] ?? business.hours;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 animate-fade-in" onClick={onClose}>
        <div className="bg-slate-50 w-full max-w-[540px] rounded-t-3xl max-h-[94vh] flex flex-col animate-slide-up" onClick={e => e.stopPropagation()}>

          {/* Hero */}
          <div className="relative h-56 shrink-0 rounded-t-3xl overflow-hidden">
            <img src={business.imageUrl} alt={business.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            <button onClick={onClose} className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/35 backdrop-blur-sm flex items-center justify-center">
              <X size={18} className="text-white" />
            </button>
            <button onClick={e => { e.stopPropagation(); onToggleFavorite(business.id); }}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/35 backdrop-blur-sm flex items-center justify-center">
              <Heart size={16} className={cn(isFavorite ? "text-red-400 fill-red-400" : "text-white")} />
            </button>
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-xs font-semibold text-indigo-300 mb-0.5">{getCategoryLabel(business.category)}</p>
              <h2 className="text-xl font-bold text-white leading-tight">{business.name}</h2>
              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                <span className={cn("text-xs font-bold px-2.5 py-0.5 rounded-full", business.openNow ? "bg-emerald-500 text-white" : "bg-slate-600 text-white")}>
                  {business.openNow ? "Open now" : "Closed"}
                </span>
                <span className="flex items-center gap-1 text-white text-xs">
                  <Star size={11} className="text-amber-400 fill-amber-400" />
                  <strong>{business.rating.toFixed(1)}</strong>
                  <span className="text-white/65">({business.reviewCount.toLocaleString()})</span>
                </span>
                <span className="text-white/65 text-xs">{formatPriceLevel(business.priceLevel)}</span>
                {business.distanceKm && <span className="flex items-center gap-1 text-white/65 text-xs"><MapPin size={10} />{business.distanceKm} km</span>}
              </div>
            </div>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto no-scrollbar">

            {/* Quick info strip */}
            <div className="bg-white px-5 py-4 flex flex-col gap-2.5 border-b border-slate-100">
              <InfoRow icon={<MapPin size={14} className="text-indigo-400 shrink-0" />} text={business.address} />
              <InfoRow icon={<Clock size={14} className="text-indigo-400 shrink-0" />} text={`Today: ${todayHours}`} />
              {business.phone && <InfoRow icon={<Phone size={14} className="text-indigo-400 shrink-0" />} text={business.phone} />}
              {business.queueCount > 0 && (
                <InfoRow icon={<Users size={14} className="text-amber-500 shrink-0" />}
                  text={`${business.queueCount} in queue · ~${business.waitTimeMinutes} min wait`}
                  textClass="text-amber-700 font-semibold" />
              )}
            </div>

            <div className="px-4 py-4 flex flex-col gap-5">

              {/* About */}
              <Section>
                <SectionHeader title="About" />
                <p className={cn("text-sm text-slate-600 leading-relaxed", !aboutExpanded && "line-clamp-3")}>
                  {business.description}
                </p>
                <button onClick={() => setAboutExpanded(x => !x)} className="flex items-center gap-1 text-xs font-semibold text-indigo-500 mt-1">
                  {aboutExpanded ? <><ChevronUp size={13} /> Show less</> : <><ChevronDown size={13} /> Read more</>}
                </button>
              </Section>

              {/* Photos */}
              {business.photos.length > 0 && (
                <Section>
                  <SectionHeader title="Photos" action="See all" onAction={() => setSubSheet("photos")} />
                  <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
                    {business.photos.map((p, i) => (
                      <button key={i} onClick={() => setLightboxIdx(i)} className="shrink-0 w-28 h-20 rounded-xl overflow-hidden active:scale-95 transition-transform">
                        <img src={p} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                      </button>
                    ))}
                    {business.photos.length >= 4 && (
                      <button onClick={() => setSubSheet("photos")} className="shrink-0 w-28 h-20 rounded-xl bg-slate-800/80 flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform">
                        <Images size={20} className="text-white" />
                        <span className="text-white text-xs font-bold">See all</span>
                      </button>
                    )}
                  </div>
                </Section>
              )}

              {/* Amenities */}
              {business.amenities.length > 0 && (
                <Section>
                  <SectionHeader title="Amenities" />
                  <div className="flex flex-wrap gap-2">
                    {business.amenities.map(a => (
                      <span key={a} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold border border-indigo-100">
                        <CheckCircle2 size={10} /> {a}
                      </span>
                    ))}
                  </div>
                </Section>
              )}

              {/* Hours */}
              {business.hoursDetail && (
                <Section>
                  <SectionHeader title="Opening hours" action="See all" onAction={() => setSubSheet("hours")} />
                  <div className="flex flex-col gap-1.5">
                    {Object.entries(business.hoursDetail).slice(0, 3).map(([day, hrs]) => (
                      <div key={day} className="flex items-center justify-between text-sm">
                        <span className={cn("font-semibold", day.slice(0,3) === today ? "text-indigo-500" : "text-slate-600")}>{day}</span>
                        <span className={cn("text-xs", hrs === "Closed" ? "text-red-400 font-semibold" : "text-slate-500")}>{hrs}</span>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* Services (reference only) */}
              <Section>
                <SectionHeader title="Services" action={business.services.length > 3 ? "See all" : undefined} onAction={() => setSubSheet("services")} />
                <p className="text-xs text-slate-400 mb-2">Prices shown for reference — you pay only the platform fee</p>
                <div className="flex flex-col gap-2">
                  {business.services.slice(0, 3).map(svc => (
                    <div key={svc.id} className="flex items-center justify-between bg-white rounded-2xl border border-slate-100 p-3.5">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold leading-tight">{svc.name}</p>
                        {svc.description && <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{svc.description}</p>}
                        {svc.duration > 0 && <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1"><Clock size={9} /> {formatDuration(svc.duration)}</p>}
                      </div>
                      <span className="text-sm font-bold text-slate-700 ml-3 shrink-0">{svc.price === 0 ? "Free" : formatINR(svc.price)}</span>
                    </div>
                  ))}
                </div>
              </Section>

              {/* Reviews */}
              <Section>
                <SectionHeader title="Reviews" action="See all" onAction={() => setSubSheet("reviews")} />
                <div className="flex items-center gap-4 bg-white rounded-2xl border border-slate-100 p-4 mb-3">
                  <div className="text-center shrink-0">
                    <p className="text-4xl font-black text-slate-800">{business.rating.toFixed(1)}</p>
                    <div className="flex gap-0.5 mt-1 justify-center">
                      {Array.from({length:5}).map((_,i) => (
                        <Star key={i} size={10} className={i < Math.floor(business.rating) ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"} />
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">{business.reviewCount.toLocaleString()} reviews</p>
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                    {[5,4,3,2,1].map(star => (
                      <div key={star} className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400 w-3 shrink-0">{star}</span>
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: `${star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 7 : star === 2 ? 2 : 1}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  {MOCK_REVIEWS.slice(0, 2).map(r => <ReviewCard key={r.id} review={r} />)}
                </div>
              </Section>

              <div className="h-28" />
            </div>
          </div>

          {/* Fixed Book Now */}
          <div className="px-5 py-4 bg-white border-t border-slate-100 shrink-0 pb-safe">
            <button
              onClick={() => onBook(business)}
              className="w-full h-14 bg-indigo-500 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 active:scale-[0.98] transition-transform"
            >
              Book Now <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Sub-sheets */}
      {subSheet === "photos" && (
        <PhotoGallerySubSheet photos={business.photos} onClose={() => setSubSheet(null)} onOpenLightbox={setLightboxIdx} />
      )}
      {subSheet === "reviews" && (
        <AllReviewsSubSheet business={business} reviews={MOCK_REVIEWS} onClose={() => setSubSheet(null)} />
      )}
      {subSheet === "services" && (
        <AllServicesSubSheet services={business.services} onClose={() => setSubSheet(null)} />
      )}
      {subSheet === "hours" && business.hoursDetail && (
        <AllHoursSubSheet hours={business.hoursDetail} today={today} onClose={() => setSubSheet(null)} />
      )}

      {/* Photo lightbox */}
      {lightboxIdx !== null && (
        <PhotoLightbox photos={business.photos} startIndex={lightboxIdx} onClose={() => setLightboxIdx(null)} />
      )}
    </>
  );
}

/* ── sub-components ─────────────────────────────────────── */

function Section({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-3">{children}</div>;
}

function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="font-bold text-sm text-slate-800">{title}</h3>
      {action && onAction && (
        <button onClick={onAction} className="text-xs text-indigo-500 font-semibold flex items-center gap-0.5">
          {action} <ChevronRight size={12} />
        </button>
      )}
    </div>
  );
}

function InfoRow({ icon, text, textClass }: { icon: React.ReactNode; text: string; textClass?: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5">{icon}</div>
      <p className={cn("text-sm text-slate-600 leading-snug", textClass)}>{text}</p>
    </div>
  );
}

function ReviewCard({ review }: { review: { id: string; name: string; rating: number; text: string; time: string; avatar: string } }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
          <span className="font-bold text-indigo-500 text-xs">{review.avatar}</span>
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm">{review.name}</p>
          <p className="text-xs text-slate-400">{review.time}</p>
        </div>
        <div className="flex gap-0.5">
          {Array.from({length:5}).map((_,i) => (
            <Star key={i} size={9} className={i < review.rating ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"} />
          ))}
        </div>
      </div>
      <p className="text-sm text-slate-600 leading-relaxed">{review.text}</p>
    </div>
  );
}

/* ── Sub-sheet overlays ────────────────────────────────── */

function PhotoGallerySubSheet({ photos, onClose, onOpenLightbox }: { photos: string[]; onClose: () => void; onOpenLightbox: (i: number) => void }) {
  return (
    <SubSheetWrapper title="Photos" count={photos.length} onClose={onClose}>
      <div className="grid grid-cols-3 gap-2 p-4">
        {photos.map((p, i) => (
          <button key={i} onClick={() => { onClose(); onOpenLightbox(i); }} className="aspect-square rounded-xl overflow-hidden active:scale-95 transition-transform">
            <img src={p} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </SubSheetWrapper>
  );
}

function AllReviewsSubSheet({ business, reviews, onClose }: { business: Business; reviews: typeof MOCK_REVIEWS; onClose: () => void }) {
  return (
    <SubSheetWrapper title="Reviews" count={business.reviewCount} onClose={onClose}>
      <div className="px-4 py-4 flex flex-col gap-4">
        <div className="flex items-center gap-4 bg-white rounded-2xl border border-slate-100 p-4">
          <div className="text-center shrink-0">
            <p className="text-5xl font-black text-slate-800">{business.rating.toFixed(1)}</p>
            <div className="flex gap-0.5 mt-1 justify-center">
              {Array.from({length:5}).map((_,i) => (
                <Star key={i} size={12} className={i < Math.floor(business.rating) ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"} />
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-1">{business.reviewCount.toLocaleString()} reviews</p>
          </div>
          <div className="flex-1 flex flex-col gap-1.5">
            {[5,4,3,2,1].map(star => (
              <div key={star} className="flex items-center gap-2">
                <span className="text-xs text-slate-400 w-3">{star}</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 7 : star === 2 ? 2 : 1}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        {reviews.map(r => <ReviewCard key={r.id} review={r} />)}
      </div>
    </SubSheetWrapper>
  );
}

function AllServicesSubSheet({ services, onClose }: { services: Business["services"]; onClose: () => void }) {
  return (
    <SubSheetWrapper title="All Services" count={services.length} onClose={onClose}>
      <div className="px-4 py-4 flex flex-col gap-3">
        <p className="text-xs text-slate-400">Prices shown for reference only — you pay just the platform fee</p>
        {services.map(svc => (
          <div key={svc.id} className="flex items-center justify-between bg-white rounded-2xl border border-slate-100 p-4">
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm">{svc.name}</p>
              {svc.description && <p className="text-xs text-slate-400 mt-0.5">{svc.description}</p>}
              {svc.duration > 0 && <p className="text-xs text-slate-400 mt-1 flex items-center gap-1"><Clock size={9} /> {formatDuration(svc.duration)}</p>}
            </div>
            <span className="text-sm font-bold text-slate-700 ml-3 shrink-0">{svc.price === 0 ? "Free" : formatINR(svc.price)}</span>
          </div>
        ))}
      </div>
    </SubSheetWrapper>
  );
}

function AllHoursSubSheet({ hours, today, onClose }: { hours: Record<string, string>; today: string; onClose: () => void }) {
  return (
    <SubSheetWrapper title="Opening Hours" onClose={onClose}>
      <div className="px-4 py-4 bg-white rounded-2xl mx-4 border border-slate-100 flex flex-col divide-y divide-slate-50">
        {Object.entries(hours).map(([day, hrs]) => (
          <div key={day} className={cn("flex items-center justify-between py-3.5", day.slice(0,3) === today && "bg-indigo-50/40 -mx-4 px-4 rounded-xl")}>
            <div className="flex items-center gap-2">
              <span className={cn("text-sm font-bold", day.slice(0,3) === today ? "text-indigo-500" : "text-slate-700")}>{day}</span>
              {day.slice(0,3) === today && <span className="text-[10px] font-bold bg-indigo-500 text-white px-1.5 py-0.5 rounded-full">Today</span>}
            </div>
            <span className={cn("text-sm font-semibold", hrs === "Closed" ? "text-red-400" : "text-slate-500")}>{hrs}</span>
          </div>
        ))}
      </div>
    </SubSheetWrapper>
  );
}

function SubSheetWrapper({ title, count, onClose, children }: { title: string; count?: number; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 animate-fade-in" onClick={onClose}>
      <div className="bg-slate-50 w-full max-w-[540px] rounded-t-3xl max-h-[85vh] flex flex-col animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-center px-5 pt-5 pb-4 bg-white border-b border-slate-100 rounded-t-3xl shrink-0">
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center mr-3">
            <X size={18} />
          </button>
          <h2 className="font-bold flex-1">{title}</h2>
          {count !== undefined && <span className="text-xs text-slate-400">{count}</span>}
        </div>
        <div className="flex-1 overflow-y-auto pb-safe">{children}</div>
      </div>
    </div>
  );
}
