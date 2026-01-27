"use client";

import React from "react";
import "../styles/LeftSidebar.css";
import { componentRegistry } from "@/lib/componentRegistry";
import { DraggableComponent } from "./DraggableComponent";
import { ChevronDown } from "lucide-react";

export const LeftSidebar: React.FC = () => {
  const [expanded, setExpanded] = React.useState(true);

  return (
    <div className="left-sidebar">
      <div className="left-sidebar-header">
        <button
          onClick={() => setExpanded(!expanded)}
          className="left-sidebar-button"
        >
          <span>Components</span>
          <ChevronDown
            size={20}
            className={`left-sidebar-chevron${expanded ? "" : " collapsed"}`}
          />
        </button>
      </div>

      {expanded && (
        <div className="left-sidebar-content">
          <div className="left-sidebar-list">
            {Object.values(componentRegistry).map((schema) => (
              <DraggableComponent
                key={schema.type}
                type={schema.type}
                label={schema.label}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
