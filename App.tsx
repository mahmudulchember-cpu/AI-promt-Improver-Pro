
import React, { useState, useEffect, useCallback } from 'react';
import { User } from './types';
import { db } from './services/db';
import Sidebar from './components/Sidebar';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import NewPrompt from './pages/NewPrompt';
import History from './pages/History';
import Profile from './pages/Profile';
import { LucideMenu, X, Sparkles, Heart, AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isDark, setIsDark] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Load user from session-like storage
  useEffect(() => {
    const savedUser = localStorage.getItem('current_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    // Only persist session if not a guest
    if (loggedInUser.id !== 'GUEST') {
      localStorage.setItem('current_user', JSON.stringify(loggedInUser));
    } else {
      // Clear any existing session if entering guest mode
      localStorage.removeItem('current_user');
    }
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('current_user');
    setCurrentPage('dashboard');
    setIsMobileMenuOpen(false);
  };

  const toggleTheme = useCallback(() => setIsDark(prev => !prev), []);

  if (!user) {
    return <Auth onLogin={handleLogin} isDark={isDark} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard user={user} setPage={setCurrentPage} />;
      case 'new': return <NewPrompt user={user} />;
      case 'history': return <History user={user} />;
      case 'profile': return <Profile user={user} />;
      default: return <Dashboard user={user} setPage={setCurrentPage} />;
    }
  };

  const navigate = (page: string) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col md:flex-row transition-colors duration-300">
      {/* Mobile Top Nav */}
      <div className="md:hidden sticky top-0 left-0 right-0 z-[60] glass-dark border-b border-zinc-800/50 p-4 flex justify-between items-center text-white">
        <div className="flex items-center gap-2">
           <div className="bg-indigo-600 p-1.5 rounded-lg">
             <Sparkles className="w-4 h-4 text-white" />
           </div>
           <h1 className="font-bold text-lg tracking-tight">AI Improver <span className="text-indigo-400">Pro</span></h1>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <LucideMenu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar for Desktop */}
      <Sidebar 
        currentPage={currentPage} 
        setPage={navigate} 
        onLogout={handleLogout} 
        isDark={isDark}
        toggleTheme={toggleTheme}
      />

      {/* Mobile Menu Overlay */}
      <div 
        className={`md:hidden fixed inset-0 z-50 bg-zinc-950/95 transition-all duration-300 flex flex-col justify-center items-center p-8 space-y-6 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="w-full max-w-xs space-y-4">
          {[
            { id: 'dashboard', label: 'Home' },
            { id: 'new', label: 'New Prompt' },
            { id: 'history', label: 'History' },
            { id: 'profile', label: 'Profile' },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => navigate(item.id)} 
              className={`w-full text-2xl font-bold py-4 rounded-2xl transition-all ${
                currentPage === item.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-8 border-t border-zinc-800 flex flex-col gap-4">
            <button 
              onClick={() => { toggleTheme(); setIsMobileMenuOpen(false); }} 
              className="w-full text-xl font-medium text-zinc-400 py-4"
            >
              {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
            <button 
              onClick={handleLogout} 
              className="w-full text-xl font-bold text-red-400 py-4 bg-red-500/10 rounded-2xl"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <main className="flex-1 md:ml-64 p-4 md:p-10 pt-6 md:pt-10 max-w-7xl mx-auto w-full min-h-[calc(100vh-64px)] md:min-h-screen flex flex-col">
        {user.id === 'GUEST' && (
          <div className="mb-6 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-3 text-amber-600 dark:text-amber-400 text-sm font-medium animate-in fade-in slide-in-from-top-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            Guest Mode: Your prompts will not be saved after refresh.
          </div>
        )}
        
        <div className="flex-grow">
          {renderPage()}
        </div>
        
        {/* Footer Credit */}
        <footer className="mt-16 py-8 border-t border-zinc-200 dark:border-zinc-800 text-center animate-in fade-in duration-1000">
          <p className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center justify-center gap-1.5">
            Designed and built with <Heart className="w-4 h-4 text-red-500 fill-current" /> by 
            <span className="font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              Mahmudul Hasan
            </span>
          </p>
          <p className="text-[10px] text-zinc-400 dark:text-zinc-600 mt-2 uppercase tracking-widest font-medium">
            © {new Date().getFullYear()} AI Prompt Improver Pro
          </p>
        </footer>
      </main>
    </div>
  );
};

export default App;
