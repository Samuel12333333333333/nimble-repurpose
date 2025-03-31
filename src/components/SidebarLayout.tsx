
import React from 'react';
import { Outlet } from 'react-router-dom';
import AppSidebar from './AppSidebar';

const SidebarLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default SidebarLayout;
