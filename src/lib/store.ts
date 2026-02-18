"use client";

import { create } from "zustand";
import { CanvasComponent, ComponentType, ComponentProps } from "./types";
import { getComponentSchema } from "./componentRegistry";
import * as pagesStoreModule from "./pagesStore";

export interface BuilderStore {
  componentsByPage: {
    [pageId: number]: {
      id: number;
      name: string;
      components: CanvasComponent[];
    };
  };
  selectedComponentId: string | null;
  undoStack: { [pageId: number]: CanvasComponent[][] };
  redoStack: { [pageId: number]: CanvasComponent[][] };

  addComponent: (type: ComponentType, pageId: number) => void;
  removeComponent: (id: string, pageId: number) => void;
  selectComponent: (id: string | null) => void;
  updateComponentProps: (
    id: string,
    props: Partial<ComponentProps>,
    pageId: number,
  ) => void;
  reorderComponents: (
    fromIndex: number,
    toIndex: number,
    pageId: number,
  ) => void;
  duplicateComponent: (id: string, pageId: number) => void;

  exportJSON: (pageId: number) => string;
  importJSON: (json: string, pageId: number) => void;

  exportProjectJSON: (projectName: string) => string;
  importProjectJSON: (json: string) => void;

  undo: (pageId: number) => void;
  redo: (pageId: number) => void;

  selectedView: string;
  setSelectedView: (view: string) => void;

  sideDrawerOpen: boolean;
  setSideDrawerOpen: (open: boolean) => void;

  selectedTab: number;
  selectedTabLabel: string;
  setSelectedTab: (idx: number, label?: string) => void;

  deployStatus: string;
  setDeployStatus: (status: string) => void;
}

// Simple ID generator
const generateId = () => Math.random().toString(36).substr(2, 9);

export const useBuilderStore = create<BuilderStore>((set, get) => ({
  componentsByPage: {},
  selectedComponentId: null,
  undoStack: {},
  redoStack: {},

  selectedView: "Lap View",
  setSelectedView: (view) => set({ selectedView: view }),

  sideDrawerOpen: true,
  setSideDrawerOpen: (open) => set({ sideDrawerOpen: open }),

  selectedTab: 0,
  selectedTabLabel: "Pages",

  deployStatus: "",
  setDeployStatus: (status) => set({ deployStatus: status }),

  setSelectedTab: (idx, label = "Pages") =>
    set({ selectedTab: idx, selectedTabLabel: label }),

  selectComponent: (id) => set({ selectedComponentId: id }),

  addComponent: (type, pageId) => {
    set((state) => {
      const schema = getComponentSchema(type);
      const newComponent: CanvasComponent = {
        id: generateId(),
        type,
        props: { ...schema.defaultProps },
      };

      // Try to get the page name from pagesStore if available
      let pageName = `Page ${pageId}`;
      try {
        // Dynamically import to avoid circular dependency
        import("./pagesStore")
          .then((pagesStore) => {
            if (pagesStore && pagesStore.usePagesStore) {
              const pages = pagesStore.usePagesStore.getState().pages;
              const found = pages.find(
                (p: { id: number; name: string }) => p.id === pageId,
              );
              if (found && found.name) pageName = found.name;
            }
          })
          .catch(() => {
            // fallback to default name
          });
      } catch (e) {
        // fallback to default name
        console.error("Failed to get page name from pagesStore", e);
      }
      const page = state.componentsByPage[pageId] ?? {
        id: pageId,
        name: pageName,
        components: [],
      };

      return {
        componentsByPage: {
          ...state.componentsByPage,
          [pageId]: {
            ...page,
            components: [...page.components, newComponent],
          },
        },
        selectedComponentId: newComponent.id,
        undoStack: {
          ...state.undoStack,
          [pageId]: [...(state.undoStack[pageId] || []), page.components],
        },
        redoStack: {
          ...state.redoStack,
          [pageId]: [],
        },
      };
    });
  },

  removeComponent: (id, pageId) => {
    set((state) => {
      const page = state.componentsByPage[pageId];
      if (!page) return state;

      return {
        componentsByPage: {
          ...state.componentsByPage,
          [pageId]: {
            ...page,
            components: page.components.filter((c) => c.id !== id),
          },
        },
        selectedComponentId:
          state.selectedComponentId === id ? null : state.selectedComponentId,
        undoStack: {
          ...state.undoStack,
          [pageId]: [...(state.undoStack[pageId] || []), page.components],
        },
        redoStack: {
          ...state.redoStack,
          [pageId]: [],
        },
      };
    });
  },

  updateComponentProps: (id, props, pageId) => {
    set((state) => {
      const page = state.componentsByPage[pageId];
      if (!page) return state;

      return {
        componentsByPage: {
          ...state.componentsByPage,
          [pageId]: {
            ...page,
            components: page.components.map((c) =>
              c.id === id ? { ...c, props: { ...c.props, ...props } } : c,
            ),
          },
        },
        undoStack: {
          ...state.undoStack,
          [pageId]: [...(state.undoStack[pageId] || []), page.components],
        },
        redoStack: {
          ...state.redoStack,
          [pageId]: [],
        },
      };
    });
  },

  reorderComponents: (fromIndex, toIndex, pageId) => {
    set((state) => {
      const page = state.componentsByPage[pageId];
      if (!page) return state;

      const updated = [...page.components];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);

      return {
        componentsByPage: {
          ...state.componentsByPage,
          [pageId]: { ...page, components: updated },
        },
        undoStack: {
          ...state.undoStack,
          [pageId]: [...(state.undoStack[pageId] || []), page.components],
        },
        redoStack: {
          ...state.redoStack,
          [pageId]: [],
        },
      };
    });
  },

  duplicateComponent: (id, pageId) => {
    set((state) => {
      const page = state.componentsByPage[pageId];
      if (!page) return state;

      const comp = page.components.find((c) => c.id === id);
      if (!comp) return state;

      const cloned = { ...comp, id: generateId() };

      return {
        componentsByPage: {
          ...state.componentsByPage,
          [pageId]: {
            ...page,
            components: [...page.components, cloned],
          },
        },
        selectedComponentId: cloned.id,
        undoStack: {
          ...state.undoStack,
          [pageId]: [...(state.undoStack[pageId] || []), page.components],
        },
        redoStack: {
          ...state.redoStack,
          [pageId]: [],
        },
      };
    });
  },

  undo: (pageId) => {
    set((state) => {
      const undoStack = state.undoStack[pageId] || [];
      if (!undoStack.length) return state;

      const previous = undoStack[undoStack.length - 1];
      const page = state.componentsByPage[pageId];

      return {
        componentsByPage: {
          ...state.componentsByPage,
          [pageId]: { ...page, components: previous },
        },
        undoStack: {
          ...state.undoStack,
          [pageId]: undoStack.slice(0, -1),
        },
        redoStack: {
          ...state.redoStack,
          [pageId]: [...(state.redoStack[pageId] || []), page.components],
        },
      };
    });
  },

  redo: (pageId) => {
    set((state) => {
      const redoStack = state.redoStack[pageId] || [];
      if (!redoStack.length) return state;

      const next = redoStack[redoStack.length - 1];
      const page = state.componentsByPage[pageId];

      return {
        componentsByPage: {
          ...state.componentsByPage,
          [pageId]: { ...page, components: next },
        },
        undoStack: {
          ...state.undoStack,
          [pageId]: [...(state.undoStack[pageId] || []), page.components],
        },
        redoStack: {
          ...state.redoStack,
          [pageId]: redoStack.slice(0, -1),
        },
      };
    });
  },

  exportJSON: (pageId) =>
    JSON.stringify(get().componentsByPage[pageId], null, 2),

  importJSON: (json, pageId) => {
    try {
      const pageObj = JSON.parse(json);
      set((state) => ({
        componentsByPage: {
          ...state.componentsByPage,
          [pageId]: pageObj,
        },
        selectedComponentId: null,
      }));
    } catch (e) {
      console.error("Failed to import page JSON", e);
    }
  },

  exportProjectJSON: (projectName) => {
    const componentsByPage = get().componentsByPage;
    let pagesStorePages: { id: number; name: string }[] = [];
    try {
      // Dynamically import to avoid circular dependency
      // const pagesStoreModule = require("./pagesStore");
      if (pagesStoreModule && pagesStoreModule.usePagesStore) {
        pagesStorePages = pagesStoreModule.usePagesStore.getState().pages;
      }
    } catch {}

    const pages = Object.values(componentsByPage).map((page) => {
      // Try to get the latest name from pagesStore
      const found = pagesStorePages.find((p) => p.id === page.id);
      return {
        ...page,
        name: found && found.name ? found.name : page.name,
      };
    });
    return JSON.stringify({ projectName, pages }, null, 2);
  },

  importProjectJSON: (json) => {
    try {
      const project = JSON.parse(json);
      if (!Array.isArray(project.pages)) return;

      const componentsByPage: BuilderStore["componentsByPage"] = {};
      const pagesForStore: { id: number; name: string }[] = [];
      let maxPageId = 0;
      project.pages.forEach((page: any) => {
        componentsByPage[page.id] = {
          id: page.id,
          name: page.name,
          components: page.components || [],
        };
        pagesForStore.push({ id: page.id, name: page.name });
        if (typeof page.id === "number" && page.id > maxPageId) {
          maxPageId = page.id;
        }
      });

      set({
        componentsByPage,
        selectedComponentId: null,
        undoStack: {},
        redoStack: {},
      });

      // Update pages in usePagesStore and set nextPageId
      try {
        import("./pagesStore")
          .then(({ usePagesStore, setNextPageId }) => {
            if (usePagesStore) {
              usePagesStore.setState({
                pages: pagesForStore,
                activePageId:
                  pagesForStore.length > 0 ? pagesForStore[0].id : 0,
              });
            }
            if (typeof setNextPageId === "function") {
              setNextPageId(maxPageId + 1);
            }
          })
          .catch((e) => {
            console.error(
              "Failed to update pagesStore from importProjectJSON",
              e,
            );
          });
      } catch (e) {
        console.error("Failed to update pagesStore from importProjectJSON", e);
      }
    } catch (e) {
      console.error("Failed to import project JSON", e);
    }
  },
}));
