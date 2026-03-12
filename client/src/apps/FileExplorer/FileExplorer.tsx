import { useState, useCallback } from 'react';
import { useOS } from '../../context/OSContext';
import type { FileSystemNode } from '../../types';

const sidebarItems = [
  { id: 'desktop', name: 'Desktop', icon: '🖥️' },
  { id: 'C:', name: 'Local Disk (C:)', icon: '💾' },
  { id: 'D:', name: 'CD-ROM (D:)', icon: '💿' },
  { id: 'control-panel', name: 'Control Panel', icon: '🎛️' },
  { id: 'recycle-bin', name: 'Recycle Bin', icon: '🗑️' },
];

function formatSize(bytes?: number): string {
  if (bytes === undefined) return '';
  if (bytes < 1024) return `${bytes} bytes`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface FileExplorerProps {
  initialPath?: string;
}

export function FileExplorer({ initialPath = 'C:' }: FileExplorerProps) {
  const { fileSystem, windowManager } = useOS();
  const [currentPath, setCurrentPath] = useState(initialPath);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([initialPath]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const currentFolder = fileSystem.getNode(currentPath);
  const items = fileSystem.getChildren(currentPath);

  const navigateTo = useCallback(
    (path: string) => {
      setCurrentPath(path);
      setSelectedItem(null);
      setHistory((prev) => [...prev.slice(0, historyIndex + 1), path]);
      setHistoryIndex((prev) => prev + 1);
    },
    [historyIndex],
  );

  const goBack = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1);
      setCurrentPath(history[historyIndex - 1]);
      setSelectedItem(null);
    }
  }, [history, historyIndex]);

  const goForward = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prev) => prev + 1);
      setCurrentPath(history[historyIndex + 1]);
      setSelectedItem(null);
    }
  }, [history, historyIndex]);

  const goUp = useCallback(() => {
    const node = fileSystem.getNode(currentPath);
    if (node?.parentId) {
      navigateTo(node.parentId);
    }
  }, [currentPath, fileSystem, navigateTo]);

  const handleItemDoubleClick = useCallback(
    (item: FileSystemNode) => {
      if (item.type === 'folder') {
        navigateTo(item.id);
      } else if (item.type === 'file') {
        // Open text files with Notepad
        const ext = item.name.split('.').pop()?.toLowerCase();
        if (ext === 'txt' || ext === 'bat' || ext === 'sys') {
          windowManager.openWindow('Notepad', item.name, {
            icon: '📝',
            props: { filePath: item.id },
          });
        }
      }
    },
    [navigateTo, windowManager],
  );

  const handleSidebarClick = useCallback(
    (id: string) => {
      if (fileSystem.getNode(id)) {
        navigateTo(id);
      }
    },
    [fileSystem, navigateTo],
  );

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Toolbar */}
      <div className="border-outset bg-win-gray flex items-center gap-1 border-b p-1">
        <button
          className="border-outset bg-win-gray hover:border-inset flex h-6 w-8 items-center justify-center border text-xs disabled:cursor-not-allowed disabled:opacity-50"
          onClick={goBack}
          disabled={historyIndex === 0}
          title="Back"
        >
          ←
        </button>
        <button
          className="border-outset bg-win-gray hover:border-inset flex h-6 w-8 items-center justify-center border text-xs disabled:cursor-not-allowed disabled:opacity-50"
          onClick={goForward}
          disabled={historyIndex >= history.length - 1}
          title="Forward"
        >
          →
        </button>
        <button
          className="border-outset bg-win-gray hover:border-inset flex h-6 w-8 items-center justify-center border text-xs disabled:cursor-not-allowed disabled:opacity-50"
          onClick={goUp}
          disabled={!currentFolder?.parentId}
          title="Up"
        >
          ↑
        </button>
        <div className="mx-1 h-5 w-px bg-gray-400" />
        <div className="border-inset flex flex-1 items-center border bg-white px-1">
          <span className="mr-1">{currentFolder?.icon || '📁'}</span>
          <span className="text-xs">{currentPath}</span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="sidebar-gradient flex w-28 flex-shrink-0 flex-col p-2 text-white">
          <div className="mb-2 text-xs font-bold">Locations</div>
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              className="mb-1 flex items-center gap-1 rounded px-1 py-0.5 text-left text-xs hover:bg-white/20"
              onClick={() => handleSidebarClick(item.id)}
            >
              <span>{item.icon}</span>
              <span className="truncate">{item.name}</span>
            </button>
          ))}
        </div>

        {/* File list */}
        <div className="flex-1 overflow-auto bg-white p-2">
          {items.length === 0 ? (
            <div className="text-win-dark-gray p-4 text-center text-xs">
              This folder is empty.
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`flex cursor-pointer flex-col items-center p-2 ${
                    selectedItem === item.id
                      ? 'bg-win-blue text-white'
                      : 'hover:bg-blue-100'
                  }`}
                  onClick={() => setSelectedItem(item.id)}
                  onDoubleClick={() => handleItemDoubleClick(item)}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span
                    className={`mt-1 max-w-full truncate text-center text-xs ${
                      selectedItem === item.id ? 'bg-win-blue' : ''
                    }`}
                  >
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div className="border-inset bg-win-gray flex h-5 items-center border-t px-2 text-xs">
        <span>{items.length} object(s)</span>
        {selectedItem && (
          <>
            <span className="mx-2">|</span>
            <span>
              {items.find((i) => i.id === selectedItem)?.name}
              {items.find((i) => i.id === selectedItem)?.size !== undefined &&
                ` - ${formatSize(items.find((i) => i.id === selectedItem)?.size)}`}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
