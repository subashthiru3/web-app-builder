import React from "react";
import { MWLButtonPropFields } from "./MWLButtonPropFields";
import { MWLCardPropFields } from "./MWLCardPropFields";
import { MWLAvatarPropFields } from "./MWLAvatarPropFields";
import { MWLChipPropFields } from "./MWLChipPropFields";
import { MWLBadgePropFields } from "./MWLBadgePropFields";
import { MWLAlertPropFields } from "./MWLAlertPropFields";
import { MWLTooltipPropFields } from "./MWLTooltipPropFields";

interface PropertiesPanelProps {
  properties: Record<string, any>;
  onChange: (key: string, value: any) => void;
  type?: string;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  properties,
  onChange,
  type,
}) => {
  let fields: any[] = [];
  if (type === "Button") {
    fields = MWLButtonPropFields;
  } else if (type === "Card") {
    fields = MWLCardPropFields;
  } else if (type === "Avatar") {
    fields = MWLAvatarPropFields;
  } else if (type === "Chip") {
    fields = MWLChipPropFields;
  } else if (type === "Badge") {
    fields = MWLBadgePropFields;
  } else if (type === "Alert") {
    fields = MWLAlertPropFields;
  } else if (type === "Tooltip") {
    fields = MWLTooltipPropFields;
  } else {
    fields = Object.keys(properties).map((key) => ({ key, type: "text" }));
  }

  return (
    <div className="properties-panel-responsive">
      <h3>Properties</h3>
      {fields.length === 0 && <div>No properties</div>}
      <form className="properties-form">
        {fields.map((field) =>
          field.type === "checkbox" ? (
            <div
              key={field.key}
              className="property-field property-checkbox-field"
            >
              <label className="property-label property-checkbox-label">
                <input
                  type="checkbox"
                  checked={!!properties[field.key]}
                  onChange={(e) => onChange(field.key, e.target.checked)}
                  className="property-checkbox"
                />
                <span>{field.key}</span>
              </label>
            </div>
          ) : (
            <div key={field.key} className="property-field">
              <label className="property-label">{field.key}</label>
              {field.type === "select" ? (
                <select
                  value={properties[field.key] ?? ""}
                  onChange={(e) => onChange(field.key, e.target.value)}
                  className="property-input"
                >
                  <option value="">Select</option>
                  {field.options.map((opt: any) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : field.type === "number" ? (
                <input
                  type="number"
                  value={properties[field.key] ?? ""}
                  onChange={(e) => onChange(field.key, Number(e.target.value))}
                  className="property-input"
                />
              ) : (
                <input
                  type="text"
                  value={properties[field.key] ?? ""}
                  onChange={(e) => onChange(field.key, e.target.value)}
                  className="property-input"
                />
              )}
            </div>
          )
        )}
      </form>
      <style jsx>{`
        .properties-panel-responsive {
          padding: 16px;
        }
        .properties-form {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
        }
        .property-field {
          flex: 1 1 220px;
          min-width: 180px;
          max-width: 100%;
          display: flex;
          flex-direction: column;
          margin-bottom: 0;
        }
        .property-label {
          font-weight: 500;
          margin-bottom: 4px;
        }
        .property-input {
          width: 100%;
          padding: 6px 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 1rem;
        }
        .property-checkbox-field {
          display: flex;
          justify-content: space-between;
          min-height: 40px;
        }
        .property-checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
        }
        .property-checkbox {
          width: 18px;
          height: 18px;
          margin: 0;
        }
        @media (max-width: 600px) {
          .properties-form {
            flex-direction: column;
            gap: 8px;
          }
          .property-field {
            min-width: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default PropertiesPanel;
