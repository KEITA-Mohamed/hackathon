import { Signal, signal } from '@preact/signals-react';

export const modalTitle: Signal<string> = signal<string>('default');
export const isOpen: Signal<boolean> =  signal<boolean>(false);
export const confirm: Signal<boolean> = signal<boolean>(false);