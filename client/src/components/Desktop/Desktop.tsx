import { useState, useCallback } from 'react';
import { useOS } from '../../context/OSContext';
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

export function Desktop() {
  const { windowManager } = useOS();
  const [icons, setIcons] = useState<DesktopIconState[]>(defaultIcons);
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);

  const handleIconMove = useCallback((id: string, x: number, y: number) => {
    const snapped = snapToGrid(x, y);
    const gridCol = Math.round((snapped.x - 8) / 80);
    const gridRow = Math.round((snapped.y - 8) / 80);

    setIcons((prev) =>
      prev.map((icon) =>
        icon.id === id ? { ...icon, gridCol, gridRow } : icon,
      ),
    );
  }, []);

  const handleIconDoubleClick = useCallback(
    (icon: DesktopIconState) => {
      windowManager.openWindow(icon.component, icon.title, { icon: icon.icon });
    },
    [windowManager],
  );

  const handleDesktopClick = useCallback(() => {
    setSelectedIconId(null);
  }, []);

  const handleIconSelect = useCallback((id: string) => {
    setSelectedIconId(id);
  }, []);

  return (
    <div
      className="bg-win-teal fixed inset-0 overflow-hidden pb-9 font-[inherit]"
      onMouseDown={handleDesktopClick}
    >
      {icons.map((icon) => {
        const pos = getGridPosition(icon.gridCol, icon.gridRow);
        return (
          <DesktopIcon
            key={icon.id}
            id={icon.id}
            icon={icon.icon}
            title={icon.title}
            x={pos.x}
            y={pos.y}
            isSelected={selectedIconId === icon.id}
            onSelect={handleIconSelect}
            onDoubleClick={() => handleIconDoubleClick(icon)}
            onMove={(x, y) => handleIconMove(icon.id, x, y)}
          />
        );
      })}

      {windowManager.windows.map((win) => (
        <Window key={win.id} window={win}>
          {getAppComponent(win.component, win.props)}
        </Window>
      ))}

      <Taskbar />
    </div>
  );
}
