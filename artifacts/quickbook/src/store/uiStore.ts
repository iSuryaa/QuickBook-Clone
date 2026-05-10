import { create } from "zustand";
import type { ApiBusiness, ApiService, ApiStaff, ApiBooking } from "@/services/api";

export type TabName = "home" | "explore" | "bookings" | "profile";
export type BookingFlowStep = "service" | "specialist" | "seats" | "datetime" | "payment" | "success";

type FullBusiness = ApiBusiness & { services: ApiService[]; staff: ApiStaff[] };

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

interface UIStore {
  activeTab: TabName;
  city: string;
  modal: ModalState;
  setActiveTab: (tab: TabName) => void;
  setCity: (city: string) => void;
  setModal: (modal: ModalState) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  activeTab: "home",
  city: "Mumbai",
  modal: null,
  setActiveTab: (activeTab) => set({ activeTab }),
  setCity: (city) => set({ city }),
  setModal: (modal) => set({ modal }),
  closeModal: () => set({ modal: null }),
}));
