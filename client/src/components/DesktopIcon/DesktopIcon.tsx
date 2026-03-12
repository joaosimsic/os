import { useCallback, type MouseEvent } from 'react';

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
  isDragging?: boolean;
  dragOffsetX?: number;
  dragOffsetY?: number;
  onSelect: (id: string, ctrlKey: boolean) => void;
  onDoubleClick: () => void;
  onDragStart?: (id: string, e: MouseEvent) => void;
}

export function DesktopIcon({
  id,
  icon,
  title,
  x,
  y,
  isSelected,
  isDragging = false,
  dragOffsetX = 0,
  dragOffsetY = 0,
  onSelect,
  onDoubleClick,
  onDragStart,
}: DesktopIconProps) {
  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();

      const ctrlKey = e.ctrlKey || e.metaKey;
      onSelect(id, ctrlKey);

      if (onDragStart) {
        e.preventDefault();
        onDragStart(id, e);
      }
    },
    [id, onSelect, onDragStart],
  );

  const currentX = isDragging ? x + dragOffsetX : x;
  const currentY = isDragging ? y + dragOffsetY : y;

  return (
    <div
      className="absolute flex w-16 cursor-pointer flex-col items-center p-1 select-none"
      style={{
        left: currentX,
        top: currentY,
        zIndex: isDragging ? 1000 : 1,
      }}
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
