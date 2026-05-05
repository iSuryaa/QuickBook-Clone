import { useState, useMemo } from "react";
import { X, ChevronLeft, Calendar, Clock, Users, CheckCircle2, Minus, Plus, Ticket, PartyPopper } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatINR, formatDuration, generateTimeSlots, type Business, type Service, type StaffMember } from "@/data/mock";
import type { Booking } from "@/data/mock";

const DAYS_AHEAD = 14;

function getDateOptions() {
  const opts: { label: string; iso: string; dayNum: string; month: string }[] = [];
  const now = new Date();
  for (let i = 0; i < DAYS_AHEAD; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    const dayNum = d.getDate().toString();
    const month = d.toLocaleDateString("en-IN", { month: "short" });
    const label = i === 0 ? "Today" : i === 1 ? "Tomorrow" : d.toLocaleDateString("en-IN", { weekday: "short" });
    opts.push({ label, iso, dayNum, month });
  }
  return opts;
}

interface BookingFlowSheetProps {
  business: Business;
  initialService?: Service;
  initialStaff?: StaffMember;
  onClose: () => void;
  onSuccess: (booking: Booking) => void;
}

type Step = "datetime" | "persons" | "confirm" | "success";

export function BookingFlowSheet({ business, initialService, initialStaff, onClose, onSuccess }: BookingFlowSheetProps) {
  const [step, setStep] = useState<Step>("datetime");
  const [selectedService, setSelectedService] = useState<Service | null>(initialService ?? (business.services[0] ?? null));
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(initialStaff ?? null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [persons, setPersons] = useState(1);
  const [loading, setLoading] = useState(false);
  const [confirmedToken, setConfirmedToken] = useState("");

  const dates = useMemo(() => getDateOptions(), []);
  const timeSlots = useMemo(() => generateTimeSlots(9, 21, 30), []);

  const stepTitles: Record<Step, string> = {
    datetime: "Pick date & time",
    persons: "Party size",
    confirm: "Review & confirm",
    success: "Booking confirmed!",
  };

  function handleConfirm() {
    setLoading(true);
    setTimeout(() => {
      const token = `QUE-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
      setConfirmedToken(token);
      const booking: Booking = {
        id: `bk_${Date.now()}`,
        businessId: business.id,
        serviceId: selectedService?.id ?? "",
        staffId: selectedStaff?.id,
        date: selectedDate,
        time: selectedTime,
        persons,
        status: "upcoming",
        token,
        createdAt: new Date().toISOString(),
      };
      setLoading(false);
      setStep("success");
      onSuccess(booking);
    }, 1400);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 animate-fade-in" onClick={onClose}>
      <div className="bg-slate-50 w-full max-w-[540px] rounded-t-3xl max-h-[92vh] flex flex-col animate-slide-up" onClick={e => e.stopPropagation()}>
        {step !== "success" && (
          <div className="flex items-center gap-3 px-5 pt-5 pb-4 bg-white rounded-t-3xl border-b border-slate-100 shrink-0">
            <button onClick={step === "datetime" ? onClose : () => {
              if (step === "persons") setStep("datetime");
              else if (step === "confirm") setStep("persons");
            }} className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
              {step === "datetime" ? <X size={18} /> : <ChevronLeft size={18} />}
            </button>
            <div className="flex-1">
              <p className="text-xs text-slate-400 truncate">{business.name}</p>
              <h2 className="font-bold text-base leading-tight">{stepTitles[step]}</h2>
            </div>
            <div className="flex gap-1.5">
              {(["datetime","persons","confirm"] as Step[]).map((s, i) => {
                const idx = ["datetime","persons","confirm"].indexOf(step);
                return <div key={s} className={cn("h-1.5 rounded-full transition-all", i <= idx ? "bg-indigo-500 w-4" : "bg-slate-200 w-1.5")} />;
              })}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {step === "datetime" && (
            <div className="px-5 py-5 flex flex-col gap-6 pb-32 animate-fade-up">
              {business.services.length > 1 && !initialService && (
                <section>
                  <SectionLabel>Select Service</SectionLabel>
                  <div className="flex flex-col gap-2">
                    {business.services.map(svc => (
                      <button key={svc.id} onClick={() => setSelectedService(selectedService?.id === svc.id ? null : svc)}
                        className={cn("flex items-center justify-between p-4 bg-white rounded-2xl border text-left transition-all", selectedService?.id === svc.id ? "border-indigo-400 shadow-sm shadow-indigo-100" : "border-slate-100")}>
                        <div>
                          <p className="text-sm font-bold">{svc.name}</p>
                          <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1"><Clock size={10} /> {formatDuration(svc.duration)}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold">{svc.price === 0 ? "Free" : formatINR(svc.price)}</span>
                          <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center", selectedService?.id === svc.id ? "border-indigo-500 bg-indigo-500" : "border-slate-300")}>
                            {selectedService?.id === svc.id && <CheckCircle2 size={12} className="text-white" />}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              )}

              <section>
                <SectionLabel>Select Date</SectionLabel>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {dates.map(({ label, iso, dayNum, month }) => (
                    <button key={iso} onClick={() => setSelectedDate(iso)}
                      className={cn("flex flex-col items-center gap-0.5 px-3 py-2.5 rounded-2xl border shrink-0 min-w-[58px] transition-all", selectedDate === iso ? "bg-indigo-500 border-indigo-500 text-white" : "bg-white border-slate-100 text-slate-700")}>
                      <span className={cn("text-[10px] font-semibold", selectedDate === iso ? "text-indigo-200" : "text-slate-400")}>{label}</span>
                      <span className="text-lg font-black leading-none">{dayNum}</span>
                      <span className={cn("text-[9px]", selectedDate === iso ? "text-indigo-200" : "text-slate-400")}>{month}</span>
                    </button>
                  ))}
                </div>
              </section>

              {selectedDate && (
                <section className="animate-fade-up">
                  <SectionLabel>Select Time</SectionLabel>
                  <div className="grid grid-cols-4 gap-2">
                    {timeSlots.map(slot => (
                      <button key={slot} onClick={() => setSelectedTime(slot)}
                        className={cn("py-2.5 rounded-xl border text-xs font-bold transition-all", selectedTime === slot ? "bg-indigo-500 border-indigo-500 text-white" : "bg-white border-slate-100 text-slate-700")}>
                        {slot}
                      </button>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}

          {step === "persons" && (
            <div className="px-5 py-6 flex flex-col gap-6 pb-32 animate-fade-up">
              <section>
                <SectionLabel>How many people?</SectionLabel>
                <div className="bg-white rounded-2xl border border-slate-100 p-6 flex items-center justify-between">
                  <button onClick={() => setPersons(p => Math.max(1, p - 1))} className="w-12 h-12 rounded-full border-2 border-slate-200 flex items-center justify-center active:scale-95 transition-transform">
                    <Minus size={18} className="text-slate-600" />
                  </button>
                  <div className="text-center">
                    <span className="text-6xl font-black text-slate-800 tabular-nums">{persons}</span>
                    <p className="text-xs text-slate-400 mt-1">{persons === 1 ? "person" : "people"}</p>
                  </div>
                  <button onClick={() => setPersons(p => Math.min(20, p + 1))} className="w-12 h-12 rounded-full border-2 border-slate-200 flex items-center justify-center active:scale-95 transition-transform">
                    <Plus size={18} className="text-slate-600" />
                  </button>
                </div>
              </section>

              {selectedService && (
                <section>
                  <SectionLabel>Service</SectionLabel>
                  <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm">{selectedService.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{formatDuration(selectedService.duration)}</p>
                    </div>
                    <span className="font-bold text-sm">{selectedService.price === 0 ? "Free" : formatINR(selectedService.price)}</span>
                  </div>
                </section>
              )}

              <section>
                <SectionLabel>Schedule</SectionLabel>
                <div className="bg-white rounded-2xl border border-slate-100 p-4 flex gap-4">
                  <div className="flex items-center gap-2 flex-1">
                    <Calendar size={15} className="text-indigo-400 shrink-0" />
                    <span className="text-sm font-semibold">{new Date(selectedDate + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-1">
                    <Clock size={15} className="text-indigo-400 shrink-0" />
                    <span className="text-sm font-semibold">{selectedTime}</span>
                  </div>
                </div>
              </section>
            </div>
          )}

          {step === "confirm" && (
            <div className="px-5 py-5 flex flex-col gap-4 pb-32 animate-fade-up">
              <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <div className="px-4 pt-4 pb-3 border-b border-slate-50">
                  <p className="font-bold text-sm">{business.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{business.address}</p>
                </div>
                <div className="px-4 py-3 flex flex-col gap-3">
                  {selectedService && <SummaryRow icon={<CheckCircle2 size={14} className="text-indigo-400" />} label="Service" value={selectedService.name} />}
                  {selectedStaff && <SummaryRow icon={<Users size={14} className="text-indigo-400" />} label="Staff" value={selectedStaff.name} />}
                  <SummaryRow icon={<Calendar size={14} className="text-indigo-400" />} label="Date" value={new Date(selectedDate + "T00:00:00").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })} />
                  <SummaryRow icon={<Clock size={14} className="text-indigo-400" />} label="Time" value={selectedTime} />
                  <SummaryRow icon={<Users size={14} className="text-indigo-400" />} label="People" value={`${persons} ${persons === 1 ? "person" : "people"}`} />
                </div>
              </div>

              {selectedService && selectedService.price > 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col gap-2">
                  <SummaryRow label="Service fee" value={formatINR(selectedService.price * persons)} />
                  <SummaryRow label="Platform fee" value="₹15" />
                  <div className="border-t border-slate-100 mt-1 pt-2">
                    <SummaryRow label="Total" value={formatINR(selectedService.price * persons + 1500)} bold />
                  </div>
                </div>
              )}

              <div className="bg-indigo-50 rounded-2xl p-4 flex items-start gap-3 border border-indigo-100">
                <Ticket size={16} className="text-indigo-500 shrink-0 mt-0.5" />
                <p className="text-xs text-indigo-700 leading-relaxed">
                  You'll receive a booking token after confirmation. Show it at the venue to skip the regular queue.
                </p>
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center animate-scale-in">
              <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mb-5">
                <PartyPopper size={42} className="text-emerald-500" />
              </div>
              <h2 className="text-2xl font-black mb-2">You're booked!</h2>
              <p className="text-slate-500 text-sm mb-6">Your appointment at <strong>{business.name}</strong> is confirmed.</p>
              <div className="bg-white rounded-2xl border border-slate-100 p-6 w-full mb-6">
                <p className="text-xs text-slate-400 mb-1">Booking Token</p>
                <p className="text-3xl font-black text-indigo-500 tracking-widest">{confirmedToken}</p>
                <p className="text-xs text-slate-400 mt-2">Show this at the venue to check in</p>
              </div>
              <div className="w-full text-sm text-slate-600 bg-white rounded-2xl border border-slate-100 p-4 flex flex-col gap-2">
                {selectedService && <SummaryRow label="Service" value={selectedService.name} />}
                <SummaryRow label="Date & Time" value={`${new Date(selectedDate + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })} · ${selectedTime}`} />
                <SummaryRow label="People" value={`${persons}`} />
              </div>
              <button onClick={onClose} className="mt-6 w-full h-14 bg-indigo-500 text-white rounded-2xl font-bold shadow-md shadow-indigo-200 active:scale-[0.98] transition-transform">
                View My Bookings
              </button>
            </div>
          )}
        </div>

        {step !== "success" && (
          <div className="px-5 py-4 bg-white border-t border-slate-100 shrink-0 pb-safe">
            <button
              onClick={() => {
                if (step === "datetime") { if (selectedDate && selectedTime) setStep("persons"); }
                else if (step === "persons") setStep("confirm");
                else if (step === "confirm") handleConfirm();
              }}
              disabled={loading || (step === "datetime" && (!selectedDate || !selectedTime))}
              className="w-full h-14 bg-indigo-500 text-white rounded-2xl font-bold text-sm disabled:opacity-60 shadow-md shadow-indigo-200 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="flex gap-1.5">
                  {[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-white/80" style={{ animation: `bounce-dot 1.2s ease-in-out ${i*0.2}s infinite` }} />)}
                </div>
              ) : step === "confirm" ? "Confirm Booking" : "Continue"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">{children}</p>;
}

function SummaryRow({ icon, label, value, bold }: { icon?: React.ReactNode; label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="flex-1 text-xs text-slate-500">{label}</span>
      <span className={cn("text-xs", bold ? "font-black text-slate-800 text-sm" : "font-semibold text-slate-700")}>{value}</span>
    </div>
  );
}
