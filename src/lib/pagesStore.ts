import { create } from "zustand";

export interface Page {
  id: number;
  name: string;
}

export interface PagesStore {
  pages: Page[];
  activePageId: number;
  addPage: (name: string) => void;
  setActivePage: (id: number) => void;
}

export function setNextPageId(val: number) {
  nextPageId = val;
}

let nextPageId = 1;

export const usePagesStore = create<PagesStore>((set) => ({
  pages: [],
  activePageId: 0,
  addPage: (name: string) =>
    set((state) => {
      const newPage = { id: nextPageId++, name };
      return { pages: [...state.pages, newPage], activePageId: newPage.id };
    }),
  setActivePage: (id: number) => set({ activePageId: id }),
}));
