import { StateCreator } from "zustand";

export interface ProjectData {
  projectName: string;
  description: string;
  urlPath: string;
  title: string;
}

export interface ProjectDataSlice {
  projectData: ProjectData;
  updateProjectData: (field: keyof ProjectData, value: string) => void;
}

export const createProjectDataSlice: StateCreator<
  ProjectDataSlice,
  [],
  [],
  ProjectDataSlice
> = (set) => ({
  projectData: {
    projectName: "",
    description: "",
    urlPath: "",
    title: "",
  },
  updateProjectData: (field, value) => {
    set((state) => ({
      projectData: {
        ...state.projectData,
        [field]: value,
      },
    }));
  },
});
