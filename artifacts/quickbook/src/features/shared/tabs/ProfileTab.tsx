import { User, Bell, MapPin, CreditCard, Heart, HelpCircle, Settings, LogOut, ChevronRight, CalendarDays, Star, Shield } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import type { User as UserType } from "@/store/authStore";

interface ProfileTabProps {
  user: UserType | null;
  isLoggedIn: boolean;
  unreadCount: number;
  onGoHome: () => void;
  onOpenNotifications: () => void;
  onOpenFavourites: () => void;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export function ProfileTab({ user, isLoggedIn, unreadCount, onGoHome, onOpenNotifications, onOpenFavourites, onOpenLogin, onLogout }: ProfileTabProps) {
  if (!isLoggedIn) {
    return (
      <div className="pt-12 px-4 md:px-6">
        <h1 className="text-2xl font-black mb-6">Profile</h1>
        <EmptyState
          icon={User}
          title="Sign in to your account"
          description="Manage bookings, favourites, notifications and more."
          action={{ label: "Sign in", onClick: onOpenLogin }}
        />
      </div>
    );
  }

  const initials = user?.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="pt-12 px-4 md:px-6 pb-8 animate-fade-up">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center shadow-md">
          <span className="text-xl font-black text-white">{initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-black text-lg truncate">{user?.name}</p>
          <p className="text-sm text-slate-500">+91 {user?.phone}</p>
          {user?.email && <p className="text-xs text-slate-400 truncate mt-0.5">{user.email}</p>}
        </div>
        <div className="bg-indigo-50 text-indigo-500 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
          <Star size={10} className="fill-indigo-400 text-indigo-400" /> Member
        </div>
      </div>

      <MenuGroup label="Activity">
        <MenuItem icon={Bell} label="Notifications" badge={unreadCount} onClick={onOpenNotifications} />
        <MenuItem icon={CalendarDays} label="Booking history" onClick={() => {}} />
        <MenuItem icon={Heart} label="Favourites" onClick={onOpenFavourites} />
      </MenuGroup>

      <MenuGroup label="Account">
        <MenuItem icon={MapPin} label="Saved addresses" onClick={() => {}} />
        <MenuItem icon={CreditCard} label="Payment methods" onClick={() => {}} />
        <MenuItem icon={Shield} label="Privacy & security" onClick={() => {}} />
      </MenuGroup>

      <MenuGroup label="More">
        <MenuItem icon={HelpCircle} label="Help & FAQ" onClick={() => {}} />
        <MenuItem icon={Settings} label="Settings" onClick={() => {}} />
      </MenuGroup>

      <button onClick={onLogout} className="w-full mt-2 flex items-center gap-3 px-4 py-4 text-red-500 font-bold text-sm rounded-2xl hover:bg-red-50 transition-colors active:scale-[0.99] transition-transform">
        <LogOut size={18} />
        Sign out
      </button>

      <p className="text-center text-xs text-slate-300 mt-6">QuickBook v1.0.0</p>
    </div>
  );
}

function MenuGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2 px-1">{label}</p>
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden divide-y divide-slate-50 shadow-sm">
        {children}
      </div>
    </div>
  );
}

function MenuItem({ icon: Icon, label, badge, onClick }: { icon: typeof User; label: string; badge?: number; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-slate-50 transition-colors active:scale-[0.99] group">
      <Icon size={18} className="text-slate-400 shrink-0 group-hover:text-indigo-400 transition-colors" />
      <span className="flex-1 text-sm font-semibold">{label}</span>
      {badge != null && badge > 0 && (
        <span className="min-w-[20px] h-5 bg-indigo-500 text-white text-[9px] font-black rounded-full flex items-center justify-center px-1.5 mr-1">
          {badge}
        </span>
      )}
      <ChevronRight size={15} className="text-slate-300 shrink-0" />
    </button>
  );
}
