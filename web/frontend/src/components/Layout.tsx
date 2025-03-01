import React from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import Breadcrumb from "@/components/Breadcrumb";
import { HomeIcon } from "@heroicons/react/24/outline";

interface LayoutProps {
  children: React.ReactNode;
  menuData: any[];
  onMenuClick: (menuName: string) => void;
  selectedMenu: string;
  breadcrumbItems: { label: string; href: string; icon?: React.ReactNode; isActive?: boolean }[];
}

const Layout: React.FC<LayoutProps> = ({
  children,
  menuData,
  onMenuClick,
  selectedMenu,
  breadcrumbItems,
}) => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar menuData={menuData} onMenuClick={onMenuClick} selectedMenu={selectedMenu} />

      <div className="flex flex-col flex-grow">
        {/* Breadcrumb */}
        <div className="bg-white shadow-sm px-3">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* Main Content */}
        <div className="flex-grow bg-gray-100">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
