import { useState, useCallback, useRef, useEffect, type MouseEvent } from 'react';
import { useMyComputerStore } from '../../store/myComputer';
import { useWindowStore } from '../../store/windowManager';
import { Window } from '../Window';
import { DesktopIcon, getGridPosition, snapToGrid } from '../DesktopIcon';
import { FileEditorModal } from './FileEditorModal';
import type { ComputerFile } from '../../api/client';

interface DesktopIconState {
  id: string;
  title: string;
  icon: string;
  gridCol: number;
  gridRow: number;
  type: 'file' | 'system';
  fileData?: ComputerFile;
}

interface OwnerDesktopProps {
  onShutdown: () => void;
}

const GRID_SIZE = 80;

function getFileIcon(type: string): string {
  switch (type) {
    case 'text': return '📄';
    case 'note': return '📝';
    case 'image': return '🖼️';
    case 'link': return '🔗';
    default: return '📄';
  }
}

// File viewer for owner (with edit capability)
function FileViewer({ file, onEdit }: { file: ComputerFile; onEdit: () => void }) {
  return (
    <div className="flex h-full flex-col bg-white">
      <div className="border-b border-gray-300 p-2">
        <button
          className="border-outset bg-win-gray active:border-inset cursor-pointer border-2 px-3 py-1 text-xs hover:bg-[#d0d0d0]"
          onClick={onEdit}
        >
          Edit
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4">
        {file.type === 'text' || file.type === 'note' ? (
          <pre className="whitespace-pre-wrap font-mono text-sm">{file.content}</pre>
        ) : file.type === 'image' ? (
          <img src={file.content} alt={file.name} className="max-w-full" />
        ) : file.type === 'link' ? (
          <div className="text-center">
            <p className="mb-4 text-sm">This file contains a link:</p>
            <a 
              href={file.content} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              {file.content}
            </a>
          </div>
        ) : (
          <p className="text-gray-500">Unknown file type</p>
        )}
      </div>
    </div>
  );
}

export function OwnerDesktop({ onShutdown }: OwnerDesktopProps) {
  const {
    activeComputer,
    stats,
    isLoading,
    isSaving,
    fetchMyComputers,
    createComputer,
    createFile,
    updateFile,
    deleteFile,
    publishComputer,
    unpublishComputer,
    fetchStats,
  } = useMyComputerStore();

  const { windows, openWindow, closeWindow } = useWindowStore();
  
  const [selectedIconIds, setSelectedIconIds] = useState<Set<string>>(new Set());
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; type: 'desktop' | 'file'; fileId?: string } | null>(null);
  const [isFileEditorOpen, setIsFileEditorOpen] = useState(false);
  const [editingFile, setEditingFile] = useState<ComputerFile | null>(null);
  const [newFilePosition, setNewFilePosition] = useState<{ x: number; y: number } | null>(null);
  
  const desktopRef = useRef<HTMLDivElement>(null);

  // Load computers on mount
  useEffect(() => {
    fetchMyComputers();
  }, [fetchMyComputers]);

  // Fetch stats when active computer changes
  useEffect(() => {
    if (activeComputer) {
      fetchStats(activeComputer.id);
    }
  }, [activeComputer, fetchStats]);

  // Build desktop icons from files
  const icons: DesktopIconState[] = [];

  if (activeComputer) {
    activeComputer.files
      .filter((f) => !f.folderId)
      .forEach((file) => {
        icons.push({
          id: file.id,
          title: file.name,
          icon: file.icon || getFileIcon(file.type),
          gridCol: file.positionX || 0,
          gridRow: file.positionY || 0,
          type: 'file',
          fileData: file,
        });
      });
  }

  const handleIconDoubleClick = useCallback(
    (icon: DesktopIconState) => {
      if (icon.type === 'file' && icon.fileData) {
        openWindow('OwnerFileViewer', icon.title, {
          icon: icon.icon,
          width: 600,
          height: 400,
          props: { file: icon.fileData },
        });
      }
    },
    [openWindow],
  );

  const handleDesktopClick = useCallback((e: MouseEvent) => {
    if (e.target === desktopRef.current) {
      setSelectedIconIds(new Set());
      setContextMenu(null);
    }
  }, []);

  const handleDesktopContextMenu = useCallback((e: MouseEvent) => {
    e.preventDefault();
    if (e.target === desktopRef.current) {
      setContextMenu({ x: e.clientX, y: e.clientY, type: 'desktop' });
      // Store position for new file
      const snapped = snapToGrid(e.clientX, e.clientY);
      const gridCol = Math.round((snapped.x - 8) / GRID_SIZE);
      const gridRow = Math.round((snapped.y - 8) / GRID_SIZE);
      setNewFilePosition({ x: gridCol, y: gridRow });
    }
  }, []);

  const handleIconSelect = useCallback((id: string, ctrlKey: boolean) => {
    setContextMenu(null);
    setSelectedIconIds((prev) => {
      if (ctrlKey) {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      }
      return new Set([id]);
    });
  }, []);

  const handleIconContextMenu = useCallback((id: string, e: MouseEvent) => {
    e.preventDefault();
    setSelectedIconIds(new Set([id]));
    setContextMenu({ x: e.clientX, y: e.clientY, type: 'file', fileId: id });
  }, []);

  const handleCreateNewFile = () => {
    setContextMenu(null);
    setEditingFile(null);
    setIsFileEditorOpen(true);
  };

  const handleEditFile = (file: ComputerFile) => {
    setEditingFile(file);
    setIsFileEditorOpen(true);
    // Close any open windows for this file
    windows.forEach((w) => {
      if (w.props?.file && (w.props.file as ComputerFile).id === file.id) {
        closeWindow(w.id);
      }
    });
  };

  const handleDeleteFile = async (fileId: string) => {
    setContextMenu(null);
    if (confirm('Are you sure you want to delete this file?')) {
      await deleteFile(fileId);
    }
  };

  const handleSaveFile = async (data: { name: string; type: string; content: string }) => {
    if (editingFile) {
      // Update existing file
      await updateFile(editingFile.id, data);
    } else {
      // Create new file
      await createFile({
        ...data,
        positionX: newFilePosition?.x || 0,
        positionY: newFilePosition?.y || 0,
      });
    }
    setIsFileEditorOpen(false);
    setEditingFile(null);
    setNewFilePosition(null);
  };

  const handlePublishToggle = async () => {
    if (!activeComputer) return;
    
    if (activeComputer.isPublished) {
      if (confirm('This will hide your computer from discovery. Continue?')) {
        await unpublishComputer(activeComputer.id);
      }
    } else {
      if (confirm('This will make your computer discoverable by strangers. Continue?')) {
        await publishComputer(activeComputer.id);
      }
    }
  };

  const handleCreateFirstComputer = async () => {
    await createComputer();
  };

  const getWindowComponent = (component: string, props?: Record<string, unknown>) => {
    if (component === 'OwnerFileViewer' && props?.file) {
      const file = props.file as ComputerFile;
      return <FileViewer file={file} onEdit={() => handleEditFile(file)} />;
    }
    return <div>Unknown component</div>;
  };

  // No computer yet - show creation prompt
  if (!activeComputer && !isLoading) {
    return (
      <div className="bg-win-teal fixed inset-0 flex items-center justify-center">
        <div className="border-outset bg-win-gray w-[400px] border-2 p-6">
          <h2 className="mb-4 text-center text-lg font-bold text-black">
            Create Your Life Capsule
          </h2>
          <p className="mb-4 text-center text-sm text-gray-700">
            Your computer is a digital time capsule containing fragments of your life 
            that strangers can discover anonymously.
          </p>
          <div className="flex justify-center gap-4">
            <button
              className="border-outset bg-win-gray active:border-inset cursor-pointer border-2 px-4 py-2 text-sm hover:bg-[#d0d0d0]"
              onClick={onShutdown}
            >
              Log Out
            </button>
            <button
              className="border-outset bg-win-gray active:border-inset cursor-pointer border-2 px-4 py-2 text-sm font-bold hover:bg-[#d0d0d0]"
              onClick={handleCreateFirstComputer}
              disabled={isSaving}
            >
              {isSaving ? 'Creating...' : 'Create Computer'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-win-teal fixed inset-0 flex items-center justify-center">
        <div className="border-outset bg-win-gray border-2 p-4">
          <p className="text-sm">Loading your computer...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={desktopRef}
      className="bg-win-teal fixed inset-0 overflow-hidden pb-9"
      onClick={handleDesktopClick}
      onContextMenu={handleDesktopContextMenu}
    >
      {/* Stats - top right */}
      {stats && (
        <div className="absolute top-2 right-2 text-xs text-white/70">
          {activeComputer?.isPublished ? (
            <span>Visitors: {stats.visitCount.toLocaleString()}</span>
          ) : (
            <span className="italic">Not published</span>
          )}
        </div>
      )}

      {/* Desktop icons */}
      {icons.map((icon) => {
        const pos = getGridPosition(icon.gridCol, icon.gridRow);
        const isSelected = selectedIconIds.has(icon.id);
        return (
          <div
            key={icon.id}
            onContextMenu={(e) => handleIconContextMenu(icon.id, e)}
          >
            <DesktopIcon
              id={icon.id}
              icon={icon.icon}
              title={icon.title}
              x={pos.x}
              y={pos.y}
              isSelected={isSelected}
              isDragging={false}
              dragOffsetX={0}
              dragOffsetY={0}
              onSelect={handleIconSelect}
              onDoubleClick={() => handleIconDoubleClick(icon)}
              onDragStart={() => {}}
            />
          </div>
        );
      })}

      {/* Empty state */}
      {icons.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pb-20">
          <div className="text-center text-white/50">
            <p className="text-lg">Your desktop is empty</p>
            <p className="mt-2 text-sm">Right-click to create your first file</p>
          </div>
        </div>
      )}

      {/* Context menu */}
      {contextMenu && (
        <div
          className="border-outset bg-win-gray absolute z-[9999] min-w-[150px] border-2 py-1"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          {contextMenu.type === 'desktop' ? (
            <>
              <button
                className="w-full px-4 py-1 text-left text-sm hover:bg-[#000080] hover:text-white"
                onClick={handleCreateNewFile}
              >
                New File...
              </button>
              <div className="my-1 h-px bg-gray-400" />
              <button
                className="w-full px-4 py-1 text-left text-sm hover:bg-[#000080] hover:text-white"
                onClick={() => {
                  setContextMenu(null);
                  if (activeComputer) fetchStats(activeComputer.id);
                }}
              >
                Refresh
              </button>
            </>
          ) : (
            <>
              <button
                className="w-full px-4 py-1 text-left text-sm hover:bg-[#000080] hover:text-white"
                onClick={() => {
                  const file = activeComputer?.files.find((f) => f.id === contextMenu.fileId);
                  if (file) {
                    setContextMenu(null);
                    handleEditFile(file);
                  }
                }}
              >
                Edit
              </button>
              <button
                className="w-full px-4 py-1 text-left text-sm hover:bg-[#000080] hover:text-white"
                onClick={() => contextMenu.fileId && handleDeleteFile(contextMenu.fileId)}
              >
                Delete
              </button>
            </>
          )}
        </div>
      )}

      {/* Windows */}
      {windows.map((win) => (
        <Window key={win.id} window={win}>
          {getWindowComponent(win.component, win.props)}
        </Window>
      ))}

      {/* File editor modal */}
      <FileEditorModal
        isOpen={isFileEditorOpen}
        initialData={editingFile ? {
          name: editingFile.name,
          type: editingFile.type,
          content: editingFile.content,
        } : undefined}
        onSave={handleSaveFile}
        onCancel={() => {
          setIsFileEditorOpen(false);
          setEditingFile(null);
        }}
        title={editingFile ? 'Edit File' : 'New File'}
      />

      {/* Bottom toolbar */}
      <div className="border-outset bg-win-gray absolute right-0 bottom-0 left-0 flex h-9 items-center justify-between border-t-2 px-2">
        <button
          className="border-outset bg-win-gray active:border-inset cursor-pointer border-2 px-3 py-1 text-xs hover:bg-[#d0d0d0]"
          onClick={onShutdown}
        >
          Log Out
        </button>

        <span className="text-xs text-gray-600">
          {activeComputer?.name || 'My Computer'}
          {isSaving && ' (Saving...)'}
        </span>

        <button
          className={`border-outset active:border-inset cursor-pointer border-2 px-3 py-1 text-xs hover:bg-[#d0d0d0] ${
            activeComputer?.isPublished ? 'bg-green-200' : 'bg-win-gray'
          }`}
          onClick={handlePublishToggle}
          disabled={isSaving}
        >
          {activeComputer?.isPublished ? '✓ Published' : 'Publish'}
        </button>
      </div>
    </div>
  );
}
