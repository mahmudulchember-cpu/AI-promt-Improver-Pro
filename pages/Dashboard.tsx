
import React, { useMemo } from 'react';
import { User, SavedPrompt } from '../types';
import { db } from '../services/db';
import { Clock, Plus, Zap, TrendingUp, History as HistoryIcon, ArrowRight } from 'lucide-react';

interface DashboardProps {
  user: User;
  setPage: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, setPage }) => {
  const userPrompts = useMemo(() => db.getUserPrompts(user.id), [user.id]);
  const recentPrompts = userPrompts.slice(0, 5);

  const stats = [
    { label: 'Total Prompts', value: userPrompts.length, icon: Zap, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { label: 'Account Age', value: new Date(user.joinDate).toLocaleDateString(), icon: Clock, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Avg Quality Score', value: userPrompts.length > 0 ? (userPrompts.reduce((acc, p) => acc + (p.scores.clarity + p.scores.detail + p.scores.creativity) / 3, 0) / userPrompts.length).toFixed(1) + '/10' : 'N/A', icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <header className="space-y-1">
        <h2 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">
          Hey, {user.email.split('@')[0]}!
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400">Ready to craft some high-performance prompts?</p>
      </header>

      {/* 1. Quick Actions - Priority One */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Quick Start</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={() => setPage('new')}
            className="group relative overflow-hidden flex items-center gap-6 p-8 rounded-[2rem] bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20"
          >
            <div className="absolute right-0 top-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10 bg-white/20 p-4 rounded-2xl group-hover:scale-110 transition-transform">
              <Plus className="w-8 h-8" />
            </div>
            <div className="relative z-10 text-left">
              <p className="text-xl font-black tracking-tight">New Prompt</p>
              <p className="text-sm text-indigo-100 opacity-80">Optimize instructions instantly</p>
            </div>
            <ArrowRight className="ml-auto w-6 h-6 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </button>

          <button 
            onClick={() => setPage('history')}
            className="group relative overflow-hidden flex items-center gap-6 p-8 rounded-[2rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 transition-all shadow-sm"
          >
            <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-2xl group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 transition-colors">
              <HistoryIcon className="w-8 h-8 text-zinc-500 dark:text-zinc-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
            </div>
            <div className="text-left">
              <p className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">Full History</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Access saved optimizations</p>
            </div>
            <ArrowRight className="ml-auto w-6 h-6 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-indigo-500" />
          </button>
        </div>
      </section>

      {/* 2. Prompt Details (Stats) - Second Priority */}
      <section className="space-y-4">
         <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Performance Details</h3>
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-black text-zinc-900 dark:text-white mt-1">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Recent Activity - Final section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Recent Optimizations</h3>
          <button onClick={() => setPage('history')} className="text-indigo-600 dark:text-indigo-400 text-sm font-bold hover:underline">See full history</button>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] overflow-hidden">
          {recentPrompts.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-zinc-500 dark:text-zinc-400">Your optimization timeline is currently empty.</p>
              <button 
                onClick={() => setPage('new')}
                className="mt-4 text-indigo-600 font-bold hover:underline"
              >
                Create your first prompt
              </button>
            </div>
          ) : (
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {recentPrompts.map((p) => (
                <div key={p.id} className="p-5 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors cursor-pointer" onClick={() => setPage('history')}>
                  <div className="flex items-center gap-4 overflow-hidden">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center flex-shrink-0">
                       <Zap className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div className="truncate">
                      <p className="font-bold text-zinc-900 dark:text-white truncate">{p.originalPrompt}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-zinc-400 uppercase font-bold">{new Date(p.timestamp).toLocaleDateString()}</span>
                        <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                        <span className="text-[10px] text-indigo-500 font-bold uppercase">{p.platform}</span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-300 dark:text-zinc-700" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
