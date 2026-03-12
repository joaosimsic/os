import { create } from 'zustand';
import type { FileSystemNode } from '../types';

const initialFileSystemEntries: [string, FileSystemNode][] = [
  [
    'C:',
    {
      id: 'C:',
      name: 'Local Disk (C:)',
      type: 'folder',
      icon: '💾',
      parentId: null,
      modified: new Date('1995-08-24'),
      created: new Date('1995-08-24'),
    },
  ],
  [
    'D:',
    {
      id: 'D:',
      name: 'CD-ROM Drive (D:)',
      type: 'folder',
      icon: '💿',
      parentId: null,
      modified: new Date('1995-08-24'),
      created: new Date('1995-08-24'),
    },
  ],
  [
    'C:/Program Files',
    {
      id: 'C:/Program Files',
      name: 'Program Files',
      type: 'folder',
      icon: '📁',
      parentId: 'C:',
      modified: new Date('1995-08-24'),
      created: new Date('1995-08-24'),
    },
  ],
  [
    'C:/Windows',
    {
      id: 'C:/Windows',
      name: 'Windows',
      type: 'folder',
      icon: '📁',
      parentId: 'C:',
      modified: new Date('1995-08-24'),
      created: new Date('1995-08-24'),
    },
  ],
  [
    'C:/My Documents',
    {
      id: 'C:/My Documents',
      name: 'My Documents',
      type: 'folder',
      icon: '📁',
      parentId: 'C:',
      modified: new Date('1999-01-15'),
      created: new Date('1995-08-24'),
    },
  ],
  [
    'C:/My Documents/readme.txt',
    {
      id: 'C:/My Documents/readme.txt',
      name: 'readme.txt',
      type: 'file',
      icon: '📄',
      parentId: 'C:/My Documents',
      size: 156,
      content: 'Welcome to Windows 95!\n\nThis is a sample text file.',
      modified: new Date('1999-01-15'),
      created: new Date('1999-01-15'),
    },
  ],
];

interface FileSystemStore {
  files: Map<string, FileSystemNode>;
  getNode: (path: string) => FileSystemNode | null;
  getChildren: (parentPath: string) => FileSystemNode[];
  getDrives: () => FileSystemNode[];
  readFile: (path: string) => string | null;
  exists: (path: string) => boolean;
  writeFile: (path: string, content: string) => boolean;
  createFolder: (path: string) => boolean;
  deleteNode: (path: string) => boolean;
  renameNode: (oldPath: string, newName: string) => boolean;
}

export const useFileSystemStore = create<FileSystemStore>((set, get) => ({
  files: new Map(initialFileSystemEntries),

  getNode: (path) => get().files.get(path) || null,

  getChildren: (parentPath) => {
    const children: FileSystemNode[] = [];
    get().files.forEach((node) => {
      if (node.parentId === parentPath) children.push(node);
    });
    return children.sort((a, b) => {
      if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  },

  getDrives: () => {
    const drives: FileSystemNode[] = [];
    get().files.forEach((node) => {
      if (node.parentId === null) drives.push(node);
    });
    return drives;
  },

  readFile: (path) => {
    const node = get().files.get(path);
    return node?.type === 'file' ? (node.content ?? '') : null;
  },

  exists: (path) => get().files.has(path),

  writeFile: (path, content) => {
    const files = get().files;
    const existingNode = files.get(path);

    if (existingNode) {
      if (existingNode.type !== 'file') return false;

      const nextFiles = new Map(files);
      nextFiles.set(path, {
        ...existingNode,
        content,
        size: content.length,
        modified: new Date(),
      });
      set({ files: nextFiles });
      return true;
    }

    const lastSlash = path.lastIndexOf('/');
    const parentPath =
      lastSlash > 0 ? path.substring(0, lastSlash) : path.split('/')[0];
    const fileName = lastSlash > 0 ? path.substring(lastSlash + 1) : path;

    const parent = files.get(parentPath);
    if (!parent || parent.type !== 'folder') return false;

    const ext = fileName.split('.').pop()?.toLowerCase();
    let icon = '📄';
    if (['bmp', 'jpg', 'png'].includes(ext || '')) icon = '🖼️';
    else if (['bat', 'sys'].includes(ext || '')) icon = '⚙️';
    else if (ext === 'doc') icon = '📝';

    const newNode: FileSystemNode = {
      id: path,
      name: fileName,
      type: 'file',
      icon,
      parentId: parentPath,
      size: content.length,
      content,
      modified: new Date(),
      created: new Date(),
    };

    const nextFiles = new Map(files);
    nextFiles.set(path, newNode);
    set({ files: nextFiles });
    return true;
  },

  createFolder: (path) => {
    if (get().files.has(path)) return false;

    const lastSlash = path.lastIndexOf('/');
    const parentPath =
      lastSlash > 0 ? path.substring(0, lastSlash) : path.split('/')[0];
    const folderName = lastSlash > 0 ? path.substring(lastSlash + 1) : path;

    const parent = get().files.get(parentPath);
    if (!parent || parent.type !== 'folder') return false;

    const newNode: FileSystemNode = {
      id: path,
      name: folderName,
      type: 'folder',
      icon: '📁',
      parentId: parentPath,
      modified: new Date(),
      created: new Date(),
    };

    const nextFiles = new Map(get().files);
    nextFiles.set(path, newNode);
    set({ files: nextFiles });
    return true;
  },

  deleteNode: (path) => {
    const node = get().files.get(path);
    if (!node) return false;

    const nextFiles = new Map(get().files);
    const pathsToDelete = [path];

    if (node.type === 'folder') {
      get().files.forEach((_, p) => {
        if (p.startsWith(path + '/')) pathsToDelete.push(p);
      });
    }

    pathsToDelete.forEach((p) => nextFiles.delete(p));
    set({ files: nextFiles });
    return true;
  },

  renameNode: (oldPath, newName) => {
    const files = get().files;
    const node = files.get(oldPath);
    if (!node) return false;

    const lastSlash = oldPath.lastIndexOf('/');
    const parentPath = lastSlash > 0 ? oldPath.substring(0, lastSlash) : '';
    const newPath = parentPath ? `${parentPath}/${newName}` : newName;

    if (files.has(newPath)) return false;

    const nextFiles = new Map(files);
    nextFiles.delete(oldPath);
    nextFiles.set(newPath, {
      ...node,
      id: newPath,
      name: newName,
      modified: new Date(),
    });

    if (node.type === 'folder') {
      files.forEach((n, p) => {
        if (p.startsWith(oldPath + '/')) {
          const newChildPath = newPath + p.substring(oldPath.length);
          nextFiles.delete(p);
          nextFiles.set(newChildPath, {
            ...n,
            id: newChildPath,
            parentId:
              n.parentId === oldPath
                ? newPath
                : (n.parentId?.replace(oldPath, newPath) ?? null),
          });
        }
      });
    }

    set({ files: nextFiles });
    return true;
  },
}));
