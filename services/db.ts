
import { User, SavedPrompt } from '../types';

const USERS_KEY = 'ai_prompt_improver_users';
const PROMPTS_KEY = 'ai_prompt_improver_prompts';

export const db = {
  getUsers: (): User[] => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  },
  
  saveUser: (user: User) => {
    if (user.id === 'GUEST') return;
    const users = db.getUsers();
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  updateUser: (updatedUser: User) => {
    if (updatedUser.id === 'GUEST') return;
    const users = db.getUsers().map(u => u.id === updatedUser.id ? updatedUser : u);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  getPrompts: (): SavedPrompt[] => {
    const data = localStorage.getItem(PROMPTS_KEY);
    return data ? JSON.parse(data) : [];
  },

  getUserPrompts: (userId: string): SavedPrompt[] => {
    if (userId === 'GUEST') return [];
    return db.getPrompts().filter(p => p.userId === userId);
  },

  savePrompt: (prompt: SavedPrompt) => {
    if (prompt.userId === 'GUEST') return; // Guest data will not be store
    
    const prompts = db.getPrompts();
    prompts.unshift(prompt);
    localStorage.setItem(PROMPTS_KEY, JSON.stringify(prompts));
    
    // Update user prompt count
    const users = db.getUsers();
    const user = users.find(u => u.id === prompt.userId);
    if (user) {
      user.totalPrompts += 1;
      db.updateUser(user);
    }
  },

  deletePrompt: (promptId: string) => {
    const prompts = db.getPrompts().filter(p => p.id !== promptId);
    localStorage.setItem(PROMPTS_KEY, JSON.stringify(prompts));
  }
};
