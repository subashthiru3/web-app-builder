import React from "react";
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
// ...existing code...
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="builder-app-root">
        <Header
          headerProps={{
            userData: {
              userName: "John Doe",
              userEmail: "john.doe@example.com",
            },
            handleDrawerOpen: () => {
              const isOpen = useBuilderStore.getState().sideDrawerOpen;
              setSideDrawerOpen(!isOpen);
            },
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
