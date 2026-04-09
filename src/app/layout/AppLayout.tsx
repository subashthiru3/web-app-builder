import React from "react";
import { MWLTopNavbar } from "react-web-white-label";
import DrawerHeader from "../../components/DrawerHeader/DrawerHeader";
import LVLogo from "../../../public/mh-logo.svg";

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
