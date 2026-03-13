import { useState } from 'react';

interface FileEditorModalProps {
  isOpen: boolean;
  initialData?: {
    name: string;
    type: string;
    content: string;
  };
  onSave: (data: { name: string; type: string; content: string }) => void;
  onCancel: () => void;
  title: string;
}

export function FileEditorModal({
  isOpen,
  initialData,
  onSave,
  onCancel,
  title,
}: FileEditorModalProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [type, setType] = useState(initialData?.type || 'text');
  const [content, setContent] = useState(initialData?.content || '');

  if (!isOpen) return null;

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ name: name.trim(), type, content });
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50">
      <div className="border-outset bg-win-gray w-[500px] border-2">
        {/* Title bar */}
        <div className="bg-win-blue flex items-center justify-between px-2 py-1">
          <span className="text-sm font-bold text-white">{title}</span>
          <button
            className="border-outset bg-win-gray active:border-inset h-4 w-4 text-xs leading-none"
            onClick={onCancel}
          >
            X
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* File name */}
          <div className="mb-3">
            <label className="mb-1 block text-xs text-black">File Name:</label>
            <input
              type="text"
              className="border-inset w-full border-2 bg-white px-2 py-1 text-sm focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="diary.txt"
              autoFocus
            />
          </div>

          {/* File type */}
          <div className="mb-3">
            <label className="mb-1 block text-xs text-black">Type:</label>
            <select
              className="border-inset w-full border-2 bg-white px-2 py-1 text-sm focus:outline-none"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="text">Text Document</option>
              <option value="note">Note</option>
              <option value="link">Link/URL</option>
              <option value="image">Image URL</option>
            </select>
          </div>

          {/* Content */}
          <div className="mb-4">
            <label className="mb-1 block text-xs text-black">
              {type === 'link' || type === 'image' ? 'URL:' : 'Content:'}
            </label>
            {type === 'link' || type === 'image' ? (
              <input
                type="text"
                className="border-inset w-full border-2 bg-white px-2 py-1 text-sm focus:outline-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={type === 'image' ? 'https://example.com/image.jpg' : 'https://example.com'}
              />
            ) : (
              <textarea
                className="border-inset h-48 w-full resize-none border-2 bg-white px-2 py-1 font-mono text-sm focus:outline-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your thoughts here..."
              />
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <button
              className="border-outset bg-win-gray active:border-inset min-w-[75px] cursor-pointer border-2 px-4 py-1 text-sm hover:bg-[#d0d0d0]"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className="border-outset bg-win-gray active:border-inset min-w-[75px] cursor-pointer border-2 px-4 py-1 text-sm hover:bg-[#d0d0d0] disabled:opacity-50"
              onClick={handleSave}
              disabled={!name.trim()}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
