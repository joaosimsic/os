import {
  useRef,
  useCallback,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react';
import type { WindowState } from '../../types';
import { useOS } from '../../context/OSContext';

interface WindowProps {
  window: WindowState;
  children: ReactNode;
}

export function Window({ window: win, children }: WindowProps) {
  const { windowManager } = useOS();
  const windowRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0 });

  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const [resizeSize, setResizeSize] = useState<{
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
    (e: MouseEvent) => {
      if (win.isMaximized) return;
      e.preventDefault();
      e.stopPropagation();

      resizeStart.current = {
        x: e.clientX,
        y: e.clientY,
        width: win.width,
        height: win.height,
      };
      setResizeSize({ width: win.width, height: win.height });

      const handleMouseMove = (e: globalThis.MouseEvent) => {
        const deltaX = e.clientX - resizeStart.current.x;
        const deltaY = e.clientY - resizeStart.current.y;
        setResizeSize({
          width: Math.max(
            resizeStart.current.width + deltaX,
            win.minWidth ?? 200,
          ),
          height: Math.max(
            resizeStart.current.height + deltaY,
            win.minHeight ?? 150,
          ),
        });
      };

      const handleMouseUp = (e: globalThis.MouseEvent) => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);

        const deltaX = e.clientX - resizeStart.current.x;
        const deltaY = e.clientY - resizeStart.current.y;
        setResizeSize(null);
        windowManager.resizeWindow(
          win.id,
          resizeStart.current.width + deltaX,
          resizeStart.current.height + deltaY,
        );
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [
      win.id,
      win.width,
      win.height,
      win.minWidth,
      win.minHeight,
      win.isMaximized,
      windowManager,
    ],
  );

  if (win.isMinimized) return null;

  const currentX = dragPos?.x ?? win.x;
  const currentY = dragPos?.y ?? win.y;
  const currentWidth = resizeSize?.width ?? win.width;
  const currentHeight = resizeSize?.height ?? win.height;

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
      {!win.isMaximized && (
        <div
          className="resize-handle-pattern absolute right-0 bottom-0 h-4 w-4 cursor-se-resize"
          onMouseDown={handleResizeMouseDown}
        />
      )}
    </div>
  );
}
