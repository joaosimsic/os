import { createContext, useContext, type ReactNode } from 'react';
import { useWindowManager, type WindowManager } from '../store/windowManager';
import { useFileSystem, type FileSystem } from '../store/fileSystem';

interface OSContextType {
  windowManager: WindowManager;
  fileSystem: FileSystem;
}

const OSContext = createContext<OSContextType | null>(null);

export function OSProvider({ children }: { children: ReactNode }) {
  const windowManager = useWindowManager();
  const fileSystem = useFileSystem();

  return (
    <OSContext.Provider value={{ windowManager, fileSystem }}>
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
