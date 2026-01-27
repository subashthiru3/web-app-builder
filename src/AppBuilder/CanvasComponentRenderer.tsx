"use client";

import React from "react";
import { CanvasComponent, MWLButtonProps } from "@/lib/types";
import { MWLButton } from "react-web-white-label";

interface CanvasComponentRendererProps {
  component: CanvasComponent;
}

export const CanvasComponentRenderer: React.FC<
  CanvasComponentRendererProps
> = ({ component }) => {
  // Debug log to verify props are being passed
  console.log("[WAB] Rendering component:", component.type, component.props);

  switch (component.type) {
    case "mwlButton": {
      const props = component.props as Partial<MWLButtonProps>;

      return (
        <MWLButton
          text={props.text ?? "MWL Button"}
          variant={props.variant ?? "contained"}
          color={props.color ?? "primary"}
          size={props.size ?? "medium"}
          borderRadius={props.borderRadius ?? 4}
          disabled={props.disabled ?? false}
          className={props.className ?? "mwl-button"}
          startIcon={props.startIcon}
          endIcon={props.endIcon}
          loading={props.loading ?? false}
          loadingPosition={props.loadingPosition ?? "center"}
          textTransform={props.textTransform ?? "none"}
          handleClick={props.handleClick}
          dataTestid={props.dataTestid}
        />
      );
    }

    default:
      return null;
  }
};
