import React from "react";
import SidebarSubFeatures from "./SidebarSubFeatures";

interface SidebarMenuProps {
  menuData: any[];
  onMenuClick: (menuName: string) => void;
  selectedMenu: string;
  openMenu: string | null;
  openSubMenus: { [key: string]: string | null };
  openSubSubMenus: { [key: string]: string | null };
  handleMenuToggle: (menuName: string) => void;
  handleSubMenuToggle: (menuName: string, subFeatureName: string) => void;
  handleSubSubMenuToggle: (
    menuName: string,
    subFeatureName: string,
    subSubFeatureName: string
  ) => void;
  getMenuIcon: (menuName: string) => JSX.Element;
  isOpen: boolean;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({
  menuData,
  onMenuClick,
  selectedMenu,
  openMenu,
  openSubMenus,
  openSubSubMenus,
  handleMenuToggle,
  handleSubMenuToggle,
  handleSubSubMenuToggle,
  getMenuIcon,
  isOpen,
}) => {
  return (
    <ul className="mt-6 space-y-1">
      {menuData.map((menuItem, index) => (
        <li key={index}>
          <div>
            <summary
              onClick={() => handleMenuToggle(menuItem.name)}
              className={`flex cursor-pointer items-center justify-${
                isOpen ? "start" : "center"
              } rounded-lg px-2 py-2 ${
                selectedMenu === menuItem.name
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                  : "text-gray-800 dark:text-gray-200"
              }`}
            >
              <span className="flex items-center">
                <div
                  className={`flex justify-${isOpen ? "start" : "center"} items-center`}
                  onClick={() => onMenuClick(menuItem.name)}
                >
                  {getMenuIcon(menuItem.name)}
                </div>
                <span
                  className={`${
                    !isOpen && "hidden"
                  } text-sm font-medium ml-2`}
                >
                  {menuItem.name}
                </span>
              </span>
            </summary>

            {openMenu === menuItem.name && menuItem.features && (
              <SidebarSubFeatures
                subFeatures={menuItem.features}
                menuName={menuItem.name}
                openSubMenus={openSubMenus}
                openSubSubMenus={openSubSubMenus}
                handleSubMenuToggle={handleSubMenuToggle}
                handleSubSubMenuToggle={handleSubSubMenuToggle}
                onMenuClick={onMenuClick}
                isOpen={isOpen}
              />
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default SidebarMenu;



// import React from "react";

// interface SidebarMenuProps {
//   menuData: any[];
//   onMenuClick: (menuName: string) => void;
//   openMenu: string | null;
//   handleMenuToggle: (menuName: string) => void;
//   renderSubFeatures: (subFeatures: any[], menuName: string) => JSX.Element;
//   isOpen: boolean;
//   getMenuIcon: (menuName: string) => JSX.Element;
// }

// const SidebarMenu: React.FC<SidebarMenuProps> = ({
//   menuData,
//   onMenuClick,
//   openMenu,
//   handleMenuToggle,
//   renderSubFeatures,
//   isOpen,
//   getMenuIcon,
// }) => {
//   return (
//     <ul className="mt-6 space-y-1">
//       {menuData.map((menuItem, index) => (
//         <li key={index}>
//           <div>
//             <summary
//               onClick={() => handleMenuToggle(menuItem.name)}
//               className={`flex cursor-pointer items-center justify-${
//                 isOpen ? "start" : "center"
//               } rounded-lg px-2 py-2 text-gray-800 dark:text-gray-200`}
//             >
//               <span className="flex items-center">
//                 <div
//                   className={`flex justify-${isOpen ? "start" : "center"} items-center`}
//                   onClick={() => onMenuClick(menuItem.name)}
//                 >
//                   {getMenuIcon(menuItem.name)}
//                 </div>
//                 <span
//                   className={`${
//                     !isOpen && "hidden"
//                   } text-sm font-medium ml-2`}
//                 >
//                   {menuItem.name}
//                 </span>
//               </span>
//             </summary>
//             {openMenu === menuItem.name &&
//               menuItem.features &&
//               renderSubFeatures(menuItem.features, menuItem.name)}
//           </div>
//         </li>
//       ))}
//     </ul>
//   );
// };

// export default SidebarMenu;
