"use client";

import React from "react";
import "../styles/LeftSidebar.css";
import { componentRegistry } from "@/lib/componentRegistry";
import { DraggableComponent } from "./Canvas/DraggableComponent";
import { ChevronDown } from "lucide-react";
import { useBuilderStore } from "@/lib/store";
import CustomTabs from "./CustomTab/CustomTabs";
// ...existing code...

export const LeftSidebar: React.FC = () => {
  const [expanded, setExpanded] = React.useState(true);
  // const setSideDrawerOpen = useBuilderStore((state) => state.setSideDrawerOpen);
  const sideDrawerOpen = useBuilderStore((state) => state.sideDrawerOpen);
  console.log("Rendering LeftSidebar, sideDrawerOpen:", sideDrawerOpen);
  return (
    <div className={sideDrawerOpen ? "left-sidebar" : "left-sidebar collapsed"}>
      {!sideDrawerOpen ? (
        <div className="left-sidebar-collapsed-content">
          <button
            onClick={() => setExpanded(!expanded)}
            className="left-sidebar-button"
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 8,
            }}
            aria-label="Toggle components list"
          >
            <ChevronDown
              size={20}
              className={`left-sidebar-chevron${expanded ? "" : " collapsed"}`}
              style={{
                transition: "transform 0.2s",
                transform: expanded ? "rotate(0deg)" : "rotate(-90deg)",
              }}
            />
          </button>
          {expanded && (
            <div className="left-sidebar-list">
              {Object.values(componentRegistry).map((schema) => (
                <DraggableComponent
                  key={schema.type}
                  type={schema.type}
                  label={schema.label}
                  icon={schema.icon}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <CustomTabs
          tabs={[
            {
              label: "Pages",
              content: (
                <div className="left-sidebar-list">
                  Page management coming soon!
                </div>
              ),
            },
            {
              label: "Assets",
              content: (
                <div className="left-sidebar-list">
                  {Object.values(componentRegistry).map((schema) => (
                    <DraggableComponent
                      key={schema.type}
                      type={schema.type}
                      label={schema.label}
                      icon={schema.icon}
                    />
                  ))}
                </div>
              ),
            },
          ]}
        />
      )}
    </div>
  );
};
