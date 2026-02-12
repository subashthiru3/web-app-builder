import { create } from "zustand";
import type { BuilderStore } from "./store";

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

// Helper to also update BuilderStore when a page is added

function addPageAndSyncBuilderStoreFactory(
  set: (fn: (state: PagesStore) => Partial<PagesStore> | PagesStore) => void,
) {
  return (name: string) => {
    set((state: PagesStore) => {
      const newPage = { id: nextPageId++, name };
      // Also add empty page to BuilderStore
      try {
        // Dynamically import to avoid circular dependency
        import("./store").then((storeModule) => {
          if (storeModule && storeModule.useBuilderStore) {
            storeModule.useBuilderStore.setState(
              (builderState: BuilderStore) => {
                // Only add if not already present
                if (!builderState.componentsByPage[newPage.id]) {
                  return {
                    componentsByPage: {
                      ...builderState.componentsByPage,
                      [newPage.id]: {
                        id: newPage.id,
                        name: newPage.name,
                        components: [],
                      },
                    },
                  };
                }
                return {};
              },
            );
          }
        });
      } catch {}
      return { pages: [...state.pages, newPage], activePageId: newPage.id };
    });
  };
}

export const usePagesStore = create<PagesStore>((set) => ({
  pages: [],
  activePageId: 0,
  addPage: addPageAndSyncBuilderStoreFactory(set),
  setActivePage: (id: number) => set({ activePageId: id }),
}));
