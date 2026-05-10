import { useState } from "react";
import { Star, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingModalProps {
  businessName: string;
  onSubmit: (rating: number, review: string) => void;
  onDismiss: () => void;
}

export function RatingModal({ businessName, onSubmit, onDismiss }: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [review, setReview] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const LABELS = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

  const handleSubmit = () => {
    if (rating === 0) return;
    setSubmitted(true);
    setTimeout(() => {
      onSubmit(rating, review);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end md:items-center justify-center bg-black/60 animate-fade-in" onClick={onDismiss}>
      <div
        className="bg-white w-full max-w-[480px] md:max-w-md rounded-t-3xl md:rounded-3xl p-6 animate-slide-up md:mx-4"
        onClick={e => e.stopPropagation()}
      >
        {submitted ? (
          <div className="flex flex-col items-center py-6 text-center animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
              <Star size={30} className="text-amber-500 fill-amber-500" />
            </div>
            <h2 className="font-black text-lg mb-1">Thank you!</h2>
            <p className="text-sm text-slate-500">Your review helps others discover great places.</p>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="font-black text-lg text-slate-900">Rate your experience</h2>
                <p className="text-sm text-slate-500 mt-0.5">{businessName}</p>
              </div>
              <button onClick={onDismiss} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                <X size={16} />
              </button>
            </div>

            <div className="flex flex-col items-center gap-3 mb-6">
              <div className="flex gap-3">
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    onClick={() => setRating(n)}
                    onMouseEnter={() => setHovered(n)}
                    onMouseLeave={() => setHovered(0)}
                    className="transition-transform active:scale-90"
                  >
                    <Star
                      size={38}
                      className={cn(
                        "transition-colors",
                        n <= (hovered || rating)
                          ? "text-amber-400 fill-amber-400"
                          : "text-slate-200 fill-slate-200"
                      )}
                    />
                  </button>
                ))}
              </div>
              {(hovered || rating) > 0 && (
                <p className="text-sm font-bold text-amber-500 animate-fade-up">{LABELS[hovered || rating]}</p>
              )}
            </div>

            <textarea
              value={review}
              onChange={e => setReview(e.target.value)}
              placeholder="Share your experience (optional)…"
              rows={3}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-indigo-300 transition-colors resize-none mb-4"
            />

            <button
              onClick={handleSubmit}
              disabled={rating === 0}
              className="w-full py-3.5 bg-indigo-500 text-white font-bold rounded-2xl text-sm active:scale-[0.98] transition-all disabled:opacity-40 shadow-md shadow-indigo-200"
            >
              Submit Review
            </button>
          </>
        )}
      </div>
    </div>
  );
}
