import { createContext, useContext, type ReactNode } from 'react';
import { useWindowManager, type WindowManager } from '../store/windowManager';

interface OSContextType {
  windowManager: WindowManager;
}

const OSContext = createContext<OSContextType | null>(null);

export function OSProvider({ children }: { children: ReactNode }) {
  const windowManager = useWindowManager();

  return (
    <OSContext.Provider value={{ windowManager }}>
      {children}
    </OSContext.Provider>
  );
}

export function useOS() {
  const context = useContext(OSContext);
  if (!context) {
    throw new Error('useOS must be used within an OSProvider');
  }
  return context;
}
