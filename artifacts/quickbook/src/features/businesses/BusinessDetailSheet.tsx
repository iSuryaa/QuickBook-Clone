import { useState, useMemo } from "react";
import { X, Star, MapPin, Clock, Phone, Globe, Heart, ChevronRight, Users, CheckCircle2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatINR, formatPriceLevel, formatDuration, getCategoryLabel, BUSINESSES, type Business, type Service, type StaffMember } from "@/data/mock";
import { Skeleton } from "@/components/ui/Skeleton";

interface BusinessDetailSheetProps {
  businessId: string;
  onClose: () => void;
  onBook: (business: Business, service?: Service, staff?: StaffMember) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

const TABS = ["Overview", "Services", "Reviews"] as const;
type Tab = typeof TABS[number];

const MOCK_REVIEWS = [
  { id: "r1", name: "Priya M.", rating: 5, text: "Absolutely brilliant experience. Staff was warm and professional.", time: "2 days ago", avatar: "P" },
  { id: "r2", name: "Arjun K.", rating: 4, text: "Very efficient and clean. Only minor wait time issue.", time: "1 week ago", avatar: "A" },
  { id: "r3", name: "Sneha R.", rating: 5, text: "Highly recommend! Booked via QuickBook, no queue at all.", time: "2 weeks ago", avatar: "S" },
];

export function BusinessDetailSheet({ businessId, onClose, onBook, isFavorite, onToggleFavorite }: BusinessDetailSheetProps) {
  const [loading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  const business = useMemo(() => BUSINESSES.find(b => b.id === businessId), [businessId]);

  if (!business) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 animate-fade-in" onClick={onClose}>
      <div
        className="bg-slate-50 w-full max-w-[540px] rounded-t-3xl max-h-[92vh] flex flex-col animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative h-52 shrink-0 rounded-t-3xl overflow-hidden">
          {loading ? (
            <Skeleton className="h-full w-full rounded-none" />
          ) : (
            <>
              <img src={business.imageUrl} alt={business.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            </>
          )}
          <button onClick={onClose} className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
            <X size={18} className="text-white" />
          </button>
          <button onClick={e => { e.stopPropagation(); onToggleFavorite(business.id); }}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
            <Heart size={16} className={cn(isFavorite ? "text-red-400 fill-red-400" : "text-white")} />
          </button>
          {!loading && (
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-xs font-semibold text-indigo-300 mb-0.5">{getCategoryLabel(business.category)}</p>
              <h2 className="text-xl font-bold text-white leading-tight">{business.name}</h2>
              <div className="flex items-center gap-3 mt-1.5">
                <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full", business.openNow ? "bg-emerald-500 text-white" : "bg-slate-500 text-white")}>
                  {business.openNow ? "Open" : "Closed"}
                </span>
                <span className="flex items-center gap-1 text-white text-xs">
                  <Star size={11} className="text-amber-400 fill-amber-400" />
                  <strong>{business.rating.toFixed(1)}</strong>
                  <span className="text-white/70">({business.reviewCount.toLocaleString()})</span>
                </span>
                <span className="text-white/70 text-xs">{formatPriceLevel(business.priceLevel)}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-0 border-b border-slate-100 bg-white shrink-0">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={cn("flex-1 py-3.5 text-sm font-semibold border-b-2 transition-all", activeTab === tab ? "border-indigo-500 text-indigo-500" : "border-transparent text-slate-500")}>
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeTab === "Overview" && (
            <div className="p-5 flex flex-col gap-5 animate-fade-up">
              <div className="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col gap-3">
                <InfoRow icon={<MapPin size={15} className="text-indigo-400" />} text={business.address} />
                <InfoRow icon={<Clock size={15} className="text-indigo-400" />} text={business.hours} />
                {business.phone && <InfoRow icon={<Phone size={15} className="text-indigo-400" />} text={business.phone} />}
                <InfoRow icon={<Users size={15} className="text-indigo-400" />} text={`${business.queueCount} currently in queue · ~${business.waitTimeMinutes} min wait`} />
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">About</p>
                <p className="text-sm text-slate-600 leading-relaxed">{business.description}</p>
              </div>

              {business.amenities.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 p-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Amenities</p>
                  <div className="flex flex-wrap gap-2">
                    {business.amenities.map(a => (
                      <span key={a} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold">
                        <CheckCircle2 size={11} />
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "Services" && (
            <div className="p-5 flex flex-col gap-3 animate-fade-up">
              <p className="text-xs text-slate-400">Select a service to book</p>
              {business.services.map(svc => (
                <button key={svc.id} onClick={() => setSelectedService(selectedService?.id === svc.id ? null : svc)}
                  className={cn("flex items-center justify-between p-4 bg-white rounded-2xl border text-left transition-all active:scale-[0.99]",
                    selectedService?.id === svc.id ? "border-indigo-400 shadow-sm shadow-indigo-100 bg-indigo-50/30" : "border-slate-100")}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold">{svc.name}</p>
                    {svc.description && <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{svc.description}</p>}
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1"><Clock size={10} /> {formatDuration(svc.duration)}</p>
                  </div>
                  <div className="flex items-center gap-3 ml-3 shrink-0">
                    <span className="text-sm font-bold text-slate-800">{svc.price === 0 ? "Free" : formatINR(svc.price)}</span>
                    <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                      selectedService?.id === svc.id ? "border-indigo-500 bg-indigo-500" : "border-slate-300")}>
                      {selectedService?.id === svc.id && <CheckCircle2 size={12} className="text-white" />}
                    </div>
                  </div>
                </button>
              ))}

              {business.staff.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Choose Staff (optional)</p>
                  <div className="flex flex-col gap-2">
                    {business.staff.map(st => (
                      <button key={st.id} onClick={() => setSelectedStaff(selectedStaff?.id === st.id ? null : st)}
                        className={cn("flex items-center gap-3 p-3 bg-white rounded-2xl border transition-all",
                          selectedStaff?.id === st.id ? "border-indigo-400 bg-indigo-50/30" : "border-slate-100")}>
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                          <span className="font-bold text-indigo-500">{st.name.charAt(0)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm">{st.name}</p>
                          <p className="text-xs text-slate-400">{st.role}</p>
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <Star size={11} className="text-amber-400 fill-amber-400" />
                          <span className="font-semibold">{st.rating.toFixed(1)}</span>
                        </div>
                        {selectedStaff?.id === st.id && <CheckCircle2 size={16} className="text-indigo-500 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "Reviews" && (
            <div className="p-5 flex flex-col gap-4 animate-fade-up">
              <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4">
                <div className="text-center">
                  <p className="text-4xl font-black text-slate-800">{business.rating.toFixed(1)}</p>
                  <div className="flex gap-0.5 mt-1 justify-center">
                    {Array.from({length:5}).map((_,i) => (
                      <Star key={i} size={12} className={i < Math.floor(business.rating) ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"} />
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{business.reviewCount.toLocaleString()} reviews</p>
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  {[5,4,3,2,1].map(star => (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 w-3">{star}</span>
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 7 : star === 2 ? 2 : 1}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {MOCK_REVIEWS.map(r => (
                <div key={r.id} className="bg-white rounded-2xl border border-slate-100 p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="font-bold text-indigo-500 text-sm">{r.avatar}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{r.name}</p>
                      <p className="text-xs text-slate-400">{r.time}</p>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({length:5}).map((_,i) => (
                        <Star key={i} size={10} className={i < r.rating ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">{r.text}</p>
                </div>
              ))}
            </div>
          )}
          <div className="h-32" />
        </div>

        <div className="px-5 py-4 bg-white border-t border-slate-100 shrink-0 pb-safe">
          <button
            onClick={() => { onBook(business, selectedService ?? undefined, selectedStaff ?? undefined); }}
            className="w-full h-14 bg-indigo-500 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 active:scale-[0.98] transition-transform"
          >
            <span>Book Now</span>
            {selectedService && <span className="opacity-75 text-xs">· {selectedService.name}</span>}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="shrink-0 mt-0.5">{icon}</div>
      <p className="text-sm text-slate-600">{text}</p>
    </div>
  );
}
