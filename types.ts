
export enum Category {
  Website = 'Website',
  AppDevelopment = 'App Development',
  ImageGeneration = 'Image Generation',
  VideoGeneration = 'Video Generation',
  BusinessIdea = 'Business Idea',
  Study = 'Study',
  Marketing = 'Marketing',
  Coding = 'Coding'
}

export enum Tone {
  Professional = 'Professional',
  Creative = 'Creative',
  Detailed = 'Detailed',
  Short = 'Short',
  Expert = 'Expert'
}

export enum OutputLength {
  Short = 'Short',
  Medium = 'Medium',
  Long = 'Long'
}

export enum Platform {
  ChatGPT = 'ChatGPT',
  Gemini = 'Gemini',
  Midjourney = 'Midjourney',
  Veo = 'Veo',
  GeneralAI = 'General AI'
}

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  joinDate: string;
  totalPrompts: number;
}

export interface SavedPrompt {
  id: string;
  userId: string;
  originalPrompt: string;
  improvedPrompt: string;
  category: Category;
  tone: Tone;
  platform: Platform;
  length: OutputLength;
  timestamp: string;
  scores: {
    clarity: number;
    detail: number;
    creativity: number;
  };
  explanation: string;
}

export interface ImprovedPromptResponse {
  improvedPrompt: string;
  scores: {
    clarity: number;
    detail: number;
    creativity: number;
  };
  explanation: string;
}
