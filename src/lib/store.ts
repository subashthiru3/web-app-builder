'use client';

import { create } from 'zustand';
import { CanvasComponent, CanvasState, ComponentType, ComponentProps } from './types';
import { getComponentSchema } from './componentRegistry';

interface BuilderStore extends CanvasState {
  undoStack: Array<{ components: CanvasComponent[]; selectedComponentId: string | null }>;
  redoStack: Array<{ components: CanvasComponent[]; selectedComponentId: string | null }>;
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
}

// Simple UUID generation without external library
const generateId = () => Math.random().toString(36).substr(2, 9);

// Load initial state from localStorage if available
const getInitialComponents = () => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('wab_components');
      if (stored) return JSON.parse(stored);
    } catch {}
  }
  return [];
};

export const useBuilderStore = create<BuilderStore>((set, get) => ({
  components: getInitialComponents(),
  selectedComponentId: null,
  undoStack: [],
  redoStack: [],

  addComponent: (type: ComponentType) => {
    set((state) => {
      const schema = getComponentSchema(type);
      const newComponent: CanvasComponent = {
        id: generateId(),
        type,
        props: { ...schema.defaultProps },
      };
      const updated = {
        components: [...state.components, newComponent],
        selectedComponentId: newComponent.id,
        undoStack: [...(state.undoStack || []), { components: state.components, selectedComponentId: state.selectedComponentId }],
        redoStack: [],
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('wab_components', JSON.stringify(updated.components));
      }
      return updated;
    });
  },

  removeComponent: (id: string) => {
    set((state) => {
      const updated = {
        components: state.components.filter((c) => c.id !== id),
        selectedComponentId:
          state.selectedComponentId === id ? null : state.selectedComponentId,
        undoStack: [...(state.undoStack || []), { components: state.components, selectedComponentId: state.selectedComponentId }],
        redoStack: [],
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('wab_components', JSON.stringify(updated.components));
      }
      return updated;
    });
  },

  selectComponent: (id: string | null) => {
    set({ selectedComponentId: id });
  },

  updateComponentProps: (id: string, props: Partial<ComponentProps>) => {
    set((state) => {
      const updated = {
        components: state.components.map((c) =>
          c.id === id ? { ...c, props: { ...c.props, ...props } } : c
        ),
        undoStack: [...(state.undoStack || []), { components: state.components, selectedComponentId: state.selectedComponentId }],
        redoStack: [],
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('wab_components', JSON.stringify(updated.components));
      }
      return updated;
    });
  },

  reorderComponents: (fromIndex: number, toIndex: number) => {
    set((state) => {
      const newComponents = [...state.components];
      const [removed] = newComponents.splice(fromIndex, 1);
      newComponents.splice(toIndex, 0, removed);
      return {
        components: newComponents,
        undoStack: [...(state.undoStack || []), { components: state.components, selectedComponentId: state.selectedComponentId }],
        redoStack: [],
      };
    });
  },

  duplicateComponent: (id: string) => {
    set((state) => {
      const component = state.components.find((c) => c.id === id);
      if (!component) return state;
      const newComponent: CanvasComponent = {
        ...component,
        id: generateId(),
      };
      const updated = {
        components: [...state.components, newComponent],
        selectedComponentId: newComponent.id,
        undoStack: [...(state.undoStack || []), { components: state.components, selectedComponentId: state.selectedComponentId }],
        redoStack: [],
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('wab_components', JSON.stringify(updated.components));
      }
      return updated;
    });
  },
  undo: () => {
    set((state) => {
      if (!state.undoStack || state.undoStack.length === 0) return state;
      const prev = state.undoStack[state.undoStack.length - 1];
      const newUndoStack = state.undoStack.slice(0, -1);
      const newRedoStack = [...(state.redoStack || []), { components: state.components, selectedComponentId: state.selectedComponentId }];
      if (typeof window !== 'undefined') {
        localStorage.setItem('wab_components', JSON.stringify(prev.components));
      }
      return {
        ...state,
        components: prev.components,
        selectedComponentId: prev.selectedComponentId,
        undoStack: newUndoStack,
        redoStack: newRedoStack,
      };
    });
  },

  redo: () => {
    set((state) => {
      if (!state.redoStack || state.redoStack.length === 0) return state;
      const next = state.redoStack[state.redoStack.length - 1];
      const newRedoStack = state.redoStack.slice(0, -1);
      const newUndoStack = [...(state.undoStack || []), { components: state.components, selectedComponentId: state.selectedComponentId }];
      if (typeof window !== 'undefined') {
        localStorage.setItem('wab_components', JSON.stringify(next.components));
      }
      return {
        ...state,
        components: next.components,
        selectedComponentId: next.selectedComponentId,
        undoStack: newUndoStack,
        redoStack: newRedoStack,
      };
    });
  },

  exportJSON: () => {
    const { components } = get();
    return JSON.stringify(components, null, 2);
  },

  importJSON: (json: string) => {
    try {
      const components = JSON.parse(json) as CanvasComponent[];
      set({ components, selectedComponentId: null });
      if (typeof window !== 'undefined') {
        localStorage.setItem('wab_components', JSON.stringify(components));
      }
    } catch (error) {
      console.error('Failed to import JSON:', error);
    }
  },
}));
