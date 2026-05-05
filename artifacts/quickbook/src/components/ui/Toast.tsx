import { useEffect, useState, useCallback } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

let _listeners: ((item: ToastItem) => void)[] = [];

export function toast(message: string, type: ToastType = "info") {
  const item: ToastItem = { id: Math.random().toString(36).slice(2), message, type };
  _listeners.forEach(fn => fn(item));
}

export function ToastContainer() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    const listener = (item: ToastItem) => {
      setItems(prev => [...prev, item]);
      setTimeout(() => {
        setItems(prev => prev.filter(i => i.id !== item.id));
      }, 3500);
    };
    _listeners.push(listener);
    return () => { _listeners = _listeners.filter(fn => fn !== listener); };
  }, []);

  const remove = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  if (!items.length) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-full max-w-sm px-4 pointer-events-none">
      {items.map(item => (
        <div
          key={item.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg pointer-events-auto animate-scale-in ${
            item.type === "success" ? "bg-emerald-500 text-white" :
            item.type === "error" ? "bg-red-500 text-white" :
            "bg-slate-800 text-white"
          }`}
        >
          {item.type === "success" ? <CheckCircle2 size={18} className="shrink-0" /> :
           item.type === "error" ? <XCircle size={18} className="shrink-0" /> :
           <Info size={18} className="shrink-0" />}
          <p className="flex-1 text-sm font-medium">{item.message}</p>
          <button onClick={() => remove(item.id)} className="shrink-0 opacity-80 hover:opacity-100">
            <X size={15} />
          </button>
        </div>
      ))}
    </div>
  );
}
