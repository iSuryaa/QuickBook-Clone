import { useState, useCallback } from "react";
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

export function AppShell() {
  const auth = useAuthState();
  const { favIds, toggle: toggleFav } = useFavoritesStore();
  const [activeTab, setActiveTab] = useState<TabName>("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [exploreCategoryFilter, setExploreCategoryFilter] = useState<string | undefined>();
  const [modal, setModal] = useState<ModalState>(null);
  const createBooking = useCreateBooking();
  const qc = useQueryClient();

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

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="pb-20 animate-fade-up">
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

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} bookingCount={0} />

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
