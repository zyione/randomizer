'use client';

import React, { useState } from 'react';
import { ItemList } from '@/types/randomizer';
import { exportListAsCsv, exportListAsJson, exportListAsTxt } from '@/lib/importers';
import {
  X,
  Plus,
  Search,
  Download,
  Copy,
  Edit2,
  Trash2,
  Check,
  Globe,
  Sparkles,
  FileText,
} from 'lucide-react';

interface ListManagerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lists: ItemList[];
  activeListId: string;
  onSelectList: (id: string) => void;
  onCreateNew: () => void;
  onEditList: (list: ItemList) => void;
  onDeleteList: (id: string) => void;
  onCloneList: (list: ItemList) => void;
  onOpenApiModal: () => void;
}

export const ListManagerDrawer: React.FC<ListManagerDrawerProps> = ({
  isOpen,
  onClose,
  lists,
  activeListId,
  onSelectList,
  onCreateNew,
  onEditList,
  onDeleteList,
  onCloneList,
  onOpenApiModal,
}) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'custom' | 'presets'>('all');

  if (!isOpen) return null;

  const filteredLists = lists.filter((l) => {
    const matchesSearch =
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      (l.description && l.description.toLowerCase().includes(search.toLowerCase()));
    if (!matchesSearch) return false;

    if (filterType === 'custom') return !l.isPreset;
    if (filterType === 'presets') return !!l.isPreset;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Your Lists</h3>
                <p className="text-[11px] text-slate-400">
                  {lists.length} total list{lists.length !== 1 ? 's' : ''} available
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Action Bar */}
          <div className="p-4 border-b border-slate-800 space-y-3">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onClose();
                  onCreateNew();
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 py-2.5 px-3 text-xs font-bold text-slate-950 shadow-md hover:opacity-90 transition-opacity"
              >
                <Plus className="h-4 w-4" />
                <span>Create Custom List</span>
              </button>
              <button
                onClick={() => {
                  onClose();
                  onOpenApiModal();
                }}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-purple-500/30 bg-purple-950/30 py-2.5 px-3 text-xs font-semibold text-purple-300 hover:bg-purple-900/40 transition-colors"
              >
                <Globe className="h-4 w-4" />
                <span>API Hub</span>
              </button>
            </div>

            {/* Search & Tabs */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search lists..."
                className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex gap-1.5 pt-1">
              {(['all', 'custom', 'presets'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold capitalize transition-colors ${
                    filterType === type
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* List Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
            {filteredLists.length === 0 ? (
              <div className="text-center py-12 text-xs text-slate-500">
                No lists found matching your search.
              </div>
            ) : (
              filteredLists.map((item) => {
                const isActive = item.id === activeListId;
                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl border p-3.5 transition-all ${
                      isActive
                        ? 'border-cyan-400 bg-cyan-950/20 shadow-[0_0_15px_rgba(0,242,254,0.15)]'
                        : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div
                        onClick={() => {
                          onSelectList(item.id);
                          onClose();
                        }}
                        className="flex-1 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: item.color || '#00f2fe' }}
                          />
                          <h4 className="text-sm font-bold text-white line-clamp-1">
                            {item.title}
                          </h4>
                          {isActive && (
                            <span className="flex items-center gap-1 rounded-full bg-cyan-500/20 px-2 py-0.5 text-[9px] font-mono text-cyan-300">
                              <Check className="h-2.5 w-2.5" /> ACTIVE
                            </span>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                        <div className="mt-2 text-[10px] font-mono text-slate-500">
                          {item.items.length} items {item.isPreset ? '· Preset' : '· Custom'}
                        </div>
                      </div>

                      {/* Dropdown / Action Buttons */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onCloneList(item)}
                          title="Duplicate list"
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            onClose();
                            onEditList(item);
                          }}
                          title="Edit list"
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        {!item.isPreset && (
                          <button
                            onClick={() => onDeleteList(item.id)}
                            title="Delete list"
                            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Export Strip */}
                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-mono">Export:</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => exportListAsCsv(item)}
                          className="hover:text-cyan-300 transition-colors"
                        >
                          CSV
                        </button>
                        <span>·</span>
                        <button
                          onClick={() => exportListAsTxt(item)}
                          className="hover:text-cyan-300 transition-colors"
                        >
                          TXT
                        </button>
                        <span>·</span>
                        <button
                          onClick={() => exportListAsJson(item)}
                          className="hover:text-cyan-300 transition-colors"
                        >
                          JSON
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
