import { useState, useCallback } from "react";
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
import { useAuthStore } from "@/store/authStore";
import { useFavoritesStore } from "@/store/favoritesStore";
import { MOCK_NOTIFICATIONS, MOCK_BOOKINGS, type Business, type Booking } from "@/data/mock";

type ModalState =
  | { type: "businessDetail"; businessId: string }
  | { type: "bookingFlow"; business: Business }
  | { type: "queueTracker"; bookingId: string; businessName: string; businessAddress?: string; initialPosition?: number; totalInQueue?: number }
  | { type: "notifications" }
  | { type: "favourites" }
  | { type: "login" }
  | null;

export function AppShell() {
  const { user, isLoggedIn, login, logout } = useAuthStore();
  const { favIds, toggle: toggleFav } = useFavoritesStore();
  const [activeTab, setActiveTab] = useState<TabName>("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [exploreCategoryFilter, setExploreCategoryFilter] = useState<string | undefined>();
  const [modal, setModal] = useState<ModalState>(null);
  const [bookings, setBookings] = useState<Booking[]>([...MOCK_BOOKINGS]);

  const closeModal = useCallback(() => setModal(null), []);
  const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.read).length;
  const upcomingCount = isLoggedIn ? bookings.filter(b => b.status === "upcoming" || b.status === "in-queue").length : 0;

  const openBusinessDetail = useCallback((id: string) => {
    setModal({ type: "businessDetail", businessId: id });
  }, []);

  const openBookingFlow = useCallback((business: Business) => {
    if (!isLoggedIn) { setModal({ type: "login" }); return; }
    setModal({ type: "bookingFlow", business });
  }, [isLoggedIn]);

  const openQueueTracker = useCallback((bookingId: string, businessName: string, businessAddress?: string, initialPosition?: number, totalInQueue?: number) => {
    setModal({ type: "queueTracker", bookingId, businessName, businessAddress, initialPosition, totalInQueue });
  }, []);

  const handleJoinQueue = useCallback((business: Business) => {
    if (!isLoggedIn) { setModal({ type: "login" }); return; }
    const token = `Q-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
    const booking: Booking = {
      id: `bk_${Date.now()}`,
      businessId: business.id,
      serviceId: business.services[0]?.id ?? "",
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      persons: 1,
      status: "in-queue",
      token,
      createdAt: new Date().toISOString(),
    };
    setBookings(prev => [booking, ...prev]);
    openQueueTracker(booking.id, business.name, business.address, business.queueCount + 1, business.queueCount + 1);
  }, [isLoggedIn, openQueueTracker]);

  const goToExplore = useCallback((category?: string) => {
    setExploreCategoryFilter(category);
    setActiveTab("explore");
    setModal(null);
  }, []);

  const goToBookings = useCallback(() => {
    setActiveTab("bookings");
    setModal(null);
  }, []);

  const handleBookingSuccess = useCallback((booking: Booking) => {
    setBookings(prev => [booking, ...prev]);
  }, []);

  const cancelBooking = useCallback((id: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "cancelled" as const } : b));
  }, []);

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
              if (!isLoggedIn) { setModal({ type: "login" }); return; }
              setModal({ type: "notifications" });
            }}
            isLoggedIn={isLoggedIn}
            userName={user?.name}
            unreadCount={isLoggedIn ? unreadCount : 0}
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
            isLoggedIn={isLoggedIn}
            bookings={bookings}
            onGoHome={() => setActiveTab("home")}
            onViewQueue={(id, name, addr) => openQueueTracker(id, name, addr)}
            onCancel={cancelBooking}
          />
        )}
        {activeTab === "profile" && (
          <ProfileTab
            user={user}
            isLoggedIn={isLoggedIn}
            unreadCount={isLoggedIn ? unreadCount : 0}
            onGoHome={() => setActiveTab("home")}
            onOpenNotifications={() => setModal({ type: "notifications" })}
            onOpenFavourites={() => setModal({ type: "favourites" })}
            onOpenLogin={() => setModal({ type: "login" })}
            onLogout={logout}
          />
        )}
      </div>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} bookingCount={upcomingCount} />

      {modal?.type === "login" && (
        <LoginScreen onBack={closeModal} onSuccess={u => { login(u); closeModal(); }} />
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
          onSuccess={booking => { handleBookingSuccess(booking); goToBookings(); }}
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
