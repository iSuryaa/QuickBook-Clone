import { useState } from "react";
import { User, Bell, Heart, HelpCircle, Settings, LogOut, ChevronRight, Star, Shield, Edit2, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { useMe } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import type { ApiUser } from "@/services/api";

interface ProfileTabProps {
  user: ApiUser | null;
  isLoggedIn: boolean;
  unreadCount: number;
  onGoHome: () => void;
  onOpenNotifications: () => void;
  onOpenFavourites: () => void;
  onOpenLogin: () => void;
  onLogout: () => void;
  onEditProfile: () => void;
}

export function ProfileTab({ user, isLoggedIn, unreadCount, onGoHome, onOpenNotifications, onOpenFavourites, onOpenLogin, onLogout, onEditProfile }: ProfileTabProps) {
  const [showPolicy, setShowPolicy] = useState(false);
  const { data: meData } = useMe(isLoggedIn);
  const noShowCount = meData?.user?.noShowCount ?? 0;

  if (!isLoggedIn) {
    return (
      <div className="pt-12 px-4 md:px-8 pb-28">
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

  const displayName = user?.name ?? "User";
  const initials = displayName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="pt-12 px-4 md:px-8 pb-28 animate-fade-up">
      <div className="flex items-center gap-4 mb-8">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center shadow-md">
            <span className="text-xl font-black text-white">{initials}</span>
          </div>
          <button
            onClick={onEditProfile}
            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center"
          >
            <Edit2 size={11} className="text-slate-500" />
          </button>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-black text-lg truncate">{displayName}</p>
          </div>
          <p className="text-sm text-slate-500">{user?.phone}</p>
          {user?.email && <p className="text-xs text-slate-400 truncate mt-0.5">{user.email}</p>}
          <div className="flex items-center gap-2 mt-1">
            <span className={cn("text-xs font-semibold", noShowCount > 0 ? "text-red-500" : "text-slate-400")}>
              Strikes: {noShowCount}
            </span>
            {noShowCount > 0 && (
              <button
                onClick={() => setShowPolicy(true)}
                className="text-xs text-indigo-500 underline hover:text-indigo-600 transition-colors"
              >
                Learn more
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="bg-indigo-50 text-indigo-500 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
            <Star size={10} className="fill-indigo-400 text-indigo-400" /> Member
          </div>
          <button onClick={onEditProfile} className="text-xs text-indigo-500 font-semibold hover:text-indigo-600 transition-colors">
            Edit profile
          </button>
        </div>
      </div>

      <MenuGroup label="Activity">
        <MenuItem icon={Bell} label="Notifications" badge={unreadCount} onClick={onOpenNotifications} />
        <MenuItem icon={Heart} label="Favourites" onClick={onOpenFavourites} />
      </MenuGroup>

      <MenuGroup label="Account">
        <MenuItem icon={User} label="Edit Profile" onClick={onEditProfile} />
        <MenuItem icon={Shield} label="Privacy & Security" onClick={() => {}} />
        <MenuItem icon={Settings} label="Settings" onClick={() => {}} />
        <MenuItem icon={HelpCircle} label="Help & Support" onClick={() => {}} />
      </MenuGroup>

      <MenuGroup label="">
        <MenuItem icon={LogOut} label="Sign out" danger onClick={onLogout} />
      </MenuGroup>

      <div id="cancellation-policy" className="mt-2 bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
        <button
          onClick={() => setShowPolicy(v => !v)}
          className="w-full flex items-center justify-between px-4 py-3.5 text-left"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle size={15} className="text-amber-500 shrink-0" />
            <span className="text-sm font-semibold text-slate-700">Cancellation Policy</span>
          </div>
          {showPolicy ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
        </button>
        {showPolicy && (
          <div className="px-4 pb-4 text-xs text-slate-500 leading-relaxed flex flex-col gap-2 border-t border-slate-100 pt-3 animate-fade-up">
            <p>
              <strong className="text-slate-700">Free cancellation</strong> is available up to 2 hours before your appointment. The platform fee (₹29) is non-refundable after booking.
            </p>
            <p>
              <strong className="text-slate-700">Strikes</strong> are issued when you miss an appointment without cancelling. Accumulating 3 or more strikes may temporarily restrict your ability to book.
            </p>
            <p>Each strike is automatically removed after 6 months of good standing.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function MenuGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      {label && <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2 px-1">{label}</p>}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden divide-y divide-slate-50">
        {children}
      </div>
    </div>
  );
}

function MenuItem({ icon: Icon, label, badge, danger, onClick }: { icon: React.ComponentType<{ size?: number; className?: string }>; label: string; badge?: number; danger?: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-slate-50 transition-colors active:bg-slate-100">
      <Icon size={18} className={danger ? "text-red-400" : "text-slate-400"} />
      <span className={`flex-1 text-sm font-semibold ${danger ? "text-red-500" : "text-slate-700"}`}>{label}</span>
      {badge != null && badge > 0 && (
        <span className="bg-indigo-500 text-white text-[10px] font-black rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">{badge}</span>
      )}
      {!danger && <ChevronRight size={15} className="text-slate-300" />}
    </button>
  );
}
