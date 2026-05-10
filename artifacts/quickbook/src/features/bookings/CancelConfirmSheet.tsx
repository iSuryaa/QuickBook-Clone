import { AlertTriangle, X } from "lucide-react";

interface CancelConfirmSheetProps {
  bookingToken: string;
  businessName: string;
  onConfirm: () => void;
  onDismiss: () => void;
  isLoading?: boolean;
}

export function CancelConfirmSheet({ bookingToken, businessName, onConfirm, onDismiss, isLoading }: CancelConfirmSheetProps) {
  return (
    <div className="fixed inset-0 z-[70] flex items-end md:items-center justify-center bg-black/60 animate-fade-in" onClick={onDismiss}>
      <div
        className="bg-white w-full max-w-[480px] md:max-w-md rounded-t-3xl md:rounded-3xl p-6 animate-slide-up md:mx-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center shrink-0">
            <AlertTriangle size={22} className="text-red-500" />
          </div>
          <button onClick={onDismiss} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
            <X size={16} />
          </button>
        </div>

        <h2 className="font-black text-lg text-slate-900 mb-1">Cancel Booking?</h2>
        <p className="text-sm text-slate-500 leading-relaxed mb-1">
          You're about to cancel your booking at <strong className="text-slate-700">{businessName}</strong>
          {bookingToken && <> (token <span className="font-mono text-indigo-500">{bookingToken}</span>)</>}.
        </p>
        <p className="text-sm text-slate-400 leading-relaxed mb-6">
          This action cannot be undone. A partial refund of the platform fee may apply based on cancellation timing.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full h-13 py-3.5 bg-red-500 text-white font-bold rounded-2xl text-sm active:scale-[0.98] transition-transform disabled:opacity-60 shadow-md shadow-red-100"
          >
            {isLoading ? "Cancelling…" : "Yes, Cancel Booking"}
          </button>
          <button
            onClick={onDismiss}
            className="w-full h-13 py-3.5 bg-slate-100 text-slate-700 font-bold rounded-2xl text-sm active:scale-[0.98] transition-transform"
          >
            Keep Booking
          </button>
        </div>
      </div>
    </div>
  );
}
