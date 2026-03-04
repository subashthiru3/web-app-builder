import React from "react";
import {
  ComponentType,
  DEFAULT_MWL_BUTTON_PROPS,
  DEFAULT_MWL_GRID_PROPS,
} from "./types";
import { RxButton } from "react-icons/rx";
import { CiViewTable } from "react-icons/ci";

export interface ComponentSchema {
  type: ComponentType;
  label: string;
  icon: React.ReactNode | string;
  defaultProps: any;
  editableFields: string[];
}

export const componentRegistry: Record<ComponentType, ComponentSchema> = {
  mwlButton: {
    type: "mwlButton",
    label: "MWL Button",
    icon: React.createElement(RxButton),
    defaultProps: DEFAULT_MWL_BUTTON_PROPS,
    editableFields: [
      "text",
      "variant",
      "color",
      "size",
      "disabled",
      "borderRadius",
      "textTransform",
      "loading",
      "loadingPosition",
    ],
  },
  mwlGrid: {
    type: "mwlGrid",
    label: "MWL Grid",
    icon: React.createElement(CiViewTable),
    defaultProps: DEFAULT_MWL_GRID_PROPS,
    editableFields: [
      "rowData",
      "columnData",
      "className",
      "rowsPerPageCount",
      "showPagination",
      "variant",
      "listContent",
      "reasonText",
    ],
  },
};

export const getComponentSchema = (type: ComponentType): ComponentSchema => {
  return componentRegistry[type];
};
