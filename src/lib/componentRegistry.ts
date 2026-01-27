import { ComponentType, DEFAULT_MWL_BUTTON_PROPS } from "./types";

export interface ComponentSchema {
  type: ComponentType;
  label: string;
  icon: string;
  defaultProps: any;
  editableFields: string[];
}

export const componentRegistry: Record<ComponentType, ComponentSchema> = {
  mwlButton: {
    type: "mwlButton",
    label: "MWL Button",
    icon: "SmartButton",
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
};

export const getComponentSchema = (type: ComponentType): ComponentSchema => {
  return componentRegistry[type];
};
