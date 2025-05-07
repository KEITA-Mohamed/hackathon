import { Signal, signal } from '@preact/signals-react';

export const isOpenFilters: Signal<boolean> = signal<boolean>(false);
export const isOpenModel: Signal<boolean> = signal<boolean>(false);
export const isOpenDate: Signal<boolean> = signal<boolean>(false);
export const model: Signal<string> = signal<string>('...');
export const date: Signal<string> = signal<string>('...');
export const search: Signal<string> = signal<string>('...');
export const items: Signal<Array<{title: string, model: string, date: string}>> = signal<Array<{title: string, model: string, date: string}>>([{title: "Maison", model: 'MISTRAL', date: 'Lundi'}, {title: "Appartement", model: 'MISTRAL', date: 'Mardi'}, {title: "Chaussure", model: 'GEMINI', date: 'Lundi'}, {title: "Fourchette", model: 'O3', date: 'Mercredi'}]);
