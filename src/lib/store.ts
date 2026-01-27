'use client';

import { create } from 'zustand';
import { useEffect } from 'react';
import { CanvasComponent, CanvasState, ComponentType, ComponentProps } from './types';
import { getComponentSchema } from './componentRegistry';

interface BuilderStore extends CanvasState {
  addComponent: (type: ComponentType) => void;
  removeComponent: (id: string) => void;
  selectComponent: (id: string | null) => void;
  updateComponentProps: (id: string, props: Partial<ComponentProps>) => void;
  reorderComponents: (fromIndex: number, toIndex: number) => void;
  duplicateComponent: (id: string) => void;
  exportJSON: () => string;
  importJSON: (json: string) => void;
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
      if (typeof window !== 'undefined') {
        localStorage.setItem('wab_components', JSON.stringify(newComponents));
      }
      return { components: newComponents };
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
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('wab_components', JSON.stringify(updated.components));
      }
      return updated;
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
