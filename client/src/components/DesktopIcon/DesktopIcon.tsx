import { useCallback, useRef, useState, type MouseEvent } from 'react';

// Grid configuration
const GRID_SIZE = 80;
const GRID_PADDING = 8;

export function snapToGrid(x: number, y: number): { x: number; y: number } {
  const snappedX = Math.round(x / GRID_SIZE) * GRID_SIZE + GRID_PADDING;
  const snappedY = Math.round(y / GRID_SIZE) * GRID_SIZE + GRID_PADDING;
  return { x: snappedX, y: snappedY };
}

export function getGridPosition(
  col: number,
  row: number,
): { x: number; y: number } {
  return {
    x: col * GRID_SIZE + GRID_PADDING,
    y: row * GRID_SIZE + GRID_PADDING,
  };
}

interface DesktopIconProps {
  id: string;
  icon: string;
  title: string;
  x: number;
  y: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDoubleClick: () => void;
  onMove?: (x: number, y: number) => void;
}

export function DesktopIcon({
  id,
  icon,
  title,
  x,
  y,
  isSelected,
  onSelect,
  onDoubleClick,
  onMove,
}: DesktopIconProps) {
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      onSelect(id);

      if (!onMove) return;
      e.preventDefault();

      dragOffset.current = { x: e.clientX - x, y: e.clientY - y };
      setDragPos({ x, y });

      const handleMouseMove = (e: globalThis.MouseEvent) => {
        setDragPos({
          x: e.clientX - dragOffset.current.x,
          y: e.clientY - dragOffset.current.y,
        });
      };

      const handleMouseUp = (e: globalThis.MouseEvent) => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);

        const rawX = e.clientX - dragOffset.current.x;
        const rawY = e.clientY - dragOffset.current.y;
        const snapped = snapToGrid(rawX, rawY);

        setDragPos(null);
        onMove(snapped.x, snapped.y);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [id, x, y, onMove, onSelect],
  );

  const currentX = dragPos?.x ?? x;
  const currentY = dragPos?.y ?? y;

  return (
    <div
      className="absolute flex w-16 cursor-pointer flex-col items-center p-1 select-none"
      style={{ left: currentX, top: currentY }}
      onMouseDown={handleMouseDown}
      onDoubleClick={onDoubleClick}
    >
      <div className={`mb-1 text-[32px] ${isSelected ? 'bg-win-blue/30' : ''}`}>
        {icon}
      </div>
      <span
        className={`max-w-16 px-0.5 py-px text-center text-[11px] break-words text-white [text-shadow:1px_1px_1px_#000] ${
          isSelected ? 'bg-win-blue text-white' : ''
        }`}
      >
        {title}
      </span>
    </div>
  );
}

export { GRID_SIZE, GRID_PADDING };
