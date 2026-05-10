import { useState, useCallback } from "react";
import { Home, Compass, CalendarDays, User, Zap } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { BottomNav, type TabName } from "@/components/ui/BottomNav";
import { HomeTab } from "./tabs/HomeTab";
import { ExploreTab } from "./tabs/ExploreTab";
import { BookingsTab } from "./tabs/BookingsTab";
import { ProfileTab } from "./tabs/ProfileTab";
import { BusinessDetailSheet } from "@/features/businesses/BusinessDetailSheet";
import { BookingFlowSheet } from "@/features/bookings/BookingFlowSheet";
import { QueueTrackerSheet } from "@/features/bookings/QueueTrackerSheet";
import { NotificationsPanel } from "@/features/profile/NotificationsPanel";
import { FavouritesSheet } from "@/features/profile/FavouritesSheet";
import { LoginScreen } from "@/features/auth/LoginScreen";
import { useAuthState } from "@/hooks/useAuth";
import { useFavoritesStore } from "@/store/favoritesStore";
import { useCreateBooking } from "@/hooks/useBookings";
import { useBookings } from "@/hooks/useBookings";
import { cn } from "@/lib/utils";
import type { ApiBusiness, ApiService, ApiStaff, ApiBooking } from "@/services/api";

type FullBusiness = ApiBusiness & { services: ApiService[]; staff: ApiStaff[] };

type ModalState =
  | { type: "businessDetail"; businessId: string }
  | { type: "bookingFlow"; business: FullBusiness }
  | { type: "queueTracker"; bookingId: string; businessName: string; businessAddress?: string; initialPosition?: number; totalInQueue?: number }
  | { type: "notifications" }
  | { type: "favourites" }
  | { type: "login"; afterLoginAction?: () => void }
  | null;

const NAV_ITEMS: { id: TabName; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "explore", label: "Explore", icon: Compass },
  { id: "bookings", label: "Bookings", icon: CalendarDays },
  { id: "profile", label: "Profile", icon: User },
];

export function AppShell() {
  const auth = useAuthState();
  const { favIds, toggle: toggleFav } = useFavoritesStore();
  const [activeTab, setActiveTab] = useState<TabName>("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [exploreCategoryFilter, setExploreCategoryFilter] = useState<string | undefined>();
  const [modal, setModal] = useState<ModalState>(null);
  const createBooking = useCreateBooking();
  const qc = useQueryClient();

  const { data: bookingsData } = useBookings(auth.isLoggedIn);
  const bookingCount = bookingsData?.bookings?.length ?? 0;

  const closeModal = useCallback(() => setModal(null), []);

  const openBusinessDetail = useCallback((id: string) => {
    setModal({ type: "businessDetail", businessId: id });
  }, []);

  const openBookingFlow = useCallback((business: FullBusiness) => {
    if (!auth.isLoggedIn) {
      setModal({ type: "login", afterLoginAction: () => setModal({ type: "bookingFlow", business }) });
      return;
    }
    setModal({ type: "bookingFlow", business });
  }, [auth.isLoggedIn]);

  const openQueueTracker = useCallback((bookingId: string, businessName: string, businessAddress?: string, initialPosition?: number, totalInQueue?: number) => {
    setModal({ type: "queueTracker", bookingId, businessName, businessAddress, initialPosition, totalInQueue });
  }, []);

  const handleJoinQueue = useCallback(async (business: ApiBusiness) => {
    if (!auth.isLoggedIn) {
      setModal({ type: "login" });
      return;
    }
    try {
      const result = await createBooking.mutateAsync({
        businessId: business.id,
        serviceId: undefined,
        date: new Date().toISOString().slice(0, 10),
        time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        persons: 1,
        isQueueJoin: true,
      });
      openQueueTracker(result.booking.id, business.name, business.address, business.queueCount + 1, business.queueCount + 1);
    } catch {
      // silently ignore
    }
  }, [auth.isLoggedIn, createBooking, openQueueTracker]);

  const goToExplore = useCallback((category?: string) => {
    setExploreCategoryFilter(category);
    setActiveTab("explore");
    setModal(null);
  }, []);

  const goToBookings = useCallback(() => {
    setActiveTab("bookings");
    setModal(null);
    qc.invalidateQueries({ queryKey: ["bookings"] });
  }, [qc]);

  const handleTabChange = useCallback((tab: TabName) => {
    setActiveTab(tab);
    setModal(null);
  }, []);

  const initials = auth.user?.name
    ? auth.user.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()
    : null;

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex md:flex-col md:w-64 lg:w-72 bg-white border-r border-slate-200 h-screen sticky top-0 shrink-0">
        <div className="p-5 pb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center shadow-md shadow-indigo-200">
              <Zap size={18} className="text-white fill-white" />
            </div>
            <div>
              <p className="font-black text-slate-800 leading-none">QuickBook</p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Skip the queue</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 flex flex-col gap-1">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => handleTabChange(id)}
                className={cn(
                  "flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-semibold text-left transition-all",
                  active
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                )}
              >
                <Icon size={19} strokeWidth={active ? 2.5 : 1.8} className={active ? "text-indigo-500" : "text-slate-400"} />
                <span className="flex-1">{label}</span>
                {id === "bookings" && bookingCount > 0 && (
                  <span className="bg-indigo-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                    {bookingCount}
                  </span>
                )}
                {active && id !== "bookings" && (
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          {auth.isLoggedIn && auth.user ? (
            <div className="flex items-center gap-3 px-1">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center shrink-0">
                <span className="text-xs font-black text-white">{initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">{auth.user.name}</p>
                <p className="text-xs text-slate-400">Member</p>
              </div>
              <button
                onClick={auth.logout}
                className="text-xs text-slate-400 hover:text-red-400 transition-colors font-semibold px-2 py-1 rounded-lg hover:bg-red-50"
              >
                Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setModal({ type: "login" })}
              className="w-full py-2.5 bg-indigo-500 text-white text-sm font-bold rounded-2xl hover:bg-indigo-600 transition-colors shadow-md shadow-indigo-200"
            >
              Sign in
            </button>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 min-w-0 pb-20 md:pb-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto animate-fade-up">
          {activeTab === "home" && (
            <HomeTab
              onGoExplore={goToExplore}
              searchQuery={searchQuery}
              onSearchChange={q => { setSearchQuery(q); if (q) setActiveTab("explore"); }}
              onViewBusiness={openBusinessDetail}
              onOpenNotifications={() => {
                if (!auth.isLoggedIn) { setModal({ type: "login" }); return; }
                setModal({ type: "notifications" });
              }}
              isLoggedIn={auth.isLoggedIn}
              userName={auth.user?.name ?? undefined}
              favIds={favIds}
              onToggleFavorite={toggleFav}
            />
          )}
          {activeTab === "explore" && (
            <ExploreTab
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              initialCategory={exploreCategoryFilter}
              onViewBusiness={openBusinessDetail}
              favIds={favIds}
              onToggleFavorite={toggleFav}
            />
          )}
          {activeTab === "bookings" && (
            <BookingsTab
              isLoggedIn={auth.isLoggedIn}
              onGoHome={() => setActiveTab("home")}
              onViewQueue={openQueueTracker}
              onLogin={() => setModal({ type: "login" })}
            />
          )}
          {activeTab === "profile" && (
            <ProfileTab
              user={auth.user ?? null}
              isLoggedIn={auth.isLoggedIn}
              unreadCount={0}
              onGoHome={() => setActiveTab("home")}
              onOpenNotifications={() => setModal({ type: "notifications" })}
              onOpenFavourites={() => setModal({ type: "favourites" })}
              onOpenLogin={() => setModal({ type: "login" })}
              onLogout={auth.logout}
            />
          )}
        </div>
      </main>

      {/* BOTTOM NAV — mobile only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40">
        <BottomNav
          activeTab={activeTab}
          onTabChange={handleTabChange}
          bookingCount={bookingCount}
        />
      </nav>

      {/* MODALS */}
      {modal?.type === "login" && (
        <LoginScreen
          onBack={closeModal}
          onSuccess={(u, tok) => {
            auth.setAuth(tok, u);
            const action = (modal as { type: "login"; afterLoginAction?: () => void }).afterLoginAction;
            closeModal();
            action?.();
          }}
        />
      )}
      {modal?.type === "businessDetail" && (
        <BusinessDetailSheet
          businessId={modal.businessId}
          onClose={closeModal}
          onBook={openBookingFlow}
          onJoinQueue={handleJoinQueue}
          isFavorite={favIds.includes(modal.businessId)}
          onToggleFavorite={toggleFav}
        />
      )}
      {modal?.type === "bookingFlow" && (
        <BookingFlowSheet
          business={modal.business}
          onClose={closeModal}
          onSuccess={(_booking: ApiBooking) => goToBookings()}
        />
      )}
      {modal?.type === "queueTracker" && (
        <QueueTrackerSheet
          bookingId={modal.bookingId}
          businessName={modal.businessName}
          businessAddress={modal.businessAddress}
          initialPosition={modal.initialPosition}
          totalInQueue={modal.totalInQueue}
          onClose={closeModal}
        />
      )}
      {modal?.type === "notifications" && <NotificationsPanel onClose={closeModal} />}
      {modal?.type === "favourites" && (
        <FavouritesSheet
          favIds={favIds}
          onClose={closeModal}
          onViewBusiness={id => { closeModal(); openBusinessDetail(id); }}
          onToggleFavorite={toggleFav}
        />
      )}
    </div>
  );
}
