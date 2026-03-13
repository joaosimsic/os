import { create } from 'zustand';
import { computersApi, filesApi, type Computer, type ComputerFile, type ComputerStats } from '../api/client';
import { useAuthStore } from './auth';

interface MyComputerState {
  // My computers list
  computers: Computer[];
  
  // Currently selected computer for editing
  activeComputer: Computer | null;
  
  // Stats for active computer
  stats: ComputerStats | null;
  
  // Loading states
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  
  // Actions
  fetchMyComputers: () => Promise<void>;
  createComputer: (name?: string) => Promise<Computer | null>;
  selectComputer: (id: string) => Promise<void>;
  updateComputer: (id: string, data: { name?: string; description?: string }) => Promise<void>;
  publishComputer: (id: string) => Promise<void>;
  unpublishComputer: (id: string) => Promise<void>;
  deleteComputer: (id: string) => Promise<void>;
  
  // File actions
  createFile: (data: { name: string; type: string; content: string; folderId?: string; positionX?: number; positionY?: number }) => Promise<ComputerFile | null>;
  updateFile: (fileId: string, data: Partial<{ name: string; type: string; content: string; positionX: number; positionY: number }>) => Promise<void>;
  deleteFile: (fileId: string) => Promise<void>;
  
  // Stats
  fetchStats: (id: string) => Promise<void>;
  
  clearError: () => void;
  reset: () => void;
}

const getToken = () => useAuthStore.getState().token;

export const useMyComputerStore = create<MyComputerState>((set, get) => ({
  computers: [],
  activeComputer: null,
  stats: null,
  isLoading: false,
  isSaving: false,
  error: null,

  fetchMyComputers: async () => {
    const token = getToken();
    if (!token) return;
    
    set({ isLoading: true, error: null });
    try {
      const computers = await computersApi.getMine(token);
      set({ computers, isLoading: false });
      
      // If no active computer but we have computers, select the first one
      if (!get().activeComputer && computers.length > 0) {
        await get().selectComputer(computers[0].id);
      }
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch computers',
      });
    }
  },

  createComputer: async (name?: string) => {
    const token = getToken();
    if (!token) return null;
    
    set({ isSaving: true, error: null });
    try {
      const computer = await computersApi.create(token, { name: name || 'My Life Capsule' });
      set((state) => ({
        computers: [computer, ...state.computers],
        activeComputer: computer,
        isSaving: false,
      }));
      return computer;
    } catch (err) {
      set({
        isSaving: false,
        error: err instanceof Error ? err.message : 'Failed to create computer',
      });
      return null;
    }
  },

  selectComputer: async (id: string) => {
    const token = getToken();
    if (!token) return;
    
    set({ isLoading: true, error: null });
    try {
      const computer = await computersApi.getMyComputer(token, id);
      set({ activeComputer: computer, isLoading: false });
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to load computer',
      });
    }
  },

  updateComputer: async (id: string, data: { name?: string; description?: string }) => {
    const token = getToken();
    if (!token) return;
    
    set({ isSaving: true, error: null });
    try {
      const computer = await computersApi.update(token, id, data);
      set((state) => ({
        activeComputer: state.activeComputer?.id === id ? computer : state.activeComputer,
        computers: state.computers.map((c) => (c.id === id ? computer : c)),
        isSaving: false,
      }));
    } catch (err) {
      set({
        isSaving: false,
        error: err instanceof Error ? err.message : 'Failed to update computer',
      });
    }
  },

  publishComputer: async (id: string) => {
    const token = getToken();
    if (!token) return;
    
    set({ isSaving: true, error: null });
    try {
      const computer = await computersApi.publish(token, id);
      set((state) => ({
        activeComputer: state.activeComputer?.id === id ? computer : state.activeComputer,
        computers: state.computers.map((c) => (c.id === id ? computer : c)),
        isSaving: false,
      }));
    } catch (err) {
      set({
        isSaving: false,
        error: err instanceof Error ? err.message : 'Failed to publish',
      });
    }
  },

  unpublishComputer: async (id: string) => {
    const token = getToken();
    if (!token) return;
    
    set({ isSaving: true, error: null });
    try {
      const computer = await computersApi.unpublish(token, id);
      set((state) => ({
        activeComputer: state.activeComputer?.id === id ? computer : state.activeComputer,
        computers: state.computers.map((c) => (c.id === id ? computer : c)),
        isSaving: false,
      }));
    } catch (err) {
      set({
        isSaving: false,
        error: err instanceof Error ? err.message : 'Failed to unpublish',
      });
    }
  },

  deleteComputer: async (id: string) => {
    const token = getToken();
    if (!token) return;
    
    set({ isSaving: true, error: null });
    try {
      await computersApi.delete(token, id);
      set((state) => {
        const newComputers = state.computers.filter((c) => c.id !== id);
        return {
          computers: newComputers,
          activeComputer: state.activeComputer?.id === id ? (newComputers[0] || null) : state.activeComputer,
          isSaving: false,
        };
      });
    } catch (err) {
      set({
        isSaving: false,
        error: err instanceof Error ? err.message : 'Failed to delete',
      });
    }
  },

  createFile: async (data) => {
    const token = getToken();
    const { activeComputer } = get();
    if (!token || !activeComputer) return null;
    
    set({ isSaving: true, error: null });
    try {
      const file = await filesApi.create(token, activeComputer.id, data);
      set((state) => ({
        activeComputer: state.activeComputer
          ? { ...state.activeComputer, files: [...state.activeComputer.files, file] }
          : null,
        isSaving: false,
      }));
      return file;
    } catch (err) {
      set({
        isSaving: false,
        error: err instanceof Error ? err.message : 'Failed to create file',
      });
      return null;
    }
  },

  updateFile: async (fileId: string, data) => {
    const token = getToken();
    const { activeComputer } = get();
    if (!token || !activeComputer) return;
    
    set({ isSaving: true, error: null });
    try {
      const updatedFile = await filesApi.update(token, activeComputer.id, fileId, data);
      set((state) => ({
        activeComputer: state.activeComputer
          ? {
              ...state.activeComputer,
              files: state.activeComputer.files.map((f) =>
                f.id === fileId ? updatedFile : f
              ),
            }
          : null,
        isSaving: false,
      }));
    } catch (err) {
      set({
        isSaving: false,
        error: err instanceof Error ? err.message : 'Failed to update file',
      });
    }
  },

  deleteFile: async (fileId: string) => {
    const token = getToken();
    const { activeComputer } = get();
    if (!token || !activeComputer) return;
    
    set({ isSaving: true, error: null });
    try {
      await filesApi.delete(token, activeComputer.id, fileId);
      set((state) => ({
        activeComputer: state.activeComputer
          ? {
              ...state.activeComputer,
              files: state.activeComputer.files.filter((f) => f.id !== fileId),
            }
          : null,
        isSaving: false,
      }));
    } catch (err) {
      set({
        isSaving: false,
        error: err instanceof Error ? err.message : 'Failed to delete file',
      });
    }
  },

  fetchStats: async (id: string) => {
    const token = getToken();
    if (!token) return;
    
    try {
      const stats = await computersApi.getStats(token, id);
      set({ stats });
    } catch (err) {
      // Silent fail for stats
    }
  },

  clearError: () => set({ error: null }),
  
  reset: () => set({
    computers: [],
    activeComputer: null,
    stats: null,
    isLoading: false,
    isSaving: false,
    error: null,
  }),
}));
