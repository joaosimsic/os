import { useState, useCallback, useRef } from 'react';
import { useFileSystemStore } from '../../store/fileSystem';

interface NotepadProps {
  filePath?: string;
}

export function Notepad({ filePath: initialFilePath }: NotepadProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const readFile = useFileSystemStore((state) => state.readFile);
  const writeFile = useFileSystemStore((state) => state.writeFile);
  const getChildren = useFileSystemStore((state) => state.getChildren);

  const [content, setContent] = useState(() => {
    if (initialFilePath) {
      return readFile(initialFilePath) ?? '';
    }
    return '';
  });

  const [filePath, setFilePath] = useState(initialFilePath || '');
  const [isModified, setIsModified] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showOpenDialog, setShowOpenDialog] = useState(false);
  const [dialogPath, setDialogPath] = useState('C:/My Documents');
  const [dialogFileName, setDialogFileName] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleContentChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setContent(e.target.value);
      setIsModified(true);
    },
    [],
  );

  const handleNew = useCallback(() => {
    if (isModified) {
      if (
        !window.confirm('You have unsaved changes. Create new file anyway?')
      ) {
        return;
      }
    }
    setContent('');
    setFilePath('');
    setIsModified(false);
    setStatusMessage('New file created');
  }, [isModified]);

  const handleOpen = useCallback(() => {
    setDialogPath('C:/My Documents');
    setDialogFileName('');
    setShowOpenDialog(true);
  }, []);

  const handleSave = useCallback(() => {
    if (!filePath) {
      setDialogPath('C:/My Documents');
      setDialogFileName('untitled.txt');
      setShowSaveDialog(true);
      return;
    }

    const success = writeFile(filePath, content);
    if (success) {
      setIsModified(false);
      setStatusMessage(`Saved to ${filePath}`);
    } else {
      setStatusMessage('Error: Could not save file');
    }
  }, [filePath, content, writeFile]);

  const handleSaveAs = useCallback(() => {
    const fileName = filePath
      ? filePath.split('/').pop() || 'untitled.txt'
      : 'untitled.txt';
    const folder = filePath
      ? filePath.substring(0, filePath.lastIndexOf('/')) || 'C:/My Documents'
      : 'C:/My Documents';
    setDialogPath(folder);
    setDialogFileName(fileName);
    setShowSaveDialog(true);
  }, [filePath]);

  const handleSaveDialogConfirm = useCallback(() => {
    if (!dialogFileName.trim()) {
      setStatusMessage('Error: Please enter a file name');
      return;
    }

    const newPath = `${dialogPath}/${dialogFileName}`;
    const success = writeFile(newPath, content);
    if (success) {
      setFilePath(newPath);
      setIsModified(false);
      setShowSaveDialog(false);
      setStatusMessage(`Saved to ${newPath}`);
    } else {
      setStatusMessage('Error: Could not save file');
    }
  }, [dialogPath, dialogFileName, content, writeFile]);

  const handleOpenDialogConfirm = useCallback(() => {
    if (!dialogFileName.trim()) {
      setStatusMessage('Error: Please select a file');
      return;
    }

    const openPath = `${dialogPath}/${dialogFileName}`;
    const fileContent = readFile(openPath);
    if (fileContent !== null) {
      setContent(fileContent);
      setFilePath(openPath);
      setIsModified(false);
      setShowOpenDialog(false);
      setStatusMessage(`Opened ${openPath}`);
    } else {
      setStatusMessage('Error: Could not open file');
    }
  }, [dialogPath, dialogFileName, readFile]);

  const handleSelectAll = useCallback(() => {
    textareaRef.current?.select();
  }, []);

  const dialogItems = getChildren(dialogPath);
  const textFiles = dialogItems.filter(
    (item) => item.type === 'file' && /\.(txt|bat|sys)$/i.test(item.name),
  );
  const folders = dialogItems.filter((item) => item.type === 'folder');

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="bg-win-gray flex border-b border-gray-400">
        <div className="group relative">
          <button className="px-2 py-0.5 text-xs hover:bg-blue-800 hover:text-white">
            File
          </button>
          <div className="border-outset bg-win-gray absolute top-full left-0 z-50 hidden min-w-32 border shadow-md group-hover:block">
            <button
              className="block w-full px-4 py-1 text-left text-xs hover:bg-blue-800 hover:text-white"
              onClick={handleNew}
            >
              New
            </button>
            <button
              className="block w-full px-4 py-1 text-left text-xs hover:bg-blue-800 hover:text-white"
              onClick={handleOpen}
            >
              Open...
            </button>
            <button
              className="block w-full px-4 py-1 text-left text-xs hover:bg-blue-800 hover:text-white"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              className="block w-full px-4 py-1 text-left text-xs hover:bg-blue-800 hover:text-white"
              onClick={handleSaveAs}
            >
              Save As...
            </button>
          </div>
        </div>
        <div className="group relative">
          <button className="px-2 py-0.5 text-xs hover:bg-blue-800 hover:text-white">
            Edit
          </button>
          <div className="border-outset bg-win-gray absolute top-full left-0 z-50 hidden min-w-32 border shadow-md group-hover:block">
            <button
              className="block w-full px-4 py-1 text-left text-xs hover:bg-blue-800 hover:text-white"
              onClick={handleSelectAll}
            >
              Select All
            </button>
          </div>
        </div>
      </div>

      <textarea
        ref={textareaRef}
        className="flex-1 resize-none border-none p-2 font-mono text-xs outline-none"
        value={content}
        onChange={handleContentChange}
        placeholder="Start typing..."
        spellCheck={false}
      />

      <div className="border-inset bg-win-gray flex h-5 items-center justify-between border-t px-2 text-xs">
        <span className="max-w-[70%] truncate">
          {statusMessage || filePath || 'Untitled'}
          {isModified ? ' *' : ''}
        </span>
        <span className="shrink-0">Ln 1, Col 1</span>
      </div>

      {showSaveDialog && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/30">
          <div className="border-outset bg-win-gray w-80 border-2 shadow-lg">
            <div className="title-bar-gradient px-2 py-1 text-xs font-bold text-white">
              Save As
            </div>
            <div className="p-3">
              <div className="mb-1 text-xs">Save in:</div>
              <select
                className="border-inset mb-3 w-full border bg-white p-0.5 text-xs outline-none"
                value={dialogPath}
                onChange={(e) => setDialogPath(e.target.value)}
              >
                <option value="C:">Local Disk (C:)</option>
                <option value="C:/My Documents">My Documents</option>
                <option value="C:/Windows">Windows</option>
              </select>
              <div className="border-inset mb-3 h-24 overflow-auto border bg-white">
                {folders.map((folder) => (
                  <div
                    key={folder.id}
                    className="hover:bg-win-blue cursor-pointer px-2 py-0.5 text-xs hover:text-white"
                    onDoubleClick={() => setDialogPath(folder.id)}
                  >
                    📁 {folder.name}
                  </div>
                ))}
              </div>
              <div className="mb-1 text-xs">File name:</div>
              <input
                className="border-inset mb-3 w-full border bg-white p-1 text-xs outline-none"
                value={dialogFileName}
                onChange={(e) => setDialogFileName(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button
                  className="border-outset bg-win-gray active:border-inset w-16 border text-xs"
                  onClick={handleSaveDialogConfirm}
                >
                  Save
                </button>
                <button
                  className="border-outset bg-win-gray active:border-inset w-16 border text-xs"
                  onClick={() => setShowSaveDialog(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showOpenDialog && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/30">
          <div className="border-outset bg-win-gray w-80 border-2 shadow-lg">
            <div className="title-bar-gradient px-2 py-1 text-xs font-bold text-white">
              Open
            </div>
            <div className="p-3">
              <div className="mb-1 text-xs">Look in:</div>
              <select
                className="border-inset mb-3 w-full border bg-white p-0.5 text-xs outline-none"
                value={dialogPath}
                onChange={(e) => {
                  setDialogPath(e.target.value);
                  setDialogFileName('');
                }}
              >
                <option value="C:">Local Disk (C:)</option>
                <option value="C:/My Documents">My Documents</option>
              </select>
              <div className="border-inset mb-3 h-32 overflow-auto border bg-white">
                {folders.map((f) => (
                  <div
                    key={f.id}
                    className="hover:bg-win-blue cursor-pointer px-2 py-0.5 text-xs hover:text-white"
                    onDoubleClick={() => setDialogPath(f.id)}
                  >
                    📁 {f.name}
                  </div>
                ))}
                {textFiles.map((f) => (
                  <div
                    key={f.id}
                    className={`cursor-pointer px-2 py-0.5 text-xs ${dialogFileName === f.name ? 'bg-win-blue text-white' : 'hover:bg-blue-100'}`}
                    onClick={() => setDialogFileName(f.name)}
                    onDoubleClick={handleOpenDialogConfirm}
                  >
                    📄 {f.name}
                  </div>
                ))}
              </div>
              <div className="mb-1 text-xs">File name:</div>
              <input
                className="border-inset mb-3 w-full border bg-white p-1 text-xs outline-none"
                value={dialogFileName}
                onChange={(e) => setDialogFileName(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button
                  className="border-outset bg-win-gray active:border-inset w-16 border text-xs"
                  onClick={handleOpenDialogConfirm}
                >
                  Open
                </button>
                <button
                  className="border-outset bg-win-gray active:border-inset w-16 border text-xs"
                  onClick={() => setShowOpenDialog(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
