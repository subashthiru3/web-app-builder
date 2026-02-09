"use client";

import { create } from "zustand";
import { CanvasComponent, ComponentType, ComponentProps } from "./types";
import { getComponentSchema } from "./componentRegistry";

interface BuilderStore {
  componentsByPage: {
    1: {
      id: number;
      name: string;
      components: CanvasComponent[];
    };
  };
  selectedComponentId: string | null;
  undoStack: { 1: CanvasComponent[][] };
  redoStack: { 1: CanvasComponent[][] };
  addComponent: (type: ComponentType) => void;
  removeComponent: (id: string) => void;
  selectComponent: (id: string | null) => void;
  updateComponentProps: (id: string, props: Partial<ComponentProps>) => void;
  reorderComponents: (fromIndex: number, toIndex: number) => void;
  duplicateComponent: (id: string) => void;
  exportJSON: () => string;
  importJSON: (json: string) => void;
  undo: () => void;
  redo: () => void;
  selectedView: string;
  setSelectedView: (view: string) => void;
  sideDrawerOpen: boolean;
  setSideDrawerOpen: (open: boolean) => void;
  selectedTab: number;
  selectedTabLabel: string;
  setSelectedTab: (idx: number, label?: string) => void;
}

// Simple UUID generation without external library
const generateId = () => Math.random().toString(36).substr(2, 9);

export const useBuilderStore = create<BuilderStore>((set, get) => ({
  componentsByPage: {
    1: {
      id: 1,
      name: "Default",
      components: [],
    },
  },
  selectedComponentId: null,
  undoStack: { 1: [] },
  redoStack: { 1: [] },
  selectedView: "Lap View",
  setSelectedView: (view: string) => set({ selectedView: view }),
  sideDrawerOpen: true,
  setSideDrawerOpen: (open: boolean) => set({ sideDrawerOpen: open }),
  selectedTab: 0,
  selectedTabLabel: "Pages",
  setSelectedTab: (idx: number, label?: string) =>
    set({ selectedTab: idx, selectedTabLabel: label }),

  selectComponent: (id: string | null) => {
    set({ selectedComponentId: id });
  },

  addComponent: (type: ComponentType) => {
    set((state) => {
      const schema = getComponentSchema(type);
      const newComponent: CanvasComponent = {
        id: generateId(),
        type,
        props: { ...schema.defaultProps },
      };
      const pageObj = state.componentsByPage[1];
      const updatedPage = {
        ...pageObj,
        components: [...pageObj.components, newComponent],
      };
      const prevUndo = state.undoStack[1] || [];
      return {
        componentsByPage: {
          ...state.componentsByPage,
          1: updatedPage,
        },
        selectedComponentId: newComponent.id,
        undoStack: {
          ...state.undoStack,
          1: [...prevUndo, pageObj.components],
        },
        redoStack: {
          ...state.redoStack,
          1: [],
        },
      };
    });
  },

  removeComponent: (id: string) => {
    set((state) => {
      const pageObj = state.componentsByPage[1];
      const updatedPage = {
        ...pageObj,
        components: pageObj.components.filter((c) => c.id !== id),
      };
      const prevUndo = state.undoStack[1] || [];
      return {
        componentsByPage: {
          ...state.componentsByPage,
          1: updatedPage,
        },
        selectedComponentId:
          state.selectedComponentId === id ? null : state.selectedComponentId,
        undoStack: {
          ...state.undoStack,
          1: [...prevUndo, pageObj.components],
        },
        redoStack: {
          ...state.redoStack,
          1: [],
        },
      };
    });
  },

  updateComponentProps: (id: string, props: Partial<ComponentProps>) => {
    set((state) => {
      const pageObj = state.componentsByPage[1];
      const updatedPage = {
        ...pageObj,
        components: pageObj.components.map((c) =>
          c.id === id ? { ...c, props: { ...c.props, ...props } } : c,
        ),
      };
      const prevUndo = state.undoStack[1] || [];
      return {
        componentsByPage: {
          ...state.componentsByPage,
          1: updatedPage,
        },
        undoStack: {
          ...state.undoStack,
          1: [...prevUndo, pageObj.components],
        },
        redoStack: {
          ...state.redoStack,
          1: [],
        },
      };
    });
  },

  reorderComponents: (fromIndex: number, toIndex: number) => {
    set((state) => {
      const pageObj = state.componentsByPage[1];
      const updatedComponents = [...pageObj.components];
      const [removed] = updatedComponents.splice(fromIndex, 1);
      updatedComponents.splice(toIndex, 0, removed);
      const updatedPage = {
        ...pageObj,
        components: updatedComponents,
      };
      const prevUndo = state.undoStack[1] || [];
      return {
        componentsByPage: {
          ...state.componentsByPage,
          1: updatedPage,
        },
        undoStack: {
          ...state.undoStack,
          1: [...prevUndo, pageObj.components],
        },
        redoStack: {
          ...state.redoStack,
          1: [],
        },
      };
    });
  },

  duplicateComponent: (id: string) => {
    set((state) => {
      const pageObj = state.componentsByPage[1];
      const component = pageObj.components.find((c) => c.id === id);
      if (!component) return state;
      const newComponent: CanvasComponent = {
        ...component,
        id: generateId(),
      };
      const updatedPage = {
        ...pageObj,
        components: [...pageObj.components, newComponent],
      };
      const prevUndo = state.undoStack[1] || [];
      return {
        componentsByPage: {
          ...state.componentsByPage,
          1: updatedPage,
        },
        selectedComponentId: newComponent.id,
        undoStack: {
          ...state.undoStack,
          1: [...prevUndo, pageObj.components],
        },
        redoStack: {
          ...state.redoStack,
          1: [],
        },
      };
    });
  },

  undo: () => {
    set((state) => {
      const pageUndoStack = state.undoStack[1] || [];
      if (pageUndoStack.length === 0) return state;
      const prevComponents = pageUndoStack[pageUndoStack.length - 1];
      const newUndoStack = pageUndoStack.slice(0, -1);
      const pageRedoStack = state.redoStack[1] || [];
      const currentPage = state.componentsByPage[1];
      return {
        componentsByPage: {
          ...state.componentsByPage,
          1: {
            ...currentPage,
            components: prevComponents,
          },
        },
        undoStack: {
          ...state.undoStack,
          1: newUndoStack,
        },
        redoStack: {
          ...state.redoStack,
          1: [...pageRedoStack, currentPage.components],
        },
      };
    });
  },

  redo: () => {
    set((state) => {
      const pageRedoStack = state.redoStack[1] || [];
      if (pageRedoStack.length === 0) return state;
      const nextComponents = pageRedoStack[pageRedoStack.length - 1];
      const newRedoStack = pageRedoStack.slice(0, -1);
      const pageUndoStack = state.undoStack[1] || [];
      const currentPage = state.componentsByPage[1];
      return {
        componentsByPage: {
          ...state.componentsByPage,
          1: {
            ...currentPage,
            components: nextComponents,
          },
        },
        undoStack: {
          ...state.undoStack,
          1: [...pageUndoStack, currentPage.components],
        },
        redoStack: {
          ...state.redoStack,
          1: newRedoStack,
        },
      };
    });
  },

  exportJSON: () => {
    const { componentsByPage } = get();
    // Export only the page object, not wrapped in "1"
    return JSON.stringify(componentsByPage[1], null, 2);
  },

  importJSON: (json: string) => {
    try {
      const pageObj = JSON.parse(json);
      // Wrap imported page object in componentsByPage structure
      set({
        componentsByPage: { 1: pageObj },
        selectedComponentId: null,
      });
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "wab_componentsByPage",
          JSON.stringify({ 1: pageObj }),
        );
      }
    } catch (error) {
      console.error("Failed to import JSON:", error);
    }
  },
}));
