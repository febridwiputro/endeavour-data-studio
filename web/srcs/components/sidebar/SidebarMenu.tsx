import React from "react";
import SidebarSubFeatures from "./SidebarSubFeatures";

interface SidebarMenuProps {
  menuData: any[];
  onMenuClick: (menuName: string) => void;
  openMenu: string | null;
  openSubMenus: { [key: string]: string | null };
  openSubSubMenus: { [key: string]: string | null };
  selectedMenu: string;
  handleMenuToggle: (menuName: string) => void;
  handleSubMenuToggle: (menuName: string, subFeatureName: string) => void;
  handleSubSubMenuToggle: (
    menuName: string,
    subFeatureName: string,
    subSubFeatureName: string
  ) => void;
  getMenuIcon: (menuName: string) => JSX.Element;
  isOpen: boolean;
  applyHoverStyles: (
    e: React.MouseEvent<HTMLDivElement | HTMLAnchorElement, MouseEvent>
  ) => void;
  resetHoverStyles: (
    e: React.MouseEvent<HTMLDivElement | HTMLAnchorElement, MouseEvent>
  ) => void;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({
  menuData,
  onMenuClick,
  openMenu,
  openSubMenus,
  openSubSubMenus,
  selectedMenu,
  handleMenuToggle,
  handleSubMenuToggle,
  handleSubSubMenuToggle,
  getMenuIcon,
  isOpen,
  applyHoverStyles,
  resetHoverStyles,
}) => {
  return (
    <ul className="mt-6 space-y-1">
      {menuData.map((menuItem, index) => (
        <li key={index}>
          <div>
            <summary
              onClick={() => handleMenuToggle(menuItem.name)}
              onMouseEnter={applyHoverStyles}
              onMouseLeave={resetHoverStyles}
              className={`flex cursor-pointer items-center justify-${
                isOpen ? "start" : "center"
              } rounded-lg px-2 py-2 text-gray-800 dark:text-gray-200`}
            >
              <span className="flex items-center">
                <div
                  className={`flex justify-${
                    isOpen ? "start" : "center"
                  } items-center`}
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
                applyHoverStyles={applyHoverStyles}
                resetHoverStyles={resetHoverStyles}
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