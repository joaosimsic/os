export interface WindowState {
  id: string;
  title: string;
  icon?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth?: number;
  minHeight?: number;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  component: string;
  props?: Record<string, unknown>;
}

export interface DesktopIcon {
  id: string;
  title: string;
  icon: string;
  x: number;
  y: number;
  action: () => void;
}

export interface TaskbarItem {
  windowId: string;
  title: string;
  icon?: string;
  isActive: boolean;
}

export interface StartMenuItem {
  id: string;
  label: string;
  icon?: string;
  action?: () => void;
  submenu?: StartMenuItem[];
}

// File System Types
export interface FileSystemNode {
  id: string;
  name: string;
  type: 'folder' | 'file';
  icon: string;
  parentId: string | null;
  size?: number;
  content?: string;
  modified: Date;
  created: Date;
}
