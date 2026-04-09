import { create } from "zustand";

export interface Page {
  id: number;
  name: string;
  description?: string;
}

export interface PagesStore {
  pages: Page[];
  activePageId: number;
  addPage: (name: string, description?: string) => void;
  setActivePage: (id: number) => void;
  updatePageName: (id: number, name: string) => void;
  deletePage: (id: number) => void;
}

export function setNextPageId(val: number) {
  nextPageId = val;
}

let nextPageId = 1;

// Helper to also update BuilderStore when a page is added

function addPageAndSyncBuilderStoreFactory(
  set: (fn: (state: PagesStore) => Partial<PagesStore> | PagesStore) => void,
) {
  return (name: string, description = "") => {
    set((state: PagesStore) => {
      const newPage = { id: nextPageId++, name, description };
      // Also add empty page to BuilderStore
      // Dynamically import to avoid circular dependency
      void import("./store")
        .then((storeModule) => {
          const builderStore = storeModule?.useBuilderStore;
          if (!builderStore) {
            return;
          }

          const builderState = builderStore.getState();
          if (builderState.componentsByPage[newPage.id]) {
            return;
          }

          builderStore.setState({
            componentsByPage: {
              ...builderState.componentsByPage,
              [newPage.id]: {
                id: newPage.id,
                name: newPage.name,
                components: [],
              },
            },
          });
        })
        .catch(() => {});
      return { pages: [...state.pages, newPage], activePageId: newPage.id };
    });
  };
}

export const usePagesStore = create<PagesStore>((set) => ({
  pages: [],
  activePageId: 0,
  addPage: addPageAndSyncBuilderStoreFactory(set),
  setActivePage: (id: number) => set({ activePageId: id }),
  updatePageName: (id: number, name: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    set((state: PagesStore) => ({
      pages: state.pages.map((page) =>
        page.id === id ? { ...page, name: trimmedName } : page,
      ),
    }));

    void import("./store")
      .then((storeModule) => {
        const builderStore = storeModule?.useBuilderStore;
        if (!builderStore) {
          return;
        }

        const builderState = builderStore.getState();
        const pageEntry = builderState.componentsByPage[id];
        if (!pageEntry) {
          return;
        }

        builderStore.setState({
          componentsByPage: {
            ...builderState.componentsByPage,
            [id]: {
              ...pageEntry,
              name: trimmedName,
            },
          },
        });
      })
      .catch(() => {});
  },
  deletePage: (id: number) => {
    set((state: PagesStore) => {
      if (!state.pages.length) {
        return state;
      }

      const remainingPages = state.pages.filter((page) => page.id !== id);
      const deletedIndex = state.pages.findIndex((page) => page.id === id);
      const isActiveDeleted = state.activePageId === id;
      let nextActivePageId = state.activePageId;

      if (isActiveDeleted) {
        if (remainingPages.length === 0) {
          nextActivePageId = 0;
        } else {
          const nextIndex = Math.min(
            deletedIndex >= 0 ? deletedIndex : 0,
            remainingPages.length - 1,
          );
          nextActivePageId = remainingPages[nextIndex].id;
        }
      }

      return { pages: remainingPages, activePageId: nextActivePageId };
    });

    void import("./store")
      .then((storeModule) => {
        const builderStore = storeModule?.useBuilderStore;
        if (!builderStore) {
          return;
        }

        const builderState = builderStore.getState();
        if (!builderState.componentsByPage[id]) {
          return;
        }

        const { [id]: removedPage, ...remainingPages } =
          builderState.componentsByPage;
        const remainingUndo = { ...builderState.undoStack };
        delete remainingUndo[id];
        const remainingRedo = { ...builderState.redoStack };
        delete remainingRedo[id];
        const selectedComponentId = builderState.selectedComponentId;
        const shouldClearSelection = removedPage?.components?.some(
          (component) => component.id === selectedComponentId,
        );

        builderStore.setState({
          componentsByPage: remainingPages,
          undoStack: remainingUndo,
          redoStack: remainingRedo,
          selectedComponentId: shouldClearSelection
            ? null
            : builderState.selectedComponentId,
        });
      })
      .catch(() => {});
  },
}));
