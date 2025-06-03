import { Signal, signal } from '@preact/signals-react';

export interface Filters {
    name: string;
    value: string
};

export const isOpenFilters: Signal<boolean> = signal<boolean>(false);
export const model: Signal<string> = signal<string>('...');
export const date: Signal<string> = signal<string>('...');
export const search: Signal<string> = signal<string>('...');

export const items: Signal<Array<{title: string, model: string, date: string}>> = signal<Array<{title: string, model: string, date: string}>>([
    {title: "Maison", model: 'MISTRAL', date: 'LUNDI'}, 
    {title: "Appartement", model: 'MISTRAL', date: 'MARDI'}, 
    {title: "Chaussure", model: 'GEMINI', date: 'LUNDI'}, 
    {title: "Fourchette", model: 'O3', date: 'MERCREDI'}
]);

export const filtersValues: Signal<{name: string[], value: Signal[]}> = signal({
    name: ['model', 'date'],
    filterValue: [model, date]
})

export const modelFilters: Signal<Filters[]> = signal<Filters[]>([
    {name: 'Mistral', value: 'MISTRAL'},
    {name: 'Gemini', value: 'GEMINI'},
    {name: '03', value: '03'},
    {name: '04', value: '04'},
    {name: 'Deepseek', value: 'DEEPSEEK'}
]);

export const dateFilters: Signal<Filters[]> = signal<Filters[]>([
    {name: 'Lundi', value: 'LUNDI'},
    {name: 'Mardi', value: 'MARDI'},
    {name: 'Mercredi', value: 'MERCREDI'},
    {name: 'Jeudi', value: 'JEUDI'},
    {name: 'Vendredi', value: 'VENDREDI'}
]);

// export const chatListFilter = signal({
//         filtersParams: filtersValues.value,
//         modelFilters: modelFilters.value,
//         dateFilters: dateFilters.value,
// })