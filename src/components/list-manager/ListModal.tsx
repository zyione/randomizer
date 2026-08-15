'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ItemList, Item } from '@/types/randomizer';
import { parseCsvOrTxt, getRandomColor } from '@/lib/importers';
import { X, Upload, Plus, Trash2, Sparkles, FileText } from 'lucide-react';

interface ListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (list: ItemList) => void;
  initialList?: ItemList | null;
}

const COLOR_OPTIONS = [
  '#00f2fe',
  '#8b5cf6',
  '#ec4899',
  '#10b981',
  '#f59e0b',
  '#3b82f6',
  '#ef4444',
  '#14b8a6',
];

export const ListModal: React.FC<ListModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialList,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#00f2fe');
  const [items, setItems] = useState<Item[]>([]);
  const [rawBatchText, setRawBatchText] = useState('');
  const [activeTab, setActiveTab] = useState<'individual' | 'batch' | 'import'>('individual');
  const [newItemText, setNewItemText] = useState('');
  const [newItemSubtitle, setNewItemSubtitle] = useState('');
  const [removeDuplicates, setRemoveDuplicates] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialList) {
      setTitle(initialList.title);
      setDescription(initialList.description || '');
      setColor(initialList.color || '#00f2fe');
      setItems([...initialList.items]);
    } else {
      setTitle('');
      setDescription('');
      setColor(getRandomColor());
      setItems([]);
      setRawBatchText('');
      setNewItemText('');
      setNewItemSubtitle('');
    }
  }, [initialList, isOpen]);

  if (!isOpen) return null;

  const handleAddItem = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newItemText.trim()) return;

    const newItem: Item = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      text: newItemText.trim(),
      subtitle: newItemSubtitle.trim() || undefined,
      color: getRandomColor(items.length),
    };

    setItems((prev) => [...prev, newItem]);
    setNewItemText('');
    setNewItemSubtitle('');
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const handleApplyBatchText = () => {
    if (!rawBatchText.trim()) return;
    const parsed = parseCsvOrTxt(rawBatchText, { removeDuplicates });
    setItems((prev) => [...prev, ...parsed]);
    setRawBatchText('');
    setActiveTab('individual');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const parsed = parseCsvOrTxt(content, { removeDuplicates });
        setItems((prev) => [...prev, ...parsed]);
        // If title is empty, use file name
        if (!title.trim()) {
          const cleanName = file.name.replace(/\.[^/.]+$/, '');
          setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
        }
        setActiveTab('individual');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please provide a title for the list.');
      return;
    }
    if (items.length === 0) {
      alert('Please add at least 1 item to the list.');
      return;
    }

    const savedList: ItemList = {
      id: initialList?.id || `list-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: title.trim(),
      description: description.trim() || undefined,
      color,
      icon: initialList?.icon || 'List',
      items,
      isPreset: false,
      createdAt: initialList?.createdAt || Date.now(),
      updatedAt: Date.now(),
    };

    onSave(savedList);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-cyan-400" />
          <span>{initialList ? 'Edit List' : 'Create New List'}</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Add items manually, paste newline text, or drag & drop CSV / TXT files.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Title & Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">List Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Weekend Road Trip Ideas"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Theme Color</label>
              <div className="flex items-center gap-2 mt-1">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`h-7 w-7 rounded-full transition-transform ${
                      color === c ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-slate-900' : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Description (Optional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief context or instructions..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-400"
            />
          </div>

          {/* Item Mode Tabs */}
          <div className="border-t border-slate-800 pt-4">
            <div className="flex items-center gap-2 mb-4">
              <button
                type="button"
                onClick={() => setActiveTab('individual')}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  activeTab === 'individual'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Add One-by-One ({items.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('batch')}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  activeTab === 'batch'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Paste Bulk Text
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('import')}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  activeTab === 'import'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Import CSV / TXT File
              </button>
            </div>

            {/* Tab 1: One by One */}
            {activeTab === 'individual' && (
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddItem();
                      }
                    }}
                    placeholder="Item text (e.g. Visit Museum)"
                    className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-400"
                  />
                  <input
                    type="text"
                    value={newItemSubtitle}
                    onChange={(e) => setNewItemSubtitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddItem();
                      }
                    }}
                    placeholder="Subtitle (optional)"
                    className="w-full sm:w-44 rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-400"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddItem()}
                    className="inline-flex items-center justify-center gap-1 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add</span>
                  </button>
                </div>

                {/* Items List Pill Box */}
                <div className="max-h-48 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950/60 p-2.5 space-y-1.5">
                  {items.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-500">
                      No items yet. Type an item above or import a file.
                    </div>
                  ) : (
                    items.map((item, idx) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-2 rounded-lg bg-slate-900/80 px-3 py-1.5 border border-slate-800"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className="h-2 w-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: item.color || '#00f2fe' }}
                          />
                          <span className="text-xs font-medium text-slate-200 truncate">
                            {item.text}
                          </span>
                          {item.subtitle && (
                            <span className="text-[10px] text-slate-400 truncate">
                              ({item.subtitle})
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Tab 2: Bulk Text */}
            {activeTab === 'batch' && (
              <div className="space-y-3">
                <textarea
                  rows={5}
                  value={rawBatchText}
                  onChange={(e) => setRawBatchText(e.target.value)}
                  placeholder="Paste multiple items here...&#10;Option 1&#10;Option 2, Subtitle 2&#10;Option 3"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs font-mono text-white placeholder-slate-500 outline-none focus:border-cyan-400"
                />
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={removeDuplicates}
                      onChange={(e) => setRemoveDuplicates(e.target.checked)}
                      className="rounded border-slate-700 text-cyan-500 focus:ring-0"
                    />
                    <span>Auto-remove duplicate entries</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleApplyBatchText}
                    className="rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-colors"
                  >
                    Parse & Add Items
                  </button>
                </div>
              </div>
            )}

            {/* Tab 3: File Import */}
            {activeTab === 'import' && (
              <div className="space-y-3">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-700 hover:border-cyan-400 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-950/40"
                >
                  <Upload className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
                  <p className="text-xs font-medium text-slate-300">
                    Click to select CSV or TXT file from your device
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Supports newline-separated .txt or comma/tab-separated .csv
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
                <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={removeDuplicates}
                    onChange={(e) => setRemoveDuplicates(e.target.checked)}
                    className="rounded border-slate-700 text-cyan-500 focus:ring-0"
                  />
                  <span>Auto-remove duplicate entries during import</span>
                </label>
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-700 px-4 py-2.5 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 px-6 py-2.5 text-xs font-bold text-slate-950 shadow-[0_0_20px_rgba(0,242,254,0.3)] hover:opacity-90 transition-opacity"
            >
              Save List ({items.length} items)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
