import { useState, useCallback } from 'react';
import type { WindowState } from '../types';

let windowIdCounter = 0;
let topZIndex = 1;

export function useWindowManager() {
  const [windows, setWindows] = useState<WindowState[]>([]);

  const openWindow = useCallback(
    (
      component: string,
      title: string,
      options?: Partial<Omit<WindowState, 'id' | 'component' | 'zIndex'>>,
    ) => {
      const id = `window-${++windowIdCounter}`;
      const newWindow: WindowState = {
        id,
        title,
        component,
        x: 50 + (windowIdCounter % 10) * 30,
        y: 50 + (windowIdCounter % 10) * 30,
        width: options?.width ?? 400,
        height: options?.height ?? 300,
        minWidth: options?.minWidth ?? 200,
        minHeight: options?.minHeight ?? 150,
        isMinimized: false,
        isMaximized: false,
        zIndex: ++topZIndex,
        icon: options?.icon,
        props: options?.props,
      };
      setWindows((prev) => [...prev, newWindow]);
      return id;
    },
    [],
  );

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const focusWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, zIndex: ++topZIndex, isMinimized: false } : w,
      ),
    );
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w)),
    );
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id
          ? { ...w, isMaximized: !w.isMaximized, zIndex: ++topZIndex }
          : w,
      ),
    );
  }, []);

  const moveWindow = useCallback((id: string, x: number, y: number) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, x, y } : w)));
  }, []);

  const resizeWindow = useCallback(
    (id: string, width: number, height: number) => {
      setWindows((prev) =>
        prev.map((w) =>
          w.id === id
            ? {
                ...w,
                width: Math.max(width, w.minWidth ?? 200),
                height: Math.max(height, w.minHeight ?? 150),
              }
            : w,
        ),
      );
    },
    [],
  );

  const moveAndResizeWindow = useCallback(
    (id: string, x: number, y: number, width: number, height: number) => {
      setWindows((prev) =>
        prev.map((w) =>
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
      );
    },
    [],
  );

  return {
    windows,
    openWindow,
    closeWindow,
    focusWindow,
    minimizeWindow,
    maximizeWindow,
    moveWindow,
    resizeWindow,
    moveAndResizeWindow,
  };
}

export type WindowManager = ReturnType<typeof useWindowManager>;
