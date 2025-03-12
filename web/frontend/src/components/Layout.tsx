import React, { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import Breadcrumb from "@/components/Breadcrumb";
import { HomeIcon, MagnifyingGlassIcon, ClockIcon, BellIcon, CogIcon, PlusIcon } from "@heroicons/react/24/outline";

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
  const [showSpeedDial, setShowSpeedDial] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Sidebar - Hidden in mobile mode */}
      <div className="hidden md:block">
        <Sidebar menuData={menuData} onMenuClick={onMenuClick} selectedMenu={selectedMenu} />
      </div>
      
      <div className="flex flex-col flex-grow">
        {/* Breadcrumb */}
        <div className="bg-white shadow-sm px-3">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* Main Content */}
        <div className="flex-grow bg-gray-100">{children}</div>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 dark:bg-gray-800 dark:border-gray-600 md:hidden shadow-lg backdrop-blur-md bg-opacity-80 dark:bg-opacity-80">
        <div className="grid grid-cols-5 relative">
          {[ 
            { name: "Dashboard", icon: HomeIcon }, 
            { name: "Search", icon: MagnifyingGlassIcon }, 
            { name: "History", icon: ClockIcon }, 
            { name: "Notifications", icon: BellIcon }, 
            { name: "Settings", icon: CogIcon }
          ].map(({ name, icon: Icon }, index) => (
            <div key={index} className="relative group flex justify-center">
              <button
                className="flex flex-col items-center justify-center p-2 transition-all duration-300 rounded-full hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 dark:hover:text-gray-900"
                onClick={() => onMenuClick(name)}
              >
                <Icon className="w-6 h-6 text-gray-500 dark:text-gray-400 transition-all duration-300 group-hover:text-white" />
              </button>
              <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 px-3 py-1 text-xs font-medium text-white bg-gray-900 rounded-lg shadow-md opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:bg-gray-700">
                {name}
              </div>
              {/* Speed Dial Button Above Settings */}
              {name === "Settings" && (
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                  <button
                    className="bg-blue-600 p-3 rounded-full shadow-lg text-white flex items-center justify-center hover:bg-blue-700 transition"
                    onClick={() => setShowSpeedDial(!showSpeedDial)}
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                  {showSpeedDial && (
                    <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-900 p-3 rounded-lg shadow-lg flex flex-col space-y-1">
                      {menuData.map((menu) => (
                        <button
                          key={menu.name}
                          className="flex items-center space-x-2 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-sm"
                          onClick={() => {
                            onMenuClick(menu.name);
                            setShowSpeedDial(false);
                          }}
                        >
                          <span>{menu.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Layout;




// import React from "react";
// import Sidebar from "@/components/sidebar/Sidebar";
// import Breadcrumb from "@/components/Breadcrumb";
// import { HomeIcon } from "@heroicons/react/24/outline";

// interface LayoutProps {
//   children: React.ReactNode;
//   menuData: any[];
//   onMenuClick: (menuName: string) => void;
//   selectedMenu: string;
//   breadcrumbItems: { label: string; href: string; icon?: React.ReactNode; isActive?: boolean }[];
// }

// const Layout: React.FC<LayoutProps> = ({
//   children,
//   menuData,
//   onMenuClick,
//   selectedMenu,
//   breadcrumbItems,
// }) => {
//   return (
//     <div className="flex h-screen">
//       {/* Sidebar */}
//       <Sidebar menuData={menuData} onMenuClick={onMenuClick} selectedMenu={selectedMenu} />

//       <div className="flex flex-col flex-grow">
//         {/* Breadcrumb */}
//         <div className="bg-white shadow-sm px-3">
//           <Breadcrumb items={breadcrumbItems} />
//         </div>

//         {/* Main Content */}
//         <div className="flex-grow bg-gray-100">{children}</div>
//       </div>
//     </div>
//   );
// };

// export default Layout;