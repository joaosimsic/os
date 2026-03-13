import { create } from 'zustand';
import { computersApi, type Computer } from '../api/client';

type ExploreMode = 'discovering' | 'exploring' | 'none';

interface ComputerState {
  // Current computer being viewed (either exploring stranger's or own)
  currentComputer: Computer | null;
  
  // Mode
  exploreMode: ExploreMode;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  
  // Actions
  discoverRandom: () => Promise<void>;
  exploreComputer: (id: string) => Promise<void>;
  clearComputer: () => void;
  clearError: () => void;
}

export const useComputerStore = create<ComputerState>((set) => ({
  currentComputer: null,
  exploreMode: 'none',
  isLoading: false,
  error: null,

  discoverRandom: async () => {
    set({ isLoading: true, error: null, exploreMode: 'discovering' });
    try {
      const computer = await computersApi.discover();
      if (computer) {
        set({
          currentComputer: computer,
          exploreMode: 'exploring',
          isLoading: false,
        });
      } else {
        set({
          currentComputer: null,
          exploreMode: 'none',
          isLoading: false,
          error: 'No computers available to discover yet. Be the first to create one!',
        });
      }
    } catch (err) {
      set({
        isLoading: false,
        exploreMode: 'none',
        error: err instanceof Error ? err.message : 'Failed to discover computer',
      });
    }
  },

  exploreComputer: async (id: string) => {
    set({ isLoading: true, error: null, exploreMode: 'discovering' });
    try {
      const computer = await computersApi.explore(id);
      set({
        currentComputer: computer,
        exploreMode: 'exploring',
        isLoading: false,
      });
    } catch (err) {
      set({
        isLoading: false,
        exploreMode: 'none',
        error: err instanceof Error ? err.message : 'Failed to explore computer',
      });
    }
  },

  clearComputer: () => {
    set({ currentComputer: null, exploreMode: 'none', error: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));
