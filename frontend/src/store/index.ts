import { create } from 'zustand';

/**
 * SearchState - Global state for flight search parameters
 * 
 * Persists user's search criteria including origin, destination,
 * dates, passenger count, and trip type across the application.
 * 
 * Example usage:
 * const { setSearchParams, clearSearch } = useSearchStore();
 */
interface SearchState {
  /** Departure airport code (e.g., "JFK", "LAX") */
  origin: string;
  
  /** Arrival airport code (e.g., "LHR", "CDG") */
  destination: string;
  
  /** Departure date in ISO format (e.g., "2024-06-15") */
  departureDate: string;
  
  /** Return date for round trip (optional, ISO format) */
  returnDate?: string;
  
  /** Number of passengers (1-9) */
  passengers: number;
  
  /** Trip type: one-way or round-trip */
  tripType: 'oneway' | 'roundtrip';
  
  /**
   * Update search parameters partially
   * Merges with existing state
   */
  setSearchParams: (params: Partial<SearchState>) => void;
  
  /**
   * Clear all search parameters
   * Resets to default values
   */
  clearSearch: () => void;
}

/**
 * useSearchStore - Zustand store for flight search state
 * 
 * Provides centralized state management for flight search parameters.
 * Automatically persists search criteria for user convenience.
 */
export const useSearchStore = create<SearchState>((set) => ({
  origin: '',
  destination: '',
  departureDate: '',
  returnDate: undefined,
  passengers: 1,
  tripType: 'oneway',

  setSearchParams: (params: Partial<SearchState>) =>
    set((state: SearchState) => ({
      ...state,
      ...params,
    })),

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

/**
 * UserState - Global state for authenticated user information
 * 
 * Stores current user's profile data including ID, email, and
 * loyalty tier information. Persists across page navigation.
 * 
 * Example usage:
 * const { userId, email, tier, setUser, clearUser } = useUserStore();
 */
interface UserState {
  /** User's unique identifier (UUID) */
  userId: string | null;
  
  /** User's email address */
  email: string | null;
  
  /** User's loyalty tier (Standard, Plus, Premium) */
  tier: string | null;
  
  /**
   * Set user profile information
   * Called after successful login
   */
  setUser: (user: { userId: string; email: string; tier: string }) => void;
  
  /**
   * Clear user information
   * Called on logout
   */
  clearUser: () => void;
}

/**
 * useUserStore - Zustand store for user authentication state
 * 
 * Manages current user's profile data and authentication status.
 * Integrates with AuthService for login/logout operations.
 */
export const useUserStore = create<UserState>((set) => ({
  userId: null,
  email: null,
  tier: null,

  setUser: (user: { userId: string; email: string; tier: string }) =>
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
