import { useState, useCallback } from "react";
import { Home, Compass, CalendarDays, User, Zap } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { BottomNav, type TabName } from "@/components/ui/BottomNav";
import { TabRouter } from "./TabRouter";
import { SheetManager, type ModalState, type FullBusiness } from "./SheetManager";
import { useAuthState } from "@/hooks/useAuth";
import { useFavoritesStore } from "@/store/favoritesStore";
import { useCreateBooking, useBookings, useCancelBooking } from "@/hooks/useBookings";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/Toast";
import type { ApiBusiness, ApiService, ApiBooking } from "@/services/api";
import type { BookingFlowStep } from "@/features/bookings/BookingFlowSheet";

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
  const [city, setCity] = useState("Mumbai");

  const createBooking = useCreateBooking();
  const cancelBooking = useCancelBooking();
  const qc = useQueryClient();

  const { data: bookingsData } = useBookings(auth.isLoggedIn);
  const bookingCount = bookingsData?.bookings?.length ?? 0;

  const closeModal = useCallback(() => setModal(null), []);

  const openBusinessDetail = useCallback((id: string) => {
    setModal({ type: "businessDetail", businessId: id });
  }, []);

  const openBookingFlow = useCallback((business: FullBusiness, initialStep?: BookingFlowStep, initialService?: ApiService) => {
    if (!auth.isLoggedIn) {
      setModal({ type: "login", afterLoginAction: () => setModal({ type: "bookingFlow", business, initialStep, initialService }) });
      return;
    }
    setModal({ type: "bookingFlow", business, initialStep, initialService });
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
    }
  }, [auth.isLoggedIn, createBooking, openQueueTracker]);

  const handleLeaveQueue = useCallback(async (bookingId: string) => {
    try {
      await cancelBooking.mutateAsync(bookingId);
      toast("You've left the queue", "info");
    } catch {
      toast("Couldn't leave queue. Please try again.", "error");
    }
  }, [cancelBooking]);

  const handleReschedule = useCallback((booking: ApiBooking) => {
    const businesses = qc.getQueriesData<{ businesses: ApiBusiness[] }>({ queryKey: ["businesses"] });
    let foundBusiness: FullBusiness | undefined;

    for (const [, data] of businesses) {
      const b = data?.businesses?.find(x => x.id === booking.businessId);
      if (b) {
        const detailData = qc.getQueryData<FullBusiness>(["business", booking.businessId]);
        if (detailData) { foundBusiness = detailData; break; }
        break;
      }
    }

    if (!foundBusiness) {
      toast("Opening reschedule…", "info");
      setModal({ type: "businessDetail", businessId: booking.businessId });
      return;
    }
    setModal({ type: "bookingFlow", business: foundBusiness, initialStep: "datetime" });
  }, [qc]);

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
                  active ? "bg-indigo-50 text-indigo-600" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                )}
              >
                <Icon size={19} strokeWidth={active ? 2.5 : 1.8} className={active ? "text-indigo-500" : "text-slate-400"} />
                <span className="flex-1">{label}</span>
                {id === "bookings" && bookingCount > 0 && (
                  <span className="bg-indigo-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">{bookingCount}</span>
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
          <TabRouter
            activeTab={activeTab}
            searchQuery={searchQuery}
            onSearchChange={q => { setSearchQuery(q); if (q) setActiveTab("explore"); }}
            exploreCategoryFilter={exploreCategoryFilter}
            onGoExplore={goToExplore}
            onViewBusiness={openBusinessDetail}
            onOpenNotifications={() => {
              if (!auth.isLoggedIn) { setModal({ type: "login" }); return; }
              setModal({ type: "notifications" });
            }}
            onOpenCitySelector={() => setModal({ type: "citySelector" })}
            isLoggedIn={auth.isLoggedIn}
            user={auth.user ?? null}
            city={city}
            favIds={favIds}
            onToggleFavorite={toggleFav}
            onGoHome={() => setActiveTab("home")}
            onViewQueue={openQueueTracker}
            onLogin={() => setModal({ type: "login" })}
            onReschedule={handleReschedule}
            unreadCount={2}
            onOpenFavourites={() => setModal({ type: "favourites" })}
            onOpenLogin={() => setModal({ type: "login" })}
            onLogout={auth.logout}
            onEditProfile={() => { if (auth.isLoggedIn) setModal({ type: "editProfile" }); }}
          />
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

      <SheetManager
        modal={modal}
        onClose={closeModal}
        favIds={favIds}
        onToggleFavorite={toggleFav}
        city={city}
        onSelectCity={setCity}
        user={auth.user ?? null}
        onSetAuth={auth.setAuth}
        onUpdateUser={auth.updateUser}
        onOpenBusiness={openBusinessDetail}
        onOpenBookingFlow={openBookingFlow}
        onJoinQueue={handleJoinQueue}
        onLeaveQueue={handleLeaveQueue}
        onGoToBookings={goToBookings}
        onOpenNotificationBooking={goToBookings}
      />
    </div>
  );
}
