import React, { useEffect } from "react";

import "./app-builder.css";
import SubHeader from "./SubHeader/SubHeader";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { LeftSidebar } from "./LeftSidebar/LeftSidebar";
import { Canvas } from "./Canvas/Canvas";
import { PropertiesPanel } from "./Panel/PropertiesPanel";
import { useBuilderStore } from "@/lib/store";

const AppBuilder = () => {
  const componentsByPage = useBuilderStore((state) => state.componentsByPage);

  // Sync all components from all pages to localStorage for preview
  useEffect(() => {
    const allComponents = Object.values(componentsByPage).flatMap(
      (page) => page.components,
    );
    localStorage.setItem("wab_components", JSON.stringify(allComponents));
  }, [componentsByPage]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="builder-app-root">
        <SubHeader />
        <div className="builder-app-main">
          <LeftSidebar />
          <Canvas />
          <PropertiesPanel />
        </div>
      </div>
    </DndProvider>
  );
};

export default AppBuilder;
