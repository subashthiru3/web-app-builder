import React from "react";
import { MwlTopNavbarProps } from "react-web-white-label";
import { MWLTopNavbar } from "react-web-white-label";

interface HeaderProps {
  headerProps: MwlTopNavbarProps;
}

const Header: React.FC<HeaderProps> = ({ headerProps }) => {
  return (
    <MWLTopNavbar
      {...headerProps}
      variant="primary"
      appName="LV App Builder"
      appLogo={{ src: "/vercel.svg", width: 1155, height: 1000 }}
    />
  );
};

export default Header;
