import { useState } from "react";
import { X, Bell, BellOff, ShoppingBag, Clock, Tag, CheckCheck } from "lucide-react";
import { MOCK_NOTIFICATIONS, type Notification } from "@/data/mock";
import { cn } from "@/lib/utils";

const TYPE_ICON = {
  booking:  ShoppingBag,
  reminder: Clock,
  promo:    Tag,
  queue:    Bell,
};

const TYPE_COLOR = {
  booking:  "bg-blue-100 text-blue-500",
  reminder: "bg-amber-100 text-amber-500",
  promo:    "bg-purple-100 text-purple-500",
  queue:    "bg-indigo-100 text-indigo-500",
};

export function NotificationsPanel({ onClose }: { onClose: () => void }) {
  const [notifs, setNotifs] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const markAll = () => setNotifs(n => n.map(x => ({ ...x, read: true })));
  const markOne = (id: string) => setNotifs(n => n.map(x => x.id === id ? { ...x, read: true } : x));
  const unread = notifs.filter(n => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 animate-fade-in" onClick={onClose}>
      <div className="bg-white w-full max-w-[540px] md:max-w-md md:rounded-3xl rounded-t-3xl max-h-[85vh] flex flex-col animate-slide-up md:mx-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center px-5 pt-5 pb-4 border-b border-slate-100 shrink-0">
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center mr-3">
            <X size={18} />
          </button>
          <div className="flex-1">
            <h2 className="font-bold">Notifications</h2>
            {unread > 0 && <p className="text-xs text-slate-400">{unread} unread</p>}
          </div>
          {unread > 0 && (
            <button onClick={markAll} className="flex items-center gap-1.5 text-xs text-indigo-500 font-semibold">
              <CheckCheck size={14} /> Mark all read
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-50 pb-safe">
          {notifs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <BellOff size={32} className="text-slate-300 mb-3" />
              <p className="font-semibold text-slate-400">No notifications yet</p>
            </div>
          ) : notifs.map(n => {
            const Icon = TYPE_ICON[n.type];
            return (
              <button key={n.id} onClick={() => markOne(n.id)}
                className={cn("w-full flex items-start gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50", !n.read && "bg-indigo-50/40")}>
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5", TYPE_COLOR[n.type])}>
                  <Icon size={17} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={cn("text-sm leading-tight", !n.read ? "font-bold text-slate-800" : "font-semibold text-slate-600")}>{n.title}</p>
                    <span className="text-[10px] text-slate-400 shrink-0 mt-0.5">{n.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.message}</p>
                </div>
                {!n.read && <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-2" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
