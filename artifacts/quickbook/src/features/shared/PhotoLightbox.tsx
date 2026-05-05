import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface PhotoLightboxProps {
  photos: string[];
  startIndex?: number;
  onClose: () => void;
}

export function PhotoLightbox({ photos, startIndex = 0, onClose }: PhotoLightboxProps) {
  const [idx, setIdx] = useState(startIndex);
  const prev = () => setIdx(i => (i - 1 + photos.length) % photos.length);
  const next = () => setIdx(i => (i + 1) % photos.length);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black flex flex-col animate-fade-in"
      onClick={onClose}
    >
      <div className="flex items-center justify-between px-4 py-3 shrink-0" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
          <X size={20} className="text-white" />
        </button>
        <span className="text-white/70 text-sm font-semibold">{idx + 1} / {photos.length}</span>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex items-center justify-center relative" onClick={e => e.stopPropagation()}>
        <img
          key={idx}
          src={photos[idx]}
          alt={`Photo ${idx + 1}`}
          className="max-w-full max-h-full object-contain animate-scale-in"
        />
        {photos.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 w-10 h-10 rounded-full bg-white/15 flex items-center justify-center"
            >
              <ChevronLeft size={22} className="text-white" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 w-10 h-10 rounded-full bg-white/15 flex items-center justify-center"
            >
              <ChevronRight size={22} className="text-white" />
            </button>
          </>
        )}
      </div>

      <div className="flex gap-2 px-4 py-4 overflow-x-auto no-scrollbar shrink-0 justify-center" onClick={e => e.stopPropagation()}>
        {photos.map((p, i) => (
          <button key={i} onClick={() => setIdx(i)}
            className={`w-12 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${i === idx ? "border-white" : "border-transparent opacity-50"}`}>
            <img src={p} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
