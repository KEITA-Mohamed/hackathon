// signals/chatSignals.ts
import { signal } from '@preact/signals-react';
import {ReactNode} from "react";

export const currentModel = signal('mistral');
export const userInput = signal('');
export const response = signal('');
export const loading = signal(false);
export const promptLeft = signal(100);
export const messagesList = signal<ReactNode[]>([]);
