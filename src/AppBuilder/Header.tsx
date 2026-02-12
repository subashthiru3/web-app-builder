import React from "react";
import { MWLTopNavbar } from "react-web-white-label";

interface HeaderProps {
  headerProps: any;
}

const Header: React.FC<HeaderProps> = ({ headerProps }) => {
  return (
    <MWLTopNavbar
      {...headerProps}
      variant="primary"
      appName="LV App Builder"
      appLogo={{ src: "/vercel.svg", width: 1155, height: 1000 }}
      showElements={{
        notifications: false,
        profile: true,
        searchbar: false,
        settings: false,
      }}
    />
  );
};

export default Header;
