
import React, { useState, useMemo } from 'react';
import { User, SavedPrompt } from '../types';
import { db } from '../services/db';
// Added missing Sparkles icon to the imports
import { Search, Trash2, Copy, Eye, ExternalLink, Calendar, Sparkles } from 'lucide-react';

const History: React.FC<{ user: User }> = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState<SavedPrompt | null>(null);
  
  const prompts = useMemo(() => db.getUserPrompts(user.id), [user.id, selectedPrompt]);
  
  const filteredPrompts = prompts.filter(p => 
    p.originalPrompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.improvedPrompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this prompt?')) {
      db.deletePrompt(id);
      if (selectedPrompt?.id === id) setSelectedPrompt(null);
    }
  };

  const handleCopy = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">Prompt History</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">Manage and reuse your optimized prompts.</p>
        </div>
        
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" />
          <input 
            type="text"
            placeholder="Search prompts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-80 shadow-sm transition-all"
          />
        </div>
      </header>

      {prompts.length === 0 ? (
        <div className="p-20 text-center bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <Calendar className="w-16 h-16 text-zinc-200 dark:text-zinc-800 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white">No history yet</h3>
          <p className="text-zinc-500 mt-2">Start improving prompts to see them listed here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-4 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin">
            {filteredPrompts.map((p) => (
              <div 
                key={p.id}
                onClick={() => setSelectedPrompt(p)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer group relative ${
                  selectedPrompt?.id === p.id 
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20' 
                  : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-indigo-500'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                    selectedPrompt?.id === p.id ? 'bg-white/20' : 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400'
                  }`}>
                    {p.category}
                  </span>
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => handleDelete(p.id, e)}
                      className={`p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity ${
                         selectedPrompt?.id === p.id ? 'hover:bg-red-400' : 'hover:bg-red-100 dark:hover:bg-red-900/40 text-red-500'
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className={`text-sm font-medium line-clamp-2 ${selectedPrompt?.id === p.id ? 'text-white' : 'text-zinc-900 dark:text-white'}`}>
                  {p.originalPrompt}
                </p>
                <p className={`text-[10px] mt-2 ${selectedPrompt?.id === p.id ? 'text-indigo-100' : 'text-zinc-500'}`}>
                  {new Date(p.timestamp).toLocaleDateString()}
                </p>
              </div>
            ))}
            {filteredPrompts.length === 0 && (
               <p className="text-center text-zinc-500 py-10">No matches found.</p>
            )}
          </div>

          <div className="lg:col-span-2">
            {selectedPrompt ? (
              <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden sticky top-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/20">
                  <div>
                    <h3 className="font-bold text-zinc-900 dark:text-white">Prompt Details</h3>
                    <p className="text-xs text-zinc-500 mt-1">ID: {selectedPrompt.id}</p>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={(e) => handleCopy(selectedPrompt.improvedPrompt, e)}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-all"
                    >
                      <Copy className="w-4 h-4" />
                      Copy Prompt
                    </button>
                  </div>
                </div>
                
                <div className="p-8 space-y-8">
                  <section>
                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Eye className="w-4 h-4" /> Original Prompt
                    </h4>
                    <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-600 dark:text-zinc-400 italic">
                      {selectedPrompt.originalPrompt}
                    </div>
                  </section>

                  <section>
                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-500" /> Improved Version
                    </h4>
                    <div className="p-6 rounded-2xl bg-indigo-50/30 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 text-zinc-900 dark:text-zinc-100 leading-relaxed whitespace-pre-wrap font-mono">
                      {selectedPrompt.improvedPrompt}
                    </div>
                  </section>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                     {[
                       { label: 'Platform', val: selectedPrompt.platform },
                       { label: 'Tone', val: selectedPrompt.tone },
                       { label: 'Length', val: selectedPrompt.length },
                       { label: 'Category', val: selectedPrompt.category }
                     ].map((it, i) => (
                       <div key={i} className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 text-center">
                         <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">{it.label}</p>
                         <p className="text-xs font-bold text-zinc-900 dark:text-white">{it.val}</p>
                       </div>
                     ))}
                  </div>

                  <section>
                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">AI Reasoning</h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 bg-amber-50 dark:bg-amber-950/20 p-4 rounded-xl border border-amber-100 dark:border-amber-900/30">
                      {selectedPrompt.explanation}
                    </p>
                  </section>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-zinc-100/50 dark:bg-zinc-900/50 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl opacity-60">
                <ExternalLink className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mb-4" />
                <h4 className="font-bold text-zinc-400 dark:text-zinc-500">Select a prompt</h4>
                <p className="text-xs text-zinc-400 max-w-xs mt-2">Click on a prompt from the list to view its full details and optimized version.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
