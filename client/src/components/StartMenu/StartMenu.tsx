import { useEffect, useRef } from 'react';
import { useOS } from '../../context/OSContext';

interface StartMenuProps {
  onClose: () => void;
}

export function StartMenu({ onClose }: StartMenuProps) {
  const { windowManager } = useOS();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const menuItems = [
    {
      id: 'programs',
      label: 'Programs',
      icon: '📁',
      action: () => {
        windowManager.openWindow('FileExplorer', 'Programs', { icon: '📁' });
        onClose();
      },
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: '📄',
      action: () => {
        windowManager.openWindow('FileExplorer', 'My Documents', {
          icon: '📄',
        });
        onClose();
      },
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
      action: () => {
        windowManager.openWindow('Settings', 'Settings', { icon: '⚙️' });
        onClose();
      },
    },
    {
      id: 'help',
      label: 'Help',
      icon: '❓',
      action: () => {
        windowManager.openWindow('Help', 'Help', { icon: '❓' });
        onClose();
      },
    },
  ];

  return (
    <div
      ref={menuRef}
      className="border-outset bg-win-gray absolute bottom-9 left-0.5 flex min-w-[200px] border-2 shadow-[2px_2px_0_0_#000]"
    >
      <div className="sidebar-gradient flex w-6 items-end px-0.5 py-1">
        <span className="text-win-gray rotate-180 text-lg font-bold tracking-widest [text-orientation:mixed] [text-shadow:1px_1px_0_#000] [writing-mode:vertical-rl]">
          RetroOS
        </span>
      </div>
      <div className="flex-1 py-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className="hover:bg-win-blue flex w-full cursor-pointer items-center gap-2 border-none bg-transparent px-3 py-1.5 text-left text-xs hover:text-white"
            onClick={item.action}
          >
            <span className="w-5 text-center">{item.icon}</span>
            <span className="flex-1">{item.label}</span>
          </button>
        ))}
        <div className="border-win-highlight bg-win-dark-gray mx-2 my-1 h-px border-b" />
        <button className="hover:bg-win-blue flex w-full cursor-pointer items-center gap-2 border-none bg-transparent px-3 py-1.5 text-left text-xs hover:text-white">
          <span className="w-5 text-center">🔌</span>
          <span className="flex-1">Shut Down...</span>
        </button>
      </div>
    </div>
  );
}
