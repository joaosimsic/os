import { create } from 'zustand';
import type { WindowState } from '../types';

interface WindowStore {
  windows: WindowState[];
  windowIdCounter: number;
  topZIndex: number;
  openWindow: (
    component: string,
    title: string,
    options?: Partial<Omit<WindowState, 'id' | 'component' | 'zIndex'>>,
  ) => string;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  moveWindow: (id: string, x: number, y: number) => void;
  resizeWindow: (id: string, width: number, height: number) => void;
  moveAndResizeWindow: (
    id: string,
    x: number,
    y: number,
    width: number,
    height: number,
  ) => void;
}

export const useWindowStore = create<WindowStore>((set) => ({
  windows: [],
  windowIdCounter: 0,
  topZIndex: 1,

  openWindow: (component, title, options) => {
    let id = '';
    set((state) => {
      const nextCounter = state.windowIdCounter + 1;
      const nextZIndex = state.topZIndex + 1;
      id = `window-${nextCounter}`;

      const newWindow: WindowState = {
        id,
        title,
        component,
        x: 50 + (nextCounter % 10) * 30,
        y: 50 + (nextCounter % 10) * 30,
        width: options?.width ?? 800,
        height: options?.height ?? 650,
        minWidth: options?.minWidth ?? 200,
        minHeight: options?.minHeight ?? 150,
        isMinimized: false,
        isMaximized: false,
        zIndex: nextZIndex,
        icon: options?.icon,
        props: options?.props,
      };

      return {
        windows: [...state.windows, newWindow],
        windowIdCounter: nextCounter,
        topZIndex: nextZIndex,
      };
    });
    return id;
  },

  closeWindow: (id) =>
    set((state) => ({
      windows: state.windows.filter((w) => w.id !== id),
    })),

  focusWindow: (id) =>
    set((state) => {
      const nextZIndex = state.topZIndex + 1;
      return {
        topZIndex: nextZIndex,
        windows: state.windows.map((w) =>
          w.id === id ? { ...w, zIndex: nextZIndex, isMinimized: false } : w,
        ),
      };
    }),

  minimizeWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMinimized: true } : w,
      ),
    })),

  maximizeWindow: (id) =>
    set((state) => {
      const nextZIndex = state.topZIndex + 1;
      return {
        topZIndex: nextZIndex,
        windows: state.windows.map((w) =>
          w.id === id
            ? { ...w, isMaximized: !w.isMaximized, zIndex: nextZIndex }
            : w,
        ),
      };
    }),

  moveWindow: (id, x, y) =>
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, x, y } : w)),
    })),

  resizeWindow: (id, width, height) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id
          ? {
              ...w,
              width: Math.max(width, w.minWidth ?? 200),
              height: Math.max(height, w.minHeight ?? 150),
            }
          : w,
      ),
    })),

  moveAndResizeWindow: (id, x, y, width, height) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id
          ? {
              ...w,
              x,
              y,
              width: Math.max(width, w.minWidth ?? 200),
              height: Math.max(height, w.minHeight ?? 150),
            }
          : w,
      ),
    })),
}));
