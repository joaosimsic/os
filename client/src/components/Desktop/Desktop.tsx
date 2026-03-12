import { useState, useCallback, useRef, type MouseEvent } from 'react';
import { useWindowStore } from '../../store/windowManager';
import { Window } from '../Window';
import { Taskbar } from '../Taskbar';
import { DesktopIcon, getGridPosition, snapToGrid } from '../DesktopIcon';
import { getAppComponent } from '../../apps';

interface DesktopIconState {
  id: string;
  title: string;
  icon: string;
  gridCol: number;
  gridRow: number;
  component: string;
}

interface SelectionRect {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

interface DragState {
  isDragging: boolean;
  startX: number;
  startY: number;
  offsetX: number;
  offsetY: number;
}

const defaultIcons: DesktopIconState[] = [
  {
    id: 'my-computer',
    title: 'My Computer',
    icon: '🖥️',
    gridCol: 0,
    gridRow: 0,
    component: 'FileExplorer',
  },
  {
    id: 'recycle-bin',
    title: 'Recycle Bin',
    icon: '🗑️',
    gridCol: 0,
    gridRow: 1,
    component: 'FileExplorer',
  },
  {
    id: 'my-documents',
    title: 'My Documents',
    icon: '📁',
    gridCol: 0,
    gridRow: 2,
    component: 'FileExplorer',
  },
  {
    id: 'notepad',
    title: 'Notepad',
    icon: '📝',
    gridCol: 0,
    gridRow: 3,
    component: 'Notepad',
  },
];

const ICON_WIDTH = 64;
const ICON_HEIGHT = 70;
const GRID_SIZE = 80;

function rectsIntersect(
  r1: { x: number; y: number; width: number; height: number },
  r2: { x: number; y: number; width: number; height: number },
): boolean {
  return !(
    r1.x + r1.width < r2.x ||
    r2.x + r2.width < r1.x ||
    r1.y + r1.height < r2.y ||
    r2.y + r2.height < r1.y
  );
}

export function Desktop() {
  const { windows, openWindow } = useWindowStore();

  const [icons, setIcons] = useState<DesktopIconState[]>(defaultIcons);
  const [selectedIconIds, setSelectedIconIds] = useState<Set<string>>(
    new Set(),
  );
  const [selectionRect, setSelectionRect] = useState<SelectionRect | null>(
    null,
  );
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0,
  });
  const desktopRef = useRef<HTMLDivElement>(null);
  const selectedAtDragStart = useRef<Set<string>>(new Set());

  const handleIconDoubleClick = useCallback(
    (icon: DesktopIconState) => {
      openWindow(icon.component, icon.title, { icon: icon.icon });
    },
    [openWindow],
  );

  const handleDesktopMouseDown = useCallback(
    (e: MouseEvent) => {
      if (e.target !== desktopRef.current) return;

      const startX = e.clientX;
      const startY = e.clientY;

      if (!e.ctrlKey) {
        setSelectedIconIds(new Set());
      }

      setSelectionRect({
        startX,
        startY,
        currentX: startX,
        currentY: startY,
      });

      const handleMouseMove = (e: globalThis.MouseEvent) => {
        setSelectionRect((prev) =>
          prev
            ? {
                ...prev,
                currentX: e.clientX,
                currentY: e.clientY,
              }
            : null,
        );

        const left = Math.min(startX, e.clientX);
        const top = Math.min(startY, e.clientY);
        const width = Math.abs(e.clientX - startX);
        const height = Math.abs(e.clientY - startY);

        const selRect = { x: left, y: top, width, height };

        const newSelected = new Set<string>();
        icons.forEach((icon) => {
          const pos = getGridPosition(icon.gridCol, icon.gridRow);
          const iconRect = {
            x: pos.x,
            y: pos.y,
            width: ICON_WIDTH,
            height: ICON_HEIGHT,
          };

          if (rectsIntersect(selRect, iconRect)) {
            newSelected.add(icon.id);
          }
        });

        setSelectedIconIds(newSelected);
      };

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        setSelectionRect(null);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [icons],
  );

  const handleIconSelect = useCallback((id: string, ctrlKey: boolean) => {
    setSelectedIconIds((prev) => {
      if (prev.has(id) && !ctrlKey) {
        return prev;
      }

      if (ctrlKey) {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      } else {
        return new Set([id]);
      }
    });
  }, []);

  const handleIconDragStart = useCallback((id: string, e: MouseEvent) => {
    const startX = e.clientX;
    const startY = e.clientY;

    setSelectedIconIds((prev) => {
      if (prev.has(id)) {
        selectedAtDragStart.current = prev;
        return prev;
      }
      const newSet = new Set([id]);
      selectedAtDragStart.current = newSet;
      return newSet;
    });

    setDragState({
      isDragging: true,
      startX,
      startY,
      offsetX: 0,
      offsetY: 0,
    });

    const handleMouseMove = (e: globalThis.MouseEvent) => {
      const offsetX = e.clientX - startX;
      const offsetY = e.clientY - startY;
      setDragState((prev) => ({
        ...prev,
        offsetX,
        offsetY,
      }));
    };

    const handleMouseUp = (e: globalThis.MouseEvent) => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);

      const offsetX = e.clientX - startX;
      const offsetY = e.clientY - startY;

      setIcons((prev) =>
        prev.map((icon) => {
          if (!selectedAtDragStart.current.has(icon.id)) {
            return icon;
          }

          const pos = getGridPosition(icon.gridCol, icon.gridRow);
          const newX = pos.x + offsetX;
          const newY = pos.y + offsetY;
          const snapped = snapToGrid(newX, newY);
          const gridCol = Math.round((snapped.x - 8) / GRID_SIZE);
          const gridRow = Math.round((snapped.y - 8) / GRID_SIZE);

          return { ...icon, gridCol, gridRow };
        }),
      );

      setDragState({
        isDragging: false,
        startX: 0,
        startY: 0,
        offsetX: 0,
        offsetY: 0,
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, []);

  const selectionStyle = selectionRect
    ? {
        left: Math.min(selectionRect.startX, selectionRect.currentX),
        top: Math.min(selectionRect.startY, selectionRect.currentY),
        width: Math.abs(selectionRect.currentX - selectionRect.startX),
        height: Math.abs(selectionRect.currentY - selectionRect.startY),
      }
    : null;

  return (
    <div
      ref={desktopRef}
      className="bg-win-teal fixed inset-0 overflow-hidden pb-9 font-[inherit]"
      onMouseDown={handleDesktopMouseDown}
    >
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
            isDragging={dragState.isDragging && isSelected}
            dragOffsetX={dragState.offsetX}
            dragOffsetY={dragState.offsetY}
            onSelect={handleIconSelect}
            onDoubleClick={() => handleIconDoubleClick(icon)}
            onDragStart={handleIconDragStart}
          />
        );
      })}

      {selectionStyle && (
        <div
          className="pointer-events-none absolute border border-white/70 bg-white/20"
          style={selectionStyle}
        />
      )}

      {windows.map((win) => (
        <Window key={win.id} window={win}>
          {getAppComponent(win.component, win.props)}
        </Window>
      ))}

      <Taskbar />
    </div>
  );
}
