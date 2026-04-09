import { create } from 'zustand';

interface SearchState {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  tripType: 'oneway' | 'roundtrip';
  setSearchParams: (params: Partial<SearchState>) => void;
  clearSearch: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  origin: '',
  destination: '',
  departureDate: '',
  returnDate: undefined,
  passengers: 1,
  tripType: 'oneway',
  setSearchParams: (params) => set((state) => ({ ...state, ...params })),
  clearSearch: () =>
    set({
      origin: '',
      destination: '',
      departureDate: '',
      returnDate: undefined,
      passengers: 1,
      tripType: 'oneway',
    }),
}));

interface UserState {
  userId: string | null;
  email: string | null;
  tier: string | null;
  setUser: (user: { userId: string; email: string; tier: string }) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  userId: null,
  email: null,
  tier: null,
  setUser: (user) =>
    set({
      userId: user.userId,
      email: user.email,
      tier: user.tier,
    }),
  clearUser: () =>
    set({
      userId: null,
      email: null,
      tier: null,
    }),
}));
