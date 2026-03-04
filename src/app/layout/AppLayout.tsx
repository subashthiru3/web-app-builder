import React from "react";
import { styled } from "@mui/material";
import { MWLTopNavbar } from "react-web-white-label";
import LVLogo from "../../../public/mh-logo.svg";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  marginBottom: theme.spacing(1),
  ...theme.mixins.toolbar,
}));

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <MWLTopNavbar
        variant="primary"
        appName="App Builder"
        appLogo={LVLogo}
        showElements={{
          notifications: false,
          profile: true,
          searchbar: false,
          settings: false,
        }}
        userData={{ userName: "John Doe", userEmail: "john.doe@example.com" }}
      />
      <DrawerHeader />
      {children}
    </>
  );
};

export default AppLayout;
