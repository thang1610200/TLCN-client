import { create } from "zustand";

type ReviewQuizStore = {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

export const useReviewQuizStore = create<ReviewQuizStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));