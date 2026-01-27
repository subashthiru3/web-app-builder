export type ComponentType = "mwlButton";

export interface MWLButtonProps {
  type?: "icon" | "normal";
  variant?: "text" | "outlined" | "contained";
  color?:
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning";
  text?: string | string[];
  className?: string;
  handleClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  startIcon?: React.ReactNode;
  disabled?: boolean;
  size?: "small" | "medium" | "large";
  endIcon?: React.ReactNode;
  count?: number;
  orientation?: "horizontal" | "vertical";
  href?: string;
  borderRadius?: number;
  textTransform?: "none" | "capitalize" | "uppercase" | "lowercase";
  dataTestid?: string;
  loading?: boolean;
  loadingPosition?: "start" | "end" | "center";
  loadingText?: string;
  [key: string]: unknown;
}

export type ComponentProps = MWLButtonProps;

export interface CanvasComponent {
  id: string;
  type: ComponentType;
  props: Partial<ComponentProps>;
}

export interface CanvasState {
  components: CanvasComponent[];
  selectedComponentId: string | null;
}

export const DEFAULT_MWL_BUTTON_PROPS: MWLButtonProps = {
  type: "normal",
  text: "MWL Button",
  variant: "contained",
  color: "primary",
  size: "medium",
  disabled: false,
  borderRadius: 4,
  className: "mwl-button",
  textTransform: "none",
  loading: false,
  loadingPosition: "center",
};
