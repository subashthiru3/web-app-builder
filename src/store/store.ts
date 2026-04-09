import { create } from "zustand";
import { createProjectDataSlice, ProjectDataSlice } from "./projectDataSlice";

type StoreState = ProjectDataSlice;

export const useStore = create<StoreState>()((...a) => ({
  ...createProjectDataSlice(...a),
}));
