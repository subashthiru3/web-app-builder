"use client";

import React from "react";
import "../../styles/PropertiesPanel.css";

import { useBuilderStore } from "@/lib/store";
import { usePagesStore } from "@/lib/pagesStore";
import type { CanvasComponent, RowData } from "@/lib/types";
import { getComponentSchema } from "@/lib/componentRegistry";
import { PropertyEditor } from "./PropertyEditor";
import CanvasEditor from "./CanvasEditor";
import { TextField as MuiTextField } from "@mui/material";
import PageEditor from "./PageEditor";
import CustomTabs from "../../app/components/CustomTab/CustomTabs";

const normalizeRowData = (value: unknown): RowData[] | null => {
  if (!Array.isArray(value)) {
    return null;
  }

  return value.map((row: RowData, idx: number) => {
    if (row && (row.id === undefined || row.id === null || row.id === "")) {
      return { ...row, id: idx + 1 };
    }
    return row;
  });
};

export const PropertiesPanel: React.FC = () => {
  const { pages, activePageId } = usePagesStore();
  const {
    componentsByPage,
    selectedComponentId,
    updateComponentProps,
    updateComponentWidth,
    updateComponentHeight,
  } = useBuilderStore();
  const components = componentsByPage[activePageId]?.components || [];
  const selectedComponent = components.find(
    (c: CanvasComponent) => c.id === selectedComponentId,
  );
  const hasPageSelected = pages.length > 0 && activePageId !== 0;
  const schema = selectedComponent
    ? getComponentSchema(selectedComponent.type)
    : null;

  if (!hasPageSelected) {
    return (
      <div className="properties-panel-root properties-panel-empty">
        <div>
          <div>No page selected</div>
        </div>
      </div>
    );
  }

  const propertyTabContent = selectedComponent ? (
    <div className="properties-tab-content">
      <div className="properties-panel-header">
        <div className="properties-width-adjustment">
          <h3>Customized width and Height</h3>
          <MuiTextField
            type="number"
            value={selectedComponent.width || ""}
            onChange={(e) =>
              updateComponentWidth(
                selectedComponentId!,
                e.target.value,
                activePageId,
              )
            }
            size="small"
            fullWidth
            label="Width (px)"
            placeholder="e.g., 300"
            slotProps={{ htmlInput: { min: 0 } }}
          />
        </div>
        <MuiTextField
          type="number"
          value={selectedComponent.height || ""}
          onChange={(e) =>
            updateComponentHeight(
              selectedComponentId!,
              e.target.value,
              activePageId,
            )
          }
          size="small"
          fullWidth
          label="Height (px)"
          placeholder="e.g., 200"
          slotProps={{ htmlInput: { min: 0 } }}
        />
        <div className="properties-panel-header-row">
          <h3 className="properties-panel-title">{schema?.label} Properties</h3>
        </div>
        <div className="properties-panel-info">ID: {selectedComponentId}</div>
      </div>

      <div className="properties-panel-content">
        <div className="properties-panel-fields">
          {schema?.editableFields.map((fieldName) => {
            const fieldValue =
              selectedComponent.props[
                fieldName as keyof typeof selectedComponent.props
              ];
            console.log("[WAB] Field:", fieldName, "Value:", fieldValue);
            return (
              <PropertyEditor
                key={fieldName}
                fieldName={fieldName}
                value={fieldValue}
                onChange={(value) => {
                  console.log("[WAB] Updating", fieldName, "to", value);
                  let newValue = value;
                  if (fieldName === "rowData") {
                    const normalizedRowData = normalizeRowData(value);
                    if (!normalizedRowData) {
                      return;
                    }
                    newValue = normalizedRowData;
                  }
                  updateComponentProps(
                    selectedComponentId!,
                    { ...selectedComponent.props, [fieldName]: newValue },
                    activePageId,
                  );
                }}
                componentType={selectedComponent.type}
              />
            );
          })}
        </div>
      </div>
    </div>
  ) : (
    <div className="properties-tab-content properties-panel-content">
      <div className="properties-panel-empty-text">
        Select a component to edit properties
      </div>
    </div>
  );

  return (
    <div className="properties-panel-root">
      <CustomTabs
        tabs={[
          {
            label: "Property",
            content: propertyTabContent,
          },
          {
            label: "Canvas",
            content: <CanvasEditor />,
          },
          {
            label: "Page",
            content: <PageEditor />,
          },
        ]}
        initialTab={0}
      />
    </div>
  );
};
