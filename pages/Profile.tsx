
import React from 'react';
import { User } from '../types';
import { Mail, Calendar, Hash, Zap, User as UserIcon, Shield, Database, ShieldCheck } from 'lucide-react';

const Profile: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <header className="text-center space-y-4">
        <div className="relative inline-block">
          <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] mx-auto flex items-center justify-center shadow-2xl shadow-indigo-600/30">
            <UserIcon className="w-12 h-12 text-white" />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-emerald-500 p-1.5 rounded-full border-4 border-zinc-50 dark:border-zinc-950 text-white">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">{user.email.split('@')[0]}</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 font-medium">{user.email}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Info Card */}
        <div className="p-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/20 dark:shadow-none space-y-6">
          <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-500" />
            Identity
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 transition-colors">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-zinc-400" />
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Email</span>
              </div>
              <span className="font-bold text-zinc-900 dark:text-white text-sm">{user.email}</span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 transition-colors">
              <div className="flex items-center gap-3">
                <Hash className="w-5 h-5 text-zinc-400" />
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">ID</span>
              </div>
              <span className="font-mono text-[10px] font-bold text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 px-2 py-1 rounded-md">{user.id}</span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 transition-colors">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-zinc-400" />
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Member Since</span>
              </div>
              <span className="font-bold text-zinc-900 dark:text-white text-sm">{new Date(user.joinDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Usage Stats Card */}
        <div className="p-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/20 dark:shadow-none space-y-6">
          <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-500" />
            Activity
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-indigo-500" />
                <span className="text-xs font-black text-indigo-900/60 dark:text-indigo-100/60 uppercase tracking-wider">Prompts Optimized</span>
              </div>
              <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{user.totalPrompts}</span>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900 dark:bg-indigo-950/20 border border-zinc-800">
              <p className="text-[10px] font-black text-zinc-500 dark:text-indigo-400/60 uppercase tracking-[0.2em] mb-3">Subscription tier</p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-black text-white">PRO ACCESS</span>
                <span className="px-2 py-1 bg-emerald-500 rounded-md text-[9px] font-black text-white uppercase tracking-widest">Active</span>
              </div>
              <p className="text-[10px] text-zinc-500 mt-4 leading-relaxed italic">Unlimited prompt generation and premium model access enabled.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 rounded-[2.5rem] bg-indigo-600 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-indigo-600/30">
        <div>
          <h4 className="text-2xl font-black tracking-tight">Enterprise Features</h4>
          <p className="text-indigo-100/70 text-sm mt-1">Unlock custom team workspaces and high-volume API pipelines.</p>
        </div>
        <button className="px-8 py-4 bg-white text-indigo-600 font-black rounded-2xl hover:scale-105 transition-all shadow-xl">
          Upgrade Plan
        </button>
      </div>
    </div>
  );
};

export default Profile;
