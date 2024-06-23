import { create } from "zustand";

interface ResponseProps {
    id?: string;
    name?: string;
    code?: string;
    explain?: string;
    lang?: string;
}

type SupportStore = {
    data: ResponseProps[];
    setData: (item: ResponseProps[]) => void;
};

export const useSupportStore = create<SupportStore>((set) => ({
    data: [],
    setData: (item) => set({ data: item }),
}));