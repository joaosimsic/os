import { useState, useCallback } from 'react';
import type { FileSystemNode } from '../types';

// Initial file system structure
const initialFileSystem: Map<string, FileSystemNode> = new Map([
  // Drives
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

  // C: drive folders
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

  // Nested folders
  [
    'C:/Program Files/Internet Explorer',
    {
      id: 'C:/Program Files/Internet Explorer',
      name: 'Internet Explorer',
      type: 'folder',
      icon: '📁',
      parentId: 'C:/Program Files',
      modified: new Date('1995-08-24'),
      created: new Date('1995-08-24'),
    },
  ],
  [
    'C:/Program Files/Accessories',
    {
      id: 'C:/Program Files/Accessories',
      name: 'Accessories',
      type: 'folder',
      icon: '📁',
      parentId: 'C:/Program Files',
      modified: new Date('1995-08-24'),
      created: new Date('1995-08-24'),
    },
  ],
  [
    'C:/Windows/System',
    {
      id: 'C:/Windows/System',
      name: 'System',
      type: 'folder',
      icon: '📁',
      parentId: 'C:/Windows',
      modified: new Date('1995-08-24'),
      created: new Date('1995-08-24'),
    },
  ],
  [
    'C:/Windows/Fonts',
    {
      id: 'C:/Windows/Fonts',
      name: 'Fonts',
      type: 'folder',
      icon: '📁',
      parentId: 'C:/Windows',
      modified: new Date('1995-08-24'),
      created: new Date('1995-08-24'),
    },
  ],

  // Files in My Documents
  [
    'C:/My Documents/readme.txt',
    {
      id: 'C:/My Documents/readme.txt',
      name: 'readme.txt',
      type: 'file',
      icon: '📄',
      parentId: 'C:/My Documents',
      size: 156,
      content:
        'Welcome to Windows 95!\n\nThis is a sample text file.\nYou can edit this file using Notepad.\n\nEnjoy your computing experience!',
      modified: new Date('1999-01-15'),
      created: new Date('1999-01-15'),
    },
  ],
  [
    'C:/My Documents/notes.txt',
    {
      id: 'C:/My Documents/notes.txt',
      name: 'notes.txt',
      type: 'file',
      icon: '📄',
      parentId: 'C:/My Documents',
      size: 89,
      content:
        'Shopping List:\n- Milk\n- Bread\n- Eggs\n- Coffee\n\nTODO:\n- Call mom\n- Pay bills',
      modified: new Date('1999-03-22'),
      created: new Date('1999-02-10'),
    },
  ],
  [
    'C:/My Documents/photo.bmp',
    {
      id: 'C:/My Documents/photo.bmp',
      name: 'photo.bmp',
      type: 'file',
      icon: '🖼️',
      parentId: 'C:/My Documents',
      size: 245760,
      modified: new Date('1999-03-22'),
      created: new Date('1999-03-22'),
    },
  ],
  [
    'C:/My Documents/report.doc',
    {
      id: 'C:/My Documents/report.doc',
      name: 'report.doc',
      type: 'file',
      icon: '📝',
      parentId: 'C:/My Documents',
      size: 34816,
      modified: new Date('1999-05-10'),
      created: new Date('1999-05-10'),
    },
  ],

  // System files
  [
    'C:/autoexec.bat',
    {
      id: 'C:/autoexec.bat',
      name: 'autoexec.bat',
      type: 'file',
      icon: '📄',
      parentId: 'C:',
      size: 0,
      content: '@ECHO OFF\nPROMPT $p$g\nPATH C:\\WINDOWS;C:\\WINDOWS\\COMMAND',
      modified: new Date('1995-08-24'),
      created: new Date('1995-08-24'),
    },
  ],
  [
    'C:/config.sys',
    {
      id: 'C:/config.sys',
      name: 'config.sys',
      type: 'file',
      icon: '📄',
      parentId: 'C:',
      size: 0,
      content:
        'DEVICE=C:\\WINDOWS\\HIMEM.SYS\nDEVICE=C:\\WINDOWS\\EMM386.EXE\nFILES=40\nBUFFERS=20',
      modified: new Date('1995-08-24'),
      created: new Date('1995-08-24'),
    },
  ],
]);

export function useFileSystem() {
  const [files, setFiles] = useState<Map<string, FileSystemNode>>(
    () => new Map(initialFileSystem),
  );

  // Get a file or folder by path
  const getNode = useCallback(
    (path: string): FileSystemNode | null => {
      return files.get(path) || null;
    },
    [files],
  );

  // Get children of a folder
  const getChildren = useCallback(
    (parentPath: string): FileSystemNode[] => {
      const children: FileSystemNode[] = [];
      files.forEach((node) => {
        if (node.parentId === parentPath) {
          children.push(node);
        }
      });
      // Sort: folders first, then alphabetically
      return children.sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === 'folder' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });
    },
    [files],
  );

  // Get all root drives
  const getDrives = useCallback((): FileSystemNode[] => {
    const drives: FileSystemNode[] = [];
    files.forEach((node) => {
      if (node.parentId === null) {
        drives.push(node);
      }
    });
    return drives;
  }, [files]);

  // Read file content
  const readFile = useCallback(
    (path: string): string | null => {
      const node = files.get(path);
      if (!node || node.type !== 'file') {
        return null;
      }
      return node.content ?? '';
    },
    [files],
  );

  // Write file content (create or update)
  const writeFile = useCallback(
    (path: string, content: string): boolean => {
      const existingNode = files.get(path);

      if (existingNode) {
        // Update existing file
        if (existingNode.type !== 'file') {
          return false; // Can't write to a folder
        }
        setFiles((prev) => {
          const next = new Map(prev);
          next.set(path, {
            ...existingNode,
            content,
            size: content.length,
            modified: new Date(),
          });
          return next;
        });
        return true;
      }

      // Create new file
      const lastSlash = path.lastIndexOf('/');
      const parentPath =
        lastSlash > 0 ? path.substring(0, lastSlash) : path.split('/')[0];
      const fileName = lastSlash > 0 ? path.substring(lastSlash + 1) : path;

      // Check parent exists and is a folder
      const parent = files.get(parentPath);
      if (!parent || parent.type !== 'folder') {
        return false;
      }

      // Determine icon based on extension
      const ext = fileName.split('.').pop()?.toLowerCase();
      let icon = '📄';
      if (ext === 'txt') icon = '📄';
      else if (ext === 'doc') icon = '📝';
      else if (ext === 'bmp' || ext === 'jpg' || ext === 'png') icon = '🖼️';
      else if (ext === 'bat' || ext === 'sys') icon = '⚙️';

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

      setFiles((prev) => {
        const next = new Map(prev);
        next.set(path, newNode);
        return next;
      });
      return true;
    },
    [files],
  );

  // Create a new folder
  const createFolder = useCallback(
    (path: string): boolean => {
      if (files.has(path)) {
        return false; // Already exists
      }

      const lastSlash = path.lastIndexOf('/');
      const parentPath =
        lastSlash > 0 ? path.substring(0, lastSlash) : path.split('/')[0];
      const folderName = lastSlash > 0 ? path.substring(lastSlash + 1) : path;

      // Check parent exists and is a folder
      const parent = files.get(parentPath);
      if (!parent || parent.type !== 'folder') {
        return false;
      }

      const newNode: FileSystemNode = {
        id: path,
        name: folderName,
        type: 'folder',
        icon: '📁',
        parentId: parentPath,
        modified: new Date(),
        created: new Date(),
      };

      setFiles((prev) => {
        const next = new Map(prev);
        next.set(path, newNode);
        return next;
      });
      return true;
    },
    [files],
  );

  // Delete a file or folder
  const deleteNode = useCallback(
    (path: string): boolean => {
      const node = files.get(path);
      if (!node) {
        return false;
      }

      // If it's a folder, delete all children recursively
      const pathsToDelete: string[] = [path];
      if (node.type === 'folder') {
        files.forEach((_, p) => {
          if (p.startsWith(path + '/')) {
            pathsToDelete.push(p);
          }
        });
      }

      setFiles((prev) => {
        const next = new Map(prev);
        pathsToDelete.forEach((p) => next.delete(p));
        return next;
      });
      return true;
    },
    [files],
  );

  // Rename a file or folder
  const renameNode = useCallback(
    (oldPath: string, newName: string): boolean => {
      const node = files.get(oldPath);
      if (!node) {
        return false;
      }

      const lastSlash = oldPath.lastIndexOf('/');
      const parentPath = lastSlash > 0 ? oldPath.substring(0, lastSlash) : '';
      const newPath = parentPath ? `${parentPath}/${newName}` : newName;

      if (files.has(newPath)) {
        return false; // Target already exists
      }

      setFiles((prev) => {
        const next = new Map(prev);

        // Update the node itself
        next.delete(oldPath);
        next.set(newPath, {
          ...node,
          id: newPath,
          name: newName,
          modified: new Date(),
        });

        // If it's a folder, update all children paths
        if (node.type === 'folder') {
          const updates: [string, FileSystemNode][] = [];
          prev.forEach((n, p) => {
            if (p.startsWith(oldPath + '/')) {
              const newChildPath = newPath + p.substring(oldPath.length);
              next.delete(p);
              updates.push([
                newChildPath,
                {
                  ...n,
                  id: newChildPath,
                  parentId:
                    n.parentId === oldPath
                      ? newPath
                      : (n.parentId?.replace(oldPath, newPath) ?? null),
                },
              ]);
            }
          });
          updates.forEach(([p, n]) => next.set(p, n));
        }

        return next;
      });
      return true;
    },
    [files],
  );

  // Check if a path exists
  const exists = useCallback(
    (path: string): boolean => {
      return files.has(path);
    },
    [files],
  );

  return {
    getNode,
    getChildren,
    getDrives,
    readFile,
    writeFile,
    createFolder,
    deleteNode,
    renameNode,
    exists,
  };
}

export type FileSystem = ReturnType<typeof useFileSystem>;
