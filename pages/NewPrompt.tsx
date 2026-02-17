
import React, { useState, useRef } from 'react';
import { Category, Tone, OutputLength, Platform, User, SavedPrompt } from '../types';
import { improvePromptWithAI } from '../services/gemini';
import { db } from '../services/db';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Loader2, 
  AlertCircle,
  BarChart2,
  Info,
  RefreshCcw,
  Zap,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

const NewPrompt: React.FC<{ user: User }> = ({ user }) => {
  const [prompt, setPrompt] = useState('');
  const [category, setCategory] = useState<Category>(Category.Coding);
  const [tone, setTone] = useState<Tone>(Tone.Professional);
  const [length, setLength] = useState<OutputLength>(OutputLength.Medium);
  const [platform, setPlatform] = useState<Platform>(Platform.ChatGPT);
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SavedPrompt | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleImprove = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt first.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await improvePromptWithAI(prompt, category, tone, platform, length);
      
      const newSavedPrompt: SavedPrompt = {
        id: Math.random().toString(36).substring(7).toUpperCase(),
        userId: user.id,
        originalPrompt: prompt,
        improvedPrompt: response.improvedPrompt,
        category,
        tone,
        platform,
        length,
        timestamp: new Date().toISOString(),
        scores: response.scores,
        explanation: response.explanation
      };

      db.savePrompt(newSavedPrompt);
      setResult(newSavedPrompt);
      
      if (window.innerWidth < 1280) {
        setTimeout(() => {
          document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } catch (err: any) {
      setError(err.message || 'Service Unavailable: The AI engine encountered an error.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleIterate = () => {
    if (result) {
      setPrompt(result.improvedPrompt);
      setResult(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      inputRef.current?.focus();
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.improvedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> AI Engine Connected
            </div>
          </div>
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-indigo-500 fill-indigo-500/10" />
            Prompt Optimizer
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base">Transform basic ideas into high-performance instructions.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Input Section */}
        <div className="xl:col-span-7 space-y-6">
          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/20 dark:shadow-none overflow-hidden transition-all duration-500">
            <div className="p-8 pb-4">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Your Basic Concept
                </label>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{prompt.length} chars</span>
              </div>
              <textarea 
                ref={inputRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what you want the AI to do..."
                className="w-full h-64 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 text-zinc-900 dark:text-white placeholder-zinc-400 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none text-base leading-relaxed"
              />
            </div>
            
            <div className="px-8 pb-8 pt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Category', val: category, set: setCategory, options: Category },
                { label: 'Platform', val: platform, set: setPlatform, options: Platform },
                { label: 'Tone', val: tone, set: setTone, options: Tone },
                { label: 'Length', val: length, set: setLength, options: OutputLength },
              ].map((field) => (
                <div key={field.label}>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">{field.label}</label>
                  <select 
                    value={field.val} 
                    onChange={(e) => field.set(e.target.value as any)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3 text-xs font-semibold outline-none text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
                  >
                    {Object.values(field.options).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              ))}
            </div>

            <div className="p-8 bg-zinc-50 dark:bg-zinc-800/20 border-t border-zinc-200 dark:border-zinc-800">
              <button 
                onClick={handleImprove}
                disabled={loading}
                className="group relative w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 px-8 rounded-3xl flex items-center justify-center gap-3 transition-all disabled:opacity-50 shadow-2xl shadow-indigo-600/30 active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Analyzing Data...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6" />
                    Optimize Prompt
                    <ChevronRight className="w-5 h-5 ml-1 opacity-50 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
              {error && (
                <div className="mt-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold flex items-center gap-3 animate-in slide-in-from-top-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Result Section */}
        <div id="result-section" className="xl:col-span-5 space-y-6">
          {result ? (
            <div className="animate-in fade-in slide-in-from-right-4 duration-700 space-y-6">
              <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">
                <div className="p-6 bg-indigo-600 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-white" />
                    <span className="text-xs font-black text-white uppercase tracking-[0.2em]">Optimized Output</span>
                  </div>
                  <button 
                    onClick={handleCopy}
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-md"
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
                <div className="p-8">
                  <div className="p-6 bg-zinc-50 dark:bg-zinc-950 rounded-3xl text-zinc-900 dark:text-zinc-100 text-sm leading-relaxed whitespace-pre-wrap font-mono border border-zinc-200 dark:border-zinc-800 max-h-[400px] overflow-y-auto">
                    {result.improvedPrompt}
                  </div>
                  
                  <button 
                    onClick={handleIterate}
                    className="w-full mt-6 flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-black text-sm hover:bg-indigo-100 transition-all border border-indigo-100 dark:border-indigo-900/30"
                  >
                    <RefreshCcw className="w-4 h-4" />
                    Adjust This Result
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-xl p-8 space-y-6">
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-indigo-500" />
                  <h3 className="font-black text-zinc-900 dark:text-white uppercase tracking-tight">Quality Metrics</h3>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Clarity', score: result.scores.clarity, color: 'text-emerald-500' },
                    { label: 'Detail', score: result.scores.detail, color: 'text-indigo-500' },
                    { label: 'Logic', score: result.scores.creativity, color: 'text-purple-500' }
                  ].map((s, i) => (
                    <div key={i} className="text-center p-4 rounded-3xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">{s.label}</p>
                      <p className={`text-2xl font-black ${s.color}`}>{s.score}<span className="text-xs text-zinc-400 opacity-50">/10</span></p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Info className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Optimization Strategy</span>
                  </div>
                  <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed italic">
                    {result.explanation}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center p-12 text-center bg-zinc-100/30 dark:bg-zinc-900/30 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[3rem] opacity-60">
              <Sparkles className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mb-6" />
              <h4 className="text-xl font-bold text-zinc-900 dark:text-white">AI Results</h4>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs mt-3 leading-relaxed">
                Enter your draft on the left. The optimized prompt and quality analysis will appear here instantly.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewPrompt;
