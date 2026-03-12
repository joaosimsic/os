import {
  useRef,
  useCallback,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react';
import type { WindowState } from '../../types';
import { useOS } from '../../context/OSContext';

type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

interface WindowProps {
  window: WindowState;
  children: ReactNode;
}

export function Window({ window: win, children }: WindowProps) {
  const { windowManager } = useOS();
  const windowRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({
    x: 0,
    y: 0,
    winX: 0,
    winY: 0,
    width: 0,
    height: 0,
  });

  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const [resizeState, setResizeState] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const handleTitleBarMouseDown = useCallback(
    (e: MouseEvent) => {
      if (win.isMaximized) return;
      e.preventDefault();
      windowManager.focusWindow(win.id);

      dragOffset.current = { x: e.clientX - win.x, y: e.clientY - win.y };
      setDragPos({ x: win.x, y: win.y });

      const handleMouseMove = (e: globalThis.MouseEvent) => {
        setDragPos({
          x: e.clientX - dragOffset.current.x,
          y: e.clientY - dragOffset.current.y,
        });
      };

      const handleMouseUp = (e: globalThis.MouseEvent) => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);

        const finalX = e.clientX - dragOffset.current.x;
        const finalY = e.clientY - dragOffset.current.y;
        setDragPos(null);
        windowManager.moveWindow(win.id, finalX, finalY);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [win.id, win.x, win.y, win.isMaximized, windowManager],
  );

  const handleResizeMouseDown = useCallback(
    (e: MouseEvent, direction: ResizeDirection) => {
      if (win.isMaximized) return;
      e.preventDefault();
      e.stopPropagation();

      const minWidth = win.minWidth ?? 200;
      const minHeight = win.minHeight ?? 150;

      resizeStart.current = {
        x: e.clientX,
        y: e.clientY,
        winX: win.x,
        winY: win.y,
        width: win.width,
        height: win.height,
      };
      setResizeState({
        x: win.x,
        y: win.y,
        width: win.width,
        height: win.height,
      });

      const handleMouseMove = (e: globalThis.MouseEvent) => {
        const deltaX = e.clientX - resizeStart.current.x;
        const deltaY = e.clientY - resizeStart.current.y;

        let newX = resizeStart.current.winX;
        let newY = resizeStart.current.winY;
        let newWidth = resizeStart.current.width;
        let newHeight = resizeStart.current.height;

        // Handle horizontal resizing
        if (direction.includes('e')) {
          newWidth = Math.max(resizeStart.current.width + deltaX, minWidth);
        } else if (direction.includes('w')) {
          const proposedWidth = resizeStart.current.width - deltaX;
          if (proposedWidth >= minWidth) {
            newWidth = proposedWidth;
            newX = resizeStart.current.winX + deltaX;
          } else {
            newWidth = minWidth;
            newX =
              resizeStart.current.winX + resizeStart.current.width - minWidth;
          }
        }

        // Handle vertical resizing
        if (direction.includes('s')) {
          newHeight = Math.max(resizeStart.current.height + deltaY, minHeight);
        } else if (direction.includes('n')) {
          const proposedHeight = resizeStart.current.height - deltaY;
          if (proposedHeight >= minHeight) {
            newHeight = proposedHeight;
            newY = resizeStart.current.winY + deltaY;
          } else {
            newHeight = minHeight;
            newY =
              resizeStart.current.winY + resizeStart.current.height - minHeight;
          }
        }

        setResizeState({
          x: newX,
          y: newY,
          width: newWidth,
          height: newHeight,
        });
      };

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);

        setResizeState((state) => {
          if (state) {
            windowManager.moveAndResizeWindow(
              win.id,
              state.x,
              state.y,
              state.width,
              state.height,
            );
          }
          return null;
        });
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [
      win.id,
      win.x,
      win.y,
      win.width,
      win.height,
      win.minWidth,
      win.minHeight,
      win.isMaximized,
      windowManager,
    ],
  );

  if (win.isMinimized) return null;

  const currentX = resizeState?.x ?? dragPos?.x ?? win.x;
  const currentY = resizeState?.y ?? dragPos?.y ?? win.y;
  const currentWidth = resizeState?.width ?? win.width;
  const currentHeight = resizeState?.height ?? win.height;

  const windowStyle = win.isMaximized
    ? {
        left: 0,
        top: 0,
        width: '100%',
        height: 'calc(100% - 36px)',
        zIndex: win.zIndex,
      }
    : {
        left: currentX,
        top: currentY,
        width: currentWidth,
        height: currentHeight,
        zIndex: win.zIndex,
      };

  return (
    <div
      ref={windowRef}
      className="border-outset bg-win-gray absolute flex flex-col border-2 shadow-[1px_1px_0_0_#000]"
      style={windowStyle}
      onMouseDown={() => windowManager.focusWindow(win.id)}
    >
      <div
        className="title-bar-gradient flex h-[22px] cursor-default items-center px-[3px] py-0.5 text-xs font-bold text-white select-none"
        onMouseDown={handleTitleBarMouseDown}
      >
        {win.icon && <span className="mr-1 text-sm">{win.icon}</span>}
        <span className="flex-1 truncate">{win.title}</span>
        <div className="flex gap-0.5">
          <button
            className="border-outset bg-win-gray active:border-inset flex h-3.5 w-4 cursor-pointer items-center justify-center border p-0 text-[10px] leading-none"
            onClick={() => windowManager.minimizeWindow(win.id)}
            aria-label="Minimize"
          >
            _
          </button>
          <button
            className="border-outset bg-win-gray active:border-inset flex h-3.5 w-4 cursor-pointer items-center justify-center border p-0 text-[10px] leading-none"
            onClick={() => windowManager.maximizeWindow(win.id)}
            aria-label="Maximize"
          >
            {win.isMaximized ? '❐' : '□'}
          </button>
          <button
            className="border-outset bg-win-gray active:border-inset flex h-3.5 w-4 cursor-pointer items-center justify-center border p-0 text-sm leading-none font-bold"
            onClick={() => windowManager.closeWindow(win.id)}
            aria-label="Close"
          >
            ×
          </button>
        </div>
      </div>
      <div className="border-inset bg-win-gray m-0.5 flex-1 overflow-auto border-2">
        {children}
      </div>
      {/* Resize handles */}
      {!win.isMaximized && (
        <>
          {/* Edge handles */}
          <div
            className="absolute top-0 right-1 left-1 h-1 cursor-n-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'n')}
          />
          <div
            className="absolute top-1 right-0 bottom-1 w-1 cursor-e-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'e')}
          />
          <div
            className="absolute right-1 bottom-0 left-1 h-1 cursor-s-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 's')}
          />
          <div
            className="absolute top-1 bottom-1 left-0 w-1 cursor-w-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'w')}
          />
          {/* Corner handles */}
          <div
            className="absolute top-0 left-0 h-2 w-2 cursor-nw-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'nw')}
          />
          <div
            className="absolute top-0 right-0 h-2 w-2 cursor-ne-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'ne')}
          />
          <div
            className="absolute bottom-0 left-0 h-2 w-2 cursor-sw-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'sw')}
          />
          <div
            className="resize-handle-pattern absolute right-0 bottom-0 h-4 w-4 cursor-se-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'se')}
          />
        </>
      )}
    </div>
  );
}
