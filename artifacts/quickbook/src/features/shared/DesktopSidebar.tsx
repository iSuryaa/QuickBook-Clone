import { Home, Compass, CalendarDays, User, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TabName } from "@/components/ui/BottomNav";

const NAV_ITEMS: { id: TabName; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "explore", label: "Explore", icon: Compass },
  { id: "bookings", label: "Bookings", icon: CalendarDays },
  { id: "profile", label: "Profile", icon: User },
];

interface DesktopSidebarProps {
  activeTab: TabName;
  onTabChange: (tab: TabName) => void;
  isLoggedIn: boolean;
  userName?: string;
  onLogout?: () => void;
}

export function DesktopSidebar({ activeTab, onTabChange, isLoggedIn, userName, onLogout }: DesktopSidebarProps) {
  const initials = userName
    ? userName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : null;

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 lg:w-72 bg-white border-r border-slate-100 h-screen sticky top-0 p-5 shrink-0">
      <div className="flex items-center gap-2.5 mb-8 px-1">
        <div className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center shadow-md shadow-indigo-200">
          <Zap size={18} className="text-white fill-white" />
        </div>
        <div>
          <p className="font-black text-slate-800 leading-none">QuickBook</p>
          <p className="text-[10px] text-slate-400 font-medium mt-0.5">Skip the queue</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all text-left w-full",
                active
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              )}
            >
              <Icon
                size={19}
                strokeWidth={active ? 2.5 : 1.8}
                className={active ? "text-indigo-500" : "text-slate-400"}
              />
              {label}
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />
              )}
            </button>
          );
        })}
      </nav>

      {isLoggedIn && userName ? (
        <div className="border-t border-slate-100 pt-4 mt-4">
          <div className="flex items-center gap-3 px-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center shrink-0">
              <span className="text-xs font-black text-white">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate">{userName}</p>
              <p className="text-xs text-slate-400">Member</p>
            </div>
            {onLogout && (
              <button
                onClick={onLogout}
                className="text-xs text-slate-400 hover:text-red-400 transition-colors font-semibold px-2 py-1 rounded-lg hover:bg-red-50"
              >
                Out
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="border-t border-slate-100 pt-4 mt-4">
          <button
            onClick={() => onTabChange("profile")}
            className="w-full px-4 py-3 bg-indigo-500 text-white rounded-2xl text-sm font-bold shadow-md shadow-indigo-200 hover:bg-indigo-600 transition-colors"
          >
            Sign in
          </button>
        </div>
      )}
    </aside>
  );
}
