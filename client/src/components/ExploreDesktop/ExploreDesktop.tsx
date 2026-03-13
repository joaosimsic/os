import { useState, useCallback, useRef, type MouseEvent } from 'react';
import { useWindowStore } from '../../store/windowManager';
import { useComputerStore } from '../../store/computer';
import { Window } from '../Window';
import { DesktopIcon, getGridPosition } from '../DesktopIcon';
import type { ComputerFile, ComputerFolder } from '../../api/client';

interface DesktopIconState {
  id: string;
  title: string;
  icon: string;
  gridCol: number;
  gridRow: number;
  type: 'file' | 'folder';
  data: ComputerFile | ComputerFolder;
}

interface ExploreDesktopProps {
  onExit: () => void;
}

// File viewer component
function FileViewer({ file }: { file: ComputerFile }) {
  return (
    <div className="flex h-full flex-col bg-white">
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

function getFileIcon(type: string): string {
  switch (type) {
    case 'text': return '📄';
    case 'note': return '📝';
    case 'image': return '🖼️';
    case 'link': return '🔗';
    default: return '📄';
  }
}

export function ExploreDesktop({ onExit }: ExploreDesktopProps) {
  const { currentComputer, discoverRandom, isLoading } = useComputerStore();
  const { windows, openWindow, closeWindow } = useWindowStore();
  const [selectedIconIds, setSelectedIconIds] = useState<Set<string>>(new Set());
  const desktopRef = useRef<HTMLDivElement>(null);

  // Convert computer files to desktop icons
  const icons: DesktopIconState[] = [];
  
  if (currentComputer) {
    // Add files on desktop (no folder)
    currentComputer.files
      .filter(f => !f.folderId)
      .forEach((file, index) => {
        icons.push({
          id: file.id,
          title: file.name,
          icon: file.icon || getFileIcon(file.type),
          gridCol: file.positionX || 0,
          gridRow: file.positionY || index,
          type: 'file',
          data: file,
        });
      });

    // Add folders on desktop
    currentComputer.folders
      .filter(f => !f.parentId)
      .forEach((folder, index) => {
        icons.push({
          id: folder.id,
          title: folder.name,
          icon: folder.icon || '📁',
          gridCol: folder.positionX || 1,
          gridRow: folder.positionY || index,
          type: 'folder',
          data: folder,
        });
      });
  }

  const handleIconDoubleClick = useCallback(
    (icon: DesktopIconState) => {
      if (icon.type === 'file') {
        const file = icon.data as ComputerFile;
        openWindow('FileViewer', icon.title, {
          icon: icon.icon,
          width: 600,
          height: 400,
          props: { file },
        });
      } else {
        // TODO: Open folder view
        const folder = icon.data as ComputerFolder;
        openWindow('FolderViewer', icon.title, {
          icon: '📁',
          width: 500,
          height: 400,
          props: { folder },
        });
      }
    },
    [openWindow],
  );

  const handleDesktopClick = useCallback(
    (e: MouseEvent) => {
      if (e.target === desktopRef.current) {
        setSelectedIconIds(new Set());
      }
    },
    [],
  );

  const handleIconSelect = useCallback((id: string, ctrlKey: boolean) => {
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

  const handleNextComputer = async () => {
    // Close all windows first
    windows.forEach(w => closeWindow(w.id));
    await discoverRandom();
  };

  const getWindowComponent = (component: string, props?: Record<string, unknown>) => {
    if (component === 'FileViewer' && props?.file) {
      return <FileViewer file={props.file as ComputerFile} />;
    }
    if (component === 'FolderViewer' && props?.folder) {
      const folder = props.folder as ComputerFolder;
      return (
        <div className="h-full bg-white p-4">
          <p className="text-sm text-gray-600">
            {folder.files.length} file(s) in this folder
          </p>
          <div className="mt-4 grid grid-cols-4 gap-4">
            {folder.files.map(file => (
              <div 
                key={file.id} 
                className="flex flex-col items-center cursor-pointer hover:bg-blue-100 p-2 rounded"
                onDoubleClick={() => openWindow('FileViewer', file.name, {
                  icon: getFileIcon(file.type),
                  width: 600,
                  height: 400,
                  props: { file },
                })}
              >
                <span className="text-2xl">{getFileIcon(file.type)}</span>
                <span className="text-xs text-center mt-1">{file.name}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return <div>Unknown component</div>;
  };

  if (!currentComputer) {
    return (
      <div className="bg-win-teal fixed inset-0 flex items-center justify-center">
        <div className="border-outset bg-win-gray border-2 p-6 text-center">
          <p className="mb-4 text-sm">No computer to explore</p>
          <button
            className="border-outset bg-win-gray active:border-inset cursor-pointer border-2 px-4 py-2 text-sm hover:bg-[#d0d0d0]"
            onClick={onExit}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={desktopRef}
      className="bg-win-teal fixed inset-0 overflow-hidden pb-9"
      onClick={handleDesktopClick}
    >
      {/* Visit counter - top right */}
      <div className="absolute top-2 right-2 text-xs text-white/70">
        Visitors: {currentComputer.visitCount.toLocaleString()}
      </div>

      {/* Desktop icons */}
      {icons.map((icon) => {
        const pos = getGridPosition(icon.gridCol, icon.gridRow);
        const isSelected = selectedIconIds.has(icon.id);
        return (
          <DesktopIcon
            key={icon.id}
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
        );
      })}

      {/* Windows */}
      {windows.map((win) => (
        <Window key={win.id} window={win}>
          {getWindowComponent(win.component, win.props)}
        </Window>
      ))}

      {/* Bottom toolbar */}
      <div className="border-outset bg-win-gray absolute right-0 bottom-0 left-0 flex h-9 items-center justify-between border-t-2 px-2">
        <button
          className="border-outset bg-win-gray active:border-inset cursor-pointer border-2 px-3 py-1 text-xs hover:bg-[#d0d0d0]"
          onClick={onExit}
        >
          Exit
        </button>
        
        <span className="text-xs text-gray-600">
          Exploring: {currentComputer.name}
        </span>

        <button
          className="border-outset bg-win-gray active:border-inset cursor-pointer border-2 px-3 py-1 text-xs hover:bg-[#d0d0d0] disabled:opacity-50"
          onClick={handleNextComputer}
          disabled={isLoading}
        >
          {isLoading ? 'Finding...' : 'Next Life →'}
        </button>
      </div>
    </div>
  );
}
