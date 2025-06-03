import { signal } from '@preact/signals-react';
import type { ReactNode } from 'react';


export const currentModel = signal("")


export const userInput  = signal('');
export const response   = signal('');
export const loading    = signal(false);


export const promptLeft = signal(100);

export const modelMessages = signal<Record<string, ReactNode[]>>({
    mistral: [],
    gemini: [],
    deepseek: [],
});


export const totalsByModelByUser     = signal<Record<string, number>>({});
export const geminiSpentTokens = signal(0); // Alias pratique pour Gemini
