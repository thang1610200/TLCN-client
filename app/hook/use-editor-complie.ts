import { create } from 'zustand';

interface ValueComplieStore {
    valueCode: string;
    editorCode: (value: string) => void;
};

export const useComplie = create<ValueComplieStore>((set) => ({
    valueCode: '',
    editorCode: (value) => set({ valueCode: value }),
}));