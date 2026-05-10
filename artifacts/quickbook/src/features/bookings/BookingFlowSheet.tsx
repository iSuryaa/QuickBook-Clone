import { useState, useMemo } from "react";
import { X, ChevronLeft, Calendar, Clock, CheckCircle2, Star, CreditCard, Ticket, PartyPopper, Armchair, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCreateBooking } from "@/hooks/useBookings";
import { processPayment } from "@/services/payment";
import type { ApiBusiness, ApiService, ApiStaff, ApiBooking } from "@/services/api";
import { CinemaSeatSelector, getSeatPrice, SEAT_CATEGORIES } from "./CinemaSeatSelector";

function formatINR(paise: number) {
  return `₹${(paise / 100).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}
function formatDuration(mins: number) {
  if (mins < 60) return `${mins} min`;
  return `${Math.floor(mins / 60)}h ${mins % 60 > 0 ? `${mins % 60}m` : ""}`.trim();
}
function generateTimeSlots(start: number, end: number, step: number) {
  const slots: string[] = [];
  for (let h = start; h < end; h++) {
    for (let m = 0; m < 60; m += step) {
      const hour = h % 12 === 0 ? 12 : h % 12;
      const ampm = h < 12 ? "AM" : "PM";
      slots.push(`${hour}:${m.toString().padStart(2, "0")} ${ampm}`);
    }
  }
  return slots;
}

const DAYS_AHEAD = 14;
const PLATFORM_FEE = 2900;

function getDateOptions() {
  const opts: { label: string; iso: string; dayNum: string; month: string }[] = [];
  const now = new Date();
  for (let i = 0; i < DAYS_AHEAD; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    opts.push({
      iso: d.toISOString().slice(0, 10),
      dayNum: d.getDate().toString(),
      month: d.toLocaleDateString("en-IN", { month: "short" }),
      label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : d.toLocaleDateString("en-IN", { weekday: "short" }),
    });
  }
  return opts;
}

type Step = "service" | "specialist" | "seats" | "datetime" | "payment" | "success";

const STEP_ORDER_NORMAL: Step[] = ["service", "specialist", "datetime", "payment", "success"];
const STEP_ORDER_CINEMA: Step[] = ["service", "seats", "datetime", "payment", "success"];

const STEP_TITLES: Record<Step, string> = {
  service: "Select service", specialist: "Choose specialist",
  seats: "Choose seats", datetime: "Pick date & time", payment: "Payment", success: "Booking confirmed!",
};

interface BookingFlowSheetProps {
  business: ApiBusiness & { services: ApiService[]; staff: ApiStaff[] };
  onClose: () => void;
  onSuccess: (booking: ApiBooking) => void;
}

export function BookingFlowSheet({ business, onClose, onSuccess }: BookingFlowSheetProps) {
  const isCinema = business.category === "entertainment";
  const stepOrder = isCinema ? STEP_ORDER_CINEMA : STEP_ORDER_NORMAL;

  const [step, setStep] = useState<Step>("service");
  const [selectedService, setSelectedService] = useState<ApiService | null>(business.services[0] ?? null);
  const [selectedStaff, setSelectedStaff] = useState<ApiStaff | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [seatCount, setSeatCount] = useState(2);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [confirmedToken, setConfirmedToken] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const createBooking = useCreateBooking();
  const dates = useMemo(() => getDateOptions(), []);
  const timeSlots = useMemo(() => generateTimeSlots(9, 21, 30), []);

  const stepIdx = stepOrder.indexOf(step);
  const progressSteps = stepOrder.filter(s => s !== "success");

  const goNext = () => { const next = stepOrder[stepIdx + 1]; if (next) setStep(next); };
  const goBack = () => { if (stepIdx === 0) { onClose(); return; } setStep(stepOrder[stepIdx - 1]); };

  const seatTotal = selectedSeats.reduce((acc, s) => acc + getSeatPrice(s), 0);
  const servicePrice = selectedService?.price ?? 0;

  const canContinue = () => {
    if (step === "service") return !!selectedService;
    if (step === "seats") return selectedSeats.length === seatCount;
    if (step === "datetime") return !!selectedDate && !!selectedTime;
    return true;
  };

  async function handleConfirm() {
    setPaymentError("");
    setIsProcessingPayment(true);
    try {
      const payment = await processPayment(PLATFORM_FEE);
      if (payment.status !== "success") {
        setPaymentError("Payment failed. Please try again.");
        setIsProcessingPayment(false);
        return;
      }
      const result = await createBooking.mutateAsync({
        businessId: business.id,
        serviceId: selectedService?.id,
        staffId: selectedStaff?.id,
        date: selectedDate,
        time: selectedTime,
        persons: isCinema ? seatCount : 1,
        seats: isCinema && selectedSeats.length > 0 ? selectedSeats : undefined,
      });
      setConfirmedToken(result.booking.token);
      setStep("success");
      onSuccess(result.booking);
    } catch (e: any) {
      setPaymentError(e?.message ?? "Booking failed. Please try again.");
    } finally {
      setIsProcessingPayment(false);
    }
  }

  const loading = isProcessingPayment || createBooking.isPending;

  const sheetContent = (
    <>
      {step !== "success" && (
        <div className="flex items-center gap-3 px-5 pt-5 pb-4 bg-white rounded-t-3xl border-b border-slate-100 shrink-0">
          <button onClick={goBack} className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
            {stepIdx === 0 ? <X size={18} /> : <ChevronLeft size={18} />}
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-400 truncate">{business.name}</p>
            <h2 className="font-bold text-base leading-tight">{STEP_TITLES[step]}</h2>
          </div>
          <div className="flex gap-1.5">
            {progressSteps.map((s, i) => (
              <div key={s} className={cn("h-1.5 rounded-full transition-all", i <= stepIdx ? "bg-indigo-500 w-4" : "bg-slate-200 w-1.5")} />
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto no-scrollbar">

        {step === "service" && (
          <div className="px-5 py-5 flex flex-col gap-3 pb-32 animate-fade-up">
            <p className="text-xs text-slate-400">What can we help you with?</p>
            {business.services.map(svc => (
              <button key={svc.id} onClick={() => setSelectedService(svc)}
                className={cn("flex items-center justify-between p-4 bg-white rounded-2xl border text-left transition-all active:scale-[0.99]",
                  selectedService?.id === svc.id ? "border-indigo-400 shadow-sm shadow-indigo-100 bg-indigo-50/20" : "border-slate-100")}>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold">{svc.name}</p>
                  {svc.description && <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{svc.description}</p>}
                  {svc.duration > 0 && <p className="text-xs text-slate-400 mt-1 flex items-center gap-1"><Clock size={9} /> {formatDuration(svc.duration)}</p>}
                </div>
                <div className="flex items-center gap-3 ml-3 shrink-0">
                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-800 block">{svc.price === 0 ? "Free" : formatINR(svc.price)}</span>
                    <span className="text-[10px] text-slate-400">reference price</span>
                  </div>
                  <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                    selectedService?.id === svc.id ? "border-indigo-500 bg-indigo-500" : "border-slate-300")}>
                    {selectedService?.id === svc.id && <CheckCircle2 size={12} className="text-white" />}
                  </div>
                </div>
              </button>
            ))}
            <div className="flex items-start gap-2.5 bg-indigo-50 rounded-2xl p-3.5 border border-indigo-100 mt-1">
              <Info size={14} className="text-indigo-400 shrink-0 mt-0.5" />
              <p className="text-xs text-indigo-700 leading-relaxed">
                Service prices are for reference only. You pay just ₹29 as a platform fee to confirm your booking.
              </p>
            </div>
          </div>
        )}

        {step === "specialist" && !isCinema && (
          <div className="px-5 py-5 flex flex-col gap-3 pb-32 animate-fade-up">
            <button onClick={() => setSelectedStaff(null)}
              className={cn("flex items-center gap-4 p-4 bg-white rounded-2xl border text-left transition-all active:scale-[0.99]",
                selectedStaff === null ? "border-indigo-400 shadow-sm shadow-indigo-100 bg-indigo-50/20" : "border-slate-100")}>
              <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                <Star size={18} className="text-slate-400" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm">Any available</p>
                <p className="text-xs text-slate-400 mt-0.5">Assigned to next available specialist</p>
              </div>
              <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                selectedStaff === null ? "border-indigo-500 bg-indigo-500" : "border-slate-300")}>
                {selectedStaff === null && <CheckCircle2 size={12} className="text-white" />}
              </div>
            </button>
            {business.staff.map(st => (
              <button key={st.id} onClick={() => setSelectedStaff(st)}
                className={cn("flex items-center gap-4 p-4 bg-white rounded-2xl border text-left transition-all active:scale-[0.99]",
                  selectedStaff?.id === st.id ? "border-indigo-400 shadow-sm shadow-indigo-100 bg-indigo-50/20" : "border-slate-100")}>
                <div className="w-11 h-11 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                  <span className="font-black text-indigo-500">{st.name.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm">{st.name}</p>
                  <p className="text-xs text-slate-400">{st.role}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={10} className="text-amber-400 fill-amber-400" />
                    <span className="text-xs font-semibold text-slate-600">{st.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                  selectedStaff?.id === st.id ? "border-indigo-500 bg-indigo-500" : "border-slate-300")}>
                  {selectedStaff?.id === st.id && <CheckCircle2 size={12} className="text-white" />}
                </div>
              </button>
            ))}
          </div>
        )}

        {step === "seats" && isCinema && (
          <div className="px-4 py-5 pb-32 animate-fade-up">
            <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-4 flex items-center gap-3">
              <div className="flex-1">
                <p className="text-sm font-bold">{selectedService?.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{business.name}</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-xs text-slate-500">Seats:</p>
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <button key={n} onClick={() => { setSeatCount(n); setSelectedSeats([]); }}
                    className={cn("w-8 h-8 rounded-full border text-xs font-bold transition-all",
                      seatCount === n ? "bg-indigo-500 border-indigo-500 text-white" : "bg-white border-slate-200 text-slate-600")}>
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <CinemaSeatSelector selected={selectedSeats} maxSeats={seatCount} onSelectionChange={setSelectedSeats} />
            {selectedSeats.length > 0 && (
              <div className="mt-4 bg-indigo-50 rounded-2xl p-4 border border-indigo-100 animate-fade-up">
                <p className="text-xs font-bold text-indigo-600 mb-2">Selected seats</p>
                <div className="flex flex-wrap gap-2">
                  {selectedSeats.map(s => {
                    const row = s.charAt(0);
                    const cat = SEAT_CATEGORIES.find(c => c.rows.includes(row));
                    return <span key={s} className={cn("px-2.5 py-1 rounded-full text-xs font-bold", cat?.selectedStyle)}>{s}</span>;
                  })}
                </div>
                <p className="text-xs text-indigo-600 mt-2 font-semibold">Seat total (reference): {formatINR(seatTotal)}</p>
              </div>
            )}
          </div>
        )}

        {step === "datetime" && (
          <div className="px-5 py-5 flex flex-col gap-6 pb-32 animate-fade-up">
            <section>
              <Label>Select Date</Label>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-5 px-5">
                {dates.map(({ label, iso, dayNum, month }) => (
                  <button key={iso} onClick={() => setSelectedDate(iso)}
                    className={cn("flex flex-col items-center gap-0.5 px-3 py-2.5 rounded-2xl border shrink-0 min-w-[58px] transition-all",
                      selectedDate === iso ? "bg-indigo-500 border-indigo-500 text-white" : "bg-white border-slate-100 text-slate-700")}>
                    <span className={cn("text-[10px] font-semibold", selectedDate === iso ? "text-indigo-200" : "text-slate-400")}>{label}</span>
                    <span className="text-lg font-black leading-none">{dayNum}</span>
                    <span className={cn("text-[9px]", selectedDate === iso ? "text-indigo-200" : "text-slate-400")}>{month}</span>
                  </button>
                ))}
              </div>
            </section>
            {selectedDate && (
              <section className="animate-fade-up">
                <Label>Select Time</Label>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map(slot => (
                    <button key={slot} onClick={() => setSelectedTime(slot)}
                      className={cn("py-2.5 rounded-xl border text-xs font-bold transition-all",
                        selectedTime === slot ? "bg-indigo-500 border-indigo-500 text-white" : "bg-white border-slate-100 text-slate-700")}>
                      {slot}
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {step === "payment" && (
          <div className="px-5 py-5 flex flex-col gap-4 pb-32 animate-fade-up">
            {(paymentError || createBooking.isError) && (
              <div className="bg-red-50 border border-red-100 rounded-2xl px-4 py-3 text-sm text-red-600">
                {paymentError || (createBooking.error as Error)?.message || "Booking failed. Please try again."}
              </div>
            )}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="px-4 pt-4 pb-3 border-b border-slate-50 flex items-center gap-3">
                <img src={business.imageUrl} className="w-10 h-10 rounded-xl object-cover" alt="" />
                <div>
                  <p className="font-bold text-sm">{business.name}</p>
                  <p className="text-xs text-slate-400">{business.address}</p>
                </div>
              </div>
              <div className="px-4 py-3 flex flex-col gap-3 text-sm">
                {selectedService && <Row icon={<CheckCircle2 size={13} className="text-indigo-400" />} label="Service" value={selectedService.name} />}
                {!isCinema && selectedStaff && <Row icon={<Star size={13} className="text-indigo-400" />} label="Specialist" value={selectedStaff.name} />}
                {isCinema && selectedSeats.length > 0 && <Row icon={<Armchair size={13} className="text-indigo-400" />} label="Seats" value={selectedSeats.join(", ")} />}
                <Row icon={<Calendar size={13} className="text-indigo-400" />} label="Date"
                  value={new Date(selectedDate + "T00:00:00").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })} />
                <Row icon={<Clock size={13} className="text-indigo-400" />} label="Time" value={selectedTime} />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col gap-3">
              <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Price Summary</p>
              {selectedService && servicePrice > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 flex items-center gap-1.5"><Info size={12} className="text-slate-300" /> Service price (reference)</span>
                  <span className="text-slate-400 line-through">{formatINR(servicePrice)}</span>
                </div>
              )}
              {isCinema && seatTotal > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 flex items-center gap-1.5"><Info size={12} className="text-slate-300" /> Seat price (reference)</span>
                  <span className="text-slate-400 line-through">{formatINR(seatTotal)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm border-t border-slate-50 pt-2">
                <span className="text-slate-700 font-semibold flex items-center gap-1.5"><CreditCard size={13} className="text-indigo-400" /> Platform fee (pay now)</span>
                <span className="font-bold text-indigo-500">₹29</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 text-xs">Service fee (pay at venue)</span>
                <span className="text-slate-400 text-xs">{selectedService && servicePrice > 0 ? formatINR(servicePrice) : "—"}</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 pt-2">
                <span className="font-black text-base">Total payable now</span>
                <span className="font-black text-xl text-indigo-500">₹29</span>
              </div>
            </div>

            <div className="bg-amber-50 rounded-2xl p-4 flex items-start gap-3 border border-amber-100">
              <Ticket size={15} className="text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 leading-relaxed">You pay only ₹29 to reserve your slot. The service fee is paid directly at the venue.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-4">
              <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">Pay via</p>
              {["UPI / GPay / PhonePe", "Credit / Debit Card", "Net Banking"].map((method, i) => (
                <label key={method} className={cn("flex items-center gap-3 cursor-pointer", i > 0 && "mt-3")}>
                  <input type="radio" name="payment" defaultChecked={i === 0} className="accent-indigo-500" />
                  <span className="text-sm font-semibold text-slate-700">{method}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="flex flex-col items-center justify-center py-10 px-6 text-center animate-scale-in">
            <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mb-5">
              <PartyPopper size={42} className="text-emerald-500" />
            </div>
            <h2 className="text-2xl font-black mb-2">You're booked!</h2>
            <p className="text-slate-500 text-sm mb-6">
              Your {isCinema ? "seats are" : "appointment at"} <strong>{business.name}</strong> is confirmed.
            </p>
            <div className="bg-white rounded-2xl border border-slate-100 p-6 w-full mb-5">
              <p className="text-xs text-slate-400 mb-1">Booking Token</p>
              <p className="text-3xl font-black text-indigo-500 tracking-widest">{confirmedToken}</p>
              <p className="text-xs text-slate-400 mt-2">Show this at the venue to check in</p>
            </div>
            <div className="w-full text-sm text-slate-600 bg-white rounded-2xl border border-slate-100 p-4 flex flex-col gap-2.5">
              {selectedService && <SRow label="Service" value={selectedService.name} />}
              {isCinema && selectedSeats.length > 0 && <SRow label="Seats" value={selectedSeats.join(", ")} />}
              <SRow label="Date & Time" value={`${new Date(selectedDate + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })} · ${selectedTime}`} />
              <SRow label="Platform fee paid" value="₹29" />
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
            onClick={step === "payment" ? handleConfirm : goNext}
            disabled={loading || !canContinue()}
            className="w-full h-14 bg-indigo-500 text-white rounded-2xl font-bold text-sm disabled:opacity-50 shadow-md shadow-indigo-200 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
          >
            {loading
              ? (
                <div className="flex flex-col items-center gap-1">
                  <div className="flex gap-1.5">{[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-white/80" style={{ animation: `bounce-dot 1.2s ease-in-out ${i*0.2}s infinite` }} />)}</div>
                  {step === "payment" && <span className="text-xs text-white/70">Processing payment…</span>}
                </div>
              )
              : step === "payment" ? "Confirm & Pay ₹29" : step === "seats" ? `Continue (${selectedSeats.length}/${seatCount} selected)` : "Continue"
            }
          </button>
        </div>
      )}
    </>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 animate-fade-in" onClick={step === "success" ? undefined : onClose}>
      <div
        className="bg-slate-50 w-full max-w-[540px] md:max-w-lg rounded-t-3xl md:rounded-3xl max-h-[94vh] md:max-h-[88vh] flex flex-col animate-slide-up md:mx-4"
        onClick={e => e.stopPropagation()}
      >
        {sheetContent}
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">{children}</p>;
}
function Row({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="flex-1 text-xs text-slate-500">{label}</span>
      <span className="text-xs font-semibold text-slate-700 text-right max-w-[60%] truncate">{value}</span>
    </div>
  );
}
function SRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-xs font-semibold text-slate-700">{value}</span>
    </div>
  );
}
