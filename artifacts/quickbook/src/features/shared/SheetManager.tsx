import { LoginScreen } from "@/features/auth/LoginScreen";
import { BusinessDetailSheet } from "@/features/businesses/BusinessDetailSheet";
import { BookingFlowSheet, type BookingFlowStep } from "@/features/bookings/BookingFlowSheet";
import { QueueTrackerSheet } from "@/features/bookings/QueueTrackerSheet";
import { NotificationsPanel } from "@/features/profile/NotificationsPanel";
import { FavouritesSheet } from "@/features/profile/FavouritesSheet";
import { EditProfileSheet } from "@/features/profile/EditProfileSheet";
import { CitySelector } from "@/features/shared/CitySelector";
import type { ApiBusiness, ApiService, ApiStaff, ApiUser, ApiBooking } from "@/services/api";

export type FullBusiness = ApiBusiness & { services: ApiService[]; staff: ApiStaff[] };

export type ModalState =
  | { type: "businessDetail"; businessId: string }
  | { type: "bookingFlow"; business: FullBusiness; initialStep?: BookingFlowStep; initialService?: ApiService }
  | { type: "queueTracker"; bookingId: string; businessName: string; businessAddress?: string; initialPosition?: number; totalInQueue?: number }
  | { type: "notifications" }
  | { type: "favourites" }
  | { type: "login"; afterLoginAction?: () => void }
  | { type: "editProfile" }
  | { type: "citySelector" }
  | null;

interface SheetManagerProps {
  modal: ModalState;
  onClose: () => void;
  favIds: string[];
  onToggleFavorite: (id: string) => void;
  city: string;
  onSelectCity: (city: string) => void;
  user: ApiUser | null;
  onSetAuth: (token: string, user: ApiUser) => void;
  onUpdateUser: (user: Partial<ApiUser>) => void;
  onOpenBusiness: (id: string) => void;
  onOpenBookingFlow: (business: FullBusiness, initialStep?: BookingFlowStep, initialService?: ApiService) => void;
  onJoinQueue: (business: ApiBusiness) => void;
  onLeaveQueue: (bookingId: string) => void;
  onGoToBookings: () => void;
  onOpenNotificationBooking: (bookingId: string) => void;
}

export function SheetManager({
  modal, onClose, favIds, onToggleFavorite, city, onSelectCity,
  user, onSetAuth, onUpdateUser, onOpenBusiness, onOpenBookingFlow,
  onJoinQueue, onLeaveQueue, onGoToBookings, onOpenNotificationBooking,
}: SheetManagerProps) {
  return (
    <>
      {modal?.type === "login" && (
        <LoginScreen
          onBack={onClose}
          onSuccess={(u, tok) => {
            onSetAuth(tok, u);
            const action = (modal as { type: "login"; afterLoginAction?: () => void }).afterLoginAction;
            onClose();
            action?.();
          }}
        />
      )}

      {modal?.type === "businessDetail" && (
        <BusinessDetailSheet
          businessId={modal.businessId}
          onClose={onClose}
          onBook={onOpenBookingFlow}
          onJoinQueue={onJoinQueue}
          isFavorite={favIds.includes(modal.businessId)}
          onToggleFavorite={onToggleFavorite}
        />
      )}

      {modal?.type === "bookingFlow" && (
        <BookingFlowSheet
          business={modal.business}
          onClose={onClose}
          onSuccess={() => onGoToBookings()}
          initialStep={(modal as { type: "bookingFlow"; initialStep?: BookingFlowStep }).initialStep}
          initialService={(modal as { type: "bookingFlow"; initialService?: ApiService }).initialService}
        />
      )}

      {modal?.type === "queueTracker" && (
        <QueueTrackerSheet
          bookingId={modal.bookingId}
          businessName={modal.businessName}
          businessAddress={modal.businessAddress}
          initialPosition={modal.initialPosition}
          totalInQueue={modal.totalInQueue}
          onClose={onClose}
          onLeaveQueue={onLeaveQueue}
        />
      )}

      {modal?.type === "notifications" && (
        <NotificationsPanel
          onClose={onClose}
          onOpenBusiness={id => { onClose(); onOpenBusiness(id); }}
          onOpenBooking={onOpenNotificationBooking}
        />
      )}

      {modal?.type === "favourites" && (
        <FavouritesSheet
          favIds={favIds}
          onClose={onClose}
          onViewBusiness={id => { onClose(); onOpenBusiness(id); }}
          onToggleFavorite={onToggleFavorite}
        />
      )}

      {modal?.type === "editProfile" && user && (
        <EditProfileSheet
          user={user}
          onClose={onClose}
          onSave={onUpdateUser}
        />
      )}

      {modal?.type === "citySelector" && (
        <CitySelector
          selected={city}
          onSelect={onSelectCity}
          onClose={onClose}
        />
      )}
    </>
  );
}
