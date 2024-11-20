import React from "react";
import { Outlet } from "react-router-dom";
import SideMenu from "./SideMenu";

const DefaultLayout = () => {
  return (
    <div>
      <SideMenu />
      <Outlet />
    </div>
  );
};

export default DefaultLayout;
