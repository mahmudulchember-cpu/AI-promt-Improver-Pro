
import React, { useMemo } from 'react';
import { db } from '../services/db';
import { 
  Home,
  PlusCircle, 
  History, 
  User, 
  LogOut, 
  Sparkles,
  Zap,
  Activity
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  setPage: (page: string) => void;
  onLogout: () => void;
  isDark: boolean;
  toggleTheme: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setPage, onLogout, isDark, toggleTheme }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'new', label: 'New Prompt', icon: PlusCircle },
    { id: 'history', label: 'History', icon: History },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const savedUser = localStorage.getItem('current_user');
  const userId = savedUser ? JSON.parse(savedUser).id : 'GUEST';
  const recentItems = useMemo(() => db.getUserPrompts(userId).slice(0, 4), [userId, currentPage]);

  return (
    <aside className="fixed left-0 top-0 h-full w-64 glass-dark text-white border-r border-zinc-800 z-50 transition-all duration-300 hidden md:flex flex-col">
      <div className="p-8 flex items-center gap-3 border-b border-zinc-800/50">
        <div className="bg-indigo-600 p-2 rounded-xl shadow-xl shadow-indigo-600/30">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-black text-lg tracking-tight leading-none">AI PROMPT</h1>
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em]">IMPROVER PRO</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-hide pt-6">
        <div className="space-y-1.5">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300 group ${
                currentPage === item.id 
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' 
                : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
              }`}
            >
              <item.icon className={`w-5 h-5 transition-transform duration-500 ${currentPage === item.id ? '' : 'group-hover:scale-110'}`} />
              <span className="font-bold text-sm">{item.label}</span>
              {currentPage === item.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white]" />}
            </button>
          ))}
        </div>

        {recentItems.length > 0 && (
          <div className="mt-10 px-4">
            <div className="flex items-center gap-2 mb-5">
              <Activity className="w-3 h-3 text-zinc-500" />
              <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Recent Labs</h3>
            </div>
            <div className="space-y-4">
              {recentItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setPage('history')}
                  className="w-full text-left group flex items-start gap-3 transition-opacity hover:opacity-100 opacity-60"
                >
                  <div className="mt-1.5 w-1 h-1 rounded-full bg-indigo-500" />
                  <span className="text-[11px] font-medium text-zinc-400 group-hover:text-zinc-100 truncate">
                    {item.originalPrompt}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      <div className="p-6 border-t border-zinc-800/50 space-y-3">
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-zinc-900/50 border border-zinc-800">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
           <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">System Online</span>
        </div>
        
        <div className="flex flex-col gap-1">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-zinc-500 hover:text-white transition-all text-xs font-bold"
          >
            {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-zinc-500 hover:text-red-400 transition-all text-xs font-bold"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
