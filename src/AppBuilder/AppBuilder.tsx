import React, { useEffect } from "react";
import { AppBuilderProps } from "./AppBuilder.types";

import "./AppBuilder.css";
import Header from "./Header";
import SubHeader from "./SubHeader/SubHeader";
import { styled } from "@mui/material/styles";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { LeftSidebar } from "./LeftSidebar";
import { Canvas } from "./Canvas/Canvas";
// ...existing code...
import { PropertiesPanel } from "./PropertyPanel/PropertiesPanel";
import { useBuilderStore } from "@/lib/store";
import { useAuth } from "@/lib/useAuth";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBuilder: React.FC<AppBuilderProps> = ({}) => {
  const setSideDrawerOpen = useBuilderStore((state) => state.setSideDrawerOpen);
  const componentsByPage = useBuilderStore((state) => state.componentsByPage);
  const { user, logout } = useAuth();

  // Sync all components from all pages to localStorage for preview
  useEffect(() => {
    // Flatten all components from all pages into a single array
    const allComponents = Object.values(componentsByPage)
      .flatMap((page) => page.components);
    localStorage.setItem("wab_components", JSON.stringify(allComponents));
  }, [componentsByPage]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="builder-app-root">
        <Header
          headerProps={{
            userData: {
              userName: user?.name || "User",
              userEmail: user?.email || "",
            },
            handleDrawerOpen: () => {
              const isOpen = useBuilderStore.getState().sideDrawerOpen;
              setSideDrawerOpen(!isOpen);
            },
            handleLogout: logout,
          }}
        />
        <DrawerHeader />
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
