import { Signal, signal } from '@preact/signals-react';

export const currentTab: Signal<string> = signal<string>("Hackaton");