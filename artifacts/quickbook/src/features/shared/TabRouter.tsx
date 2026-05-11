import { HomeTab } from "./tabs/HomeTab";
import { ExploreTab } from "./tabs/ExploreTab";
import { BookingsTab } from "./tabs/BookingsTab";
import { ProfileTab } from "./tabs/ProfileTab";
import type { TabName } from "@/components/ui/BottomNav";
import type { ApiUser, ApiBooking } from "@/services/api";

interface TabRouterProps {
  activeTab: TabName;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  exploreCategoryFilter?: string;
  onGoExplore: (category?: string) => void;
  onViewBusiness: (id: string) => void;
  onOpenNotifications: () => void;
  onOpenCitySelector: () => void;
  isLoggedIn: boolean;
  user: ApiUser | null;
  city: string;
  favIds: string[];
  onToggleFavorite: (id: string) => void;
  onGoHome: () => void;
  onViewQueue: (bookingId: string, businessName: string, businessAddress?: string) => void;
  onLogin: () => void;
  onReschedule: (booking: ApiBooking) => void;
  unreadCount: number;
  onOpenFavourites: () => void;
  onOpenLogin: () => void;
  onLogout: () => void;
  onEditProfile: () => void;
}

export function TabRouter({
  activeTab, searchQuery, onSearchChange, exploreCategoryFilter, onGoExplore,
  onViewBusiness, onOpenNotifications, onOpenCitySelector, isLoggedIn, user, city,
  favIds, onToggleFavorite, onGoHome, onViewQueue, onLogin, onReschedule,
  unreadCount, onOpenFavourites, onOpenLogin, onLogout, onEditProfile,
}: TabRouterProps) {
  return (
    <>
      {activeTab === "home" && (
        <HomeTab
          onGoExplore={onGoExplore}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          onViewBusiness={onViewBusiness}
          onOpenNotifications={onOpenNotifications}
          onOpenCitySelector={onOpenCitySelector}
          isLoggedIn={isLoggedIn}
          userName={user?.name ?? undefined}
          city={city}
          favIds={favIds}
          onToggleFavorite={onToggleFavorite}
        />
      )}
      {activeTab === "explore" && (
        <ExploreTab
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          initialCategory={exploreCategoryFilter}
          onViewBusiness={onViewBusiness}
          favIds={favIds}
          onToggleFavorite={onToggleFavorite}
        />
      )}
      {activeTab === "bookings" && (
        <BookingsTab
          isLoggedIn={isLoggedIn}
          onGoHome={onGoHome}
          onViewQueue={onViewQueue}
          onLogin={onLogin}
          onReschedule={onReschedule}
        />
      )}
      {activeTab === "profile" && (
        <ProfileTab
          user={user}
          isLoggedIn={isLoggedIn}
          unreadCount={unreadCount}
          onGoHome={onGoHome}
          onOpenNotifications={onOpenNotifications}
          onOpenFavourites={onOpenFavourites}
          onOpenLogin={onOpenLogin}
          onLogout={onLogout}
          onEditProfile={onEditProfile}
        />
      )}
    </>
  );
}
