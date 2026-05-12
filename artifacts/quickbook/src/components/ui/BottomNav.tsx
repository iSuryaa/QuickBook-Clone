import { Home, Compass, CalendarDays, User } from "lucide-react";

export type TabName = "home" | "explore" | "bookings" | "profile";

const TABS: { id: TabName; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "explore", label: "Explore", icon: Compass },
  { id: "bookings", label: "Bookings", icon: CalendarDays },
  { id: "profile", label: "Profile", icon: User },
];

interface BottomNavProps {
  activeTab: TabName;
  onTabChange: (tab: TabName) => void;
  bookingCount?: number;
}

export function BottomNav({ activeTab, onTabChange, bookingCount = 0 }: BottomNavProps) {
  return (
    <div className="flex justify-center">
      <div className="w-full bg-white">
        <div className="flex items-center">
          {TABS.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id;
            const showBadge = id === "bookings" && bookingCount > 0;
            return (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className="flex-1 flex flex-col items-center gap-1 py-3 relative transition-all active:scale-95"
              >
                <div className="relative">
                  <Icon
                    size={22}
                    strokeWidth={active ? 2.5 : 1.8}
                    className={active ? "text-indigo-500" : "text-slate-400"}
                  />
                  {showBadge && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 bg-indigo-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
                      {bookingCount > 9 ? "9+" : bookingCount}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] font-semibold transition-colors ${active ? "text-indigo-500" : "text-slate-400"}`}>
                  {label}
                </span>
                {active && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-indigo-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
