"use client";

import React from "react";
import "../../styles/PropertyEditor.css";
import { ComponentType } from "@/lib/types";
import { Select, MenuItem, TextField as MuiTextField } from "@mui/material";

interface PropertyEditorProps {
  fieldName: string;
  value: any;
  onChange: (value: any) => void;
  componentType: ComponentType;
}

export const PropertyEditor: React.FC<PropertyEditorProps> = ({
  fieldName,
  value,
  onChange,
  componentType,
}) => {
  const getFieldLabel = (field: string) => {
    return field
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  const renderEditor = () => {
    // Handle variant selector for buttons
    if (
      componentType === ("button" as ComponentType) &&
      fieldName === "variant"
    ) {
      return (
        <Select
          value={value || "contained"}
          onChange={(e) => onChange(e.target.value)}
          size="small"
          fullWidth
        >
          <MenuItem value="contained">Contained</MenuItem>
          <MenuItem value="outlined">Outlined</MenuItem>
          <MenuItem value="text">Text</MenuItem>
        </Select>
      );
    }

    // Handle color selector for buttons
    if (
      componentType === ("button" as ComponentType) &&
      fieldName === "color"
    ) {
      return (
        <Select
          value={value || "primary"}
          onChange={(e) => onChange(e.target.value)}
          size="small"
          fullWidth
        >
          <MenuItem value="primary">Primary</MenuItem>
          <MenuItem value="secondary">Secondary</MenuItem>
          <MenuItem value="error">Error</MenuItem>
          <MenuItem value="warning">Warning</MenuItem>
          <MenuItem value="info">Info</MenuItem>
          <MenuItem value="success">Success</MenuItem>
        </Select>
      );
    }

    // Handle size selector for buttons
    if (componentType === ("button" as ComponentType) && fieldName === "size") {
      return (
        <Select
          value={value || "medium"}
          onChange={(e) => onChange(e.target.value)}
          size="small"
          fullWidth
        >
          <MenuItem value="small">Small</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="large">Large</MenuItem>
        </Select>
      );
    }

    // Handle button text
    if (componentType === ("button" as ComponentType) && fieldName === "text") {
      return (
        <MuiTextField
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          size="small"
          fullWidth
          placeholder="Button text"
        />
      );
    }

    // Handle button border radius
    if (
      componentType === ("button" as ComponentType) &&
      fieldName === "borderRadius"
    ) {
      return (
        <MuiTextField
          type="number"
          value={value || 4}
          onChange={(e) => onChange(Number(e.target.value))}
          size="small"
          fullWidth
          inputProps={{ min: 0, step: 1 }}
        />
      );
    }

    // Handle text font weight
    if (
      componentType === ("text" as ComponentType) &&
      fieldName === "fontWeight"
    ) {
      return (
        <Select
          value={String(value) || "400"}
          onChange={(e) => onChange(e.target.value)}
          size="small"
          fullWidth
        >
          <MenuItem value="300">Light (300)</MenuItem>
          <MenuItem value="400">Normal (400)</MenuItem>
          <MenuItem value="500">Medium (500)</MenuItem>
          <MenuItem value="600">Semi-Bold (600)</MenuItem>
          <MenuItem value="700">Bold (700)</MenuItem>
        </Select>
      );
    }

    // Handle text font size
    if (
      componentType === ("text" as ComponentType) &&
      fieldName === "fontSize"
    ) {
      return (
        <MuiTextField
          type="number"
          value={value || 16}
          onChange={(e) => onChange(Number(e.target.value))}
          size="small"
          fullWidth
          inputProps={{ min: 8, step: 1 }}
        />
      );
    }

    // Handle text color
    if (componentType === ("text" as ComponentType) && fieldName === "color") {
      return (
        <div className="property-editor-row">
          <input
            type="color"
            value={value || "#000000"}
            onChange={(e) => onChange(e.target.value)}
            className="w-12 h-10 rounded border border-slate-300 cursor-pointer"
          />
          <MuiTextField
            value={value || "#000000"}
            onChange={(e) => onChange(e.target.value)}
            size="small"
            fullWidth
            placeholder="#000000"
          />
        </div>
      );
    }

    // Handle text content
    if (
      componentType === ("text" as ComponentType) &&
      fieldName === "content"
    ) {
      return (
        <MuiTextField
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          size="small"
          fullWidth
          multiline
          rows={3}
          placeholder="Text content"
        />
      );
    }

    // Handle card elevation
    if (
      componentType === ("card" as ComponentType) &&
      fieldName === "elevation"
    ) {
      return (
        <MuiTextField
          type="number"
          value={value || 1}
          onChange={(e) => onChange(Number(e.target.value))}
          size="small"
          fullWidth
          inputProps={{ min: 0, max: 24, step: 1 }}
        />
      );
    }

    // Handle card padding
    if (
      componentType === ("card" as ComponentType) &&
      fieldName === "padding"
    ) {
      return (
        <MuiTextField
          type="number"
          value={value || 16}
          onChange={(e) => onChange(Number(e.target.value))}
          size="small"
          fullWidth
          inputProps={{ min: 0, step: 1 }}
        />
      );
    }

    // Handle card background color
    if (
      componentType === ("card" as ComponentType) &&
      fieldName === "backgroundColor"
    ) {
      return (
        <div className="property-editor-row">
          <input
            type="color"
            value={value || "#ffffff"}
            onChange={(e) => onChange(e.target.value)}
            className="w-12 h-10 rounded border border-slate-300 cursor-pointer"
          />
          <MuiTextField
            value={value || "#ffffff"}
            onChange={(e) => onChange(e.target.value)}
            size="small"
            fullWidth
            placeholder="#ffffff"
          />
        </div>
      );
    }

    // Handle image width
    if (componentType === ("image" as ComponentType) && fieldName === "width") {
      return (
        <MuiTextField
          type="number"
          value={value || 200}
          onChange={(e) => onChange(Number(e.target.value))}
          size="small"
          fullWidth
          inputProps={{ min: 1, step: 1 }}
        />
      );
    }

    // Handle image height
    if (
      componentType === ("image" as ComponentType) &&
      fieldName === "height"
    ) {
      return (
        <MuiTextField
          type="number"
          value={value || 200}
          onChange={(e) => onChange(Number(e.target.value))}
          size="small"
          fullWidth
          inputProps={{ min: 1, step: 1 }}
        />
      );
    }

    // Handle image border radius
    if (
      componentType === ("image" as ComponentType) &&
      fieldName === "borderRadius"
    ) {
      return (
        <MuiTextField
          type="number"
          value={value || 0}
          onChange={(e) => onChange(Number(e.target.value))}
          size="small"
          fullWidth
          inputProps={{ min: 0, step: 1 }}
        />
      );
    }

    // Handle image URL
    if (
      componentType === ("image" as ComponentType) &&
      fieldName === "imageUrl"
    ) {
      return (
        <MuiTextField
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          size="small"
          fullWidth
          placeholder="https://example.com/image.jpg"
        />
      );
    }

    // Special handling for grid rowData/columnData fields
    if (
      (fieldName === "rowData" || fieldName === "columnData") &&
      Array.isArray(value)
    ) {
      return (
        <MuiTextField
          value={JSON.stringify(value, null, 2)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value);
              onChange(parsed);
            } catch {
              onChange(e.target.value); // fallback to raw string if not valid JSON
            }
          }}
          size="small"
          fullWidth
          multiline
          minRows={3}
          maxRows={10}
          placeholder={
            fieldName === "rowData" ? '[{"id":1,...}]' : '[{"field":"id",...}]'
          }
        />
      );
    }

    // Default text input
    return (
      <MuiTextField
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        size="small"
        fullWidth
      />
    );
  };

  return (
    <div className="property-editor-list">
      <label className="block text-sm font-medium text-slate-700">
        {getFieldLabel(fieldName)}
      </label>
      {renderEditor()}
    </div>
  );
};
