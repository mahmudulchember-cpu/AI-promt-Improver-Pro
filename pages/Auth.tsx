
import React, { useState } from 'react';
import { User } from '../types';
import { db } from '../services/db';
import { Sparkles, Mail, Lock, User as UserIcon, Eye, EyeOff, Loader2, UserCircle } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
  isDark: boolean;
}

const Auth: React.FC<AuthProps> = ({ onLogin, isDark }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userIdInput, setUserIdInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      try {
        const users = db.getUsers();

        if (isSignup) {
          if (password !== confirmPassword) throw new Error("Passwords do not match.");
          if (users.find(u => u.email === email)) throw new Error("Email already registered.");
          
          const newUser: User = {
            id: 'PROMPT-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
            email,
            passwordHash: btoa(password), // simple mock hash
            joinDate: new Date().toISOString(),
            totalPrompts: 0
          };
          db.saveUser(newUser);
          onLogin(newUser);
        } else {
          // Login via Email or UserID
          const foundUser = users.find(u => 
            (u.email === email || u.id === userIdInput) && 
            u.passwordHash === btoa(password)
          );
          if (!foundUser) throw new Error("Invalid credentials.");
          onLogin(foundUser);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 800);
  };

  const handleGuestLogin = () => {
    setLoading(true);
    setTimeout(() => {
      const guestUser: User = {
        id: 'GUEST',
        email: 'guest@aipro.local',
        passwordHash: '',
        joinDate: new Date().toISOString(),
        totalPrompts: 0
      };
      onLogin(guestUser);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-zinc-950 transition-colors duration-300">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 shadow-xl shadow-indigo-600/20 mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight">AI Improver <span className="text-indigo-600">Pro</span></h1>
          <p className="text-zinc-500 dark:text-zinc-400">Transform your AI instructions today.</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-8 rounded-[32px] border border-zinc-200 dark:border-zinc-800 shadow-2xl shadow-zinc-200/50 dark:shadow-none">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 text-xs font-bold text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
                {error}
              </div>
            )}

            {!isSignup ? (
               <div className="space-y-4">
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Email or User ID" 
                      className="w-full pl-12 pr-4 py-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white"
                      value={email || userIdInput}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setUserIdInput(e.target.value);
                      }}
                      required
                    />
                  </div>
               </div>
            ) : (
               <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input 
                    type="email" 
                    placeholder="Gmail Address" 
                    className="w-full pl-12 pr-4 py-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
               </div>
            )}

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Password" 
                className="w-full pl-12 pr-12 py-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {isSignup && (
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="Confirm Password" 
                  className="w-full pl-12 pr-4 py-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="space-y-3 pt-2">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (isSignup ? 'Create Account' : 'Sign In')}
              </button>

              {!isSignup && (
                <button 
                  type="button" 
                  onClick={handleGuestLogin}
                  disabled={loading}
                  className="w-full py-4 px-6 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 border border-zinc-200 dark:border-zinc-700"
                >
                  <UserCircle className="w-5 h-5" />
                  Continue as Guest
                </button>
              )}
            </div>
          </form>

          <div className="mt-8 pt-8 border-t border-zinc-100 dark:border-zinc-800 text-center">
            <button 
              onClick={() => { setIsSignup(!isSignup); setError(''); }}
              className="text-sm font-semibold text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
            </button>
          </div>
        </div>

        <p className="text-center text-[10px] text-zinc-500 dark:text-zinc-600 font-medium">
          Protected by industry standard encryption. By continuing, you agree to our Terms of Service.
        </p>
      </div>
    </div>
  );
};

export default Auth;
