import { useState } from 'react';
import { useOS } from '../../context/OSContext';
import { StartMenu } from '../StartMenu';

export function Taskbar() {
  const { windowManager } = useOS();
  const [startMenuOpen, setStartMenuOpen] = useState(false);

  const currentTime = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="border-win-highlight bg-win-gray fixed inset-x-0 bottom-0 z-[9999] flex h-12 items-center border-t-2 p-0.5">
      <button
        className={`bg-win-gray flex h-[90%] cursor-pointer items-center gap-1 border-2 px-2 py-0.5 text-xl font-bold ${
          startMenuOpen ? 'border-inset' : 'border-outset'
        }`}
        onClick={() => setStartMenuOpen(!startMenuOpen)}
      >
        <span className="text-base">🪟</span>
        <span className="text-base">Start</span>
      </button>

      {startMenuOpen && <StartMenu onClose={() => setStartMenuOpen(false)} />}

      <div className="ml-1 flex flex-1 gap-0.5 h-[90%] overflow-x-auto">
        {windowManager.windows.map((win) => (
          <button
            key={win.id}
            className={`bg-win-gray flex h-full max-w-[180px] min-w-[120px] cursor-pointer items-center gap-1 overflow-hidden border-2 px-1.5 py-0.5 text-[11px] ${
              !win.isMinimized
                ? 'border-inset active-task-pattern'
                : 'border-outset'
            }`}
            onClick={() => {
              if (win.isMinimized) {
                windowManager.focusWindow(win.id);
              } else {
                windowManager.minimizeWindow(win.id);
              }
            }}
          >
            {win.icon && <span className="shrink-0">{win.icon}</span>}
            <span className="truncate text-base">{win.title}</span>
          </button>
        ))}
      </div>

      <div className="border-inset bg-win-gray ml-1 flex h-[90%] items-center border-2 px-2">
        <span className="text-base">{currentTime}</span>
      </div>
    </div>
  );
}
