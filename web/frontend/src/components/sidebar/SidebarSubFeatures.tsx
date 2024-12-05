import React from "react";

interface SidebarSubFeaturesProps {
  subFeatures: any[];
  menuName: string;
  openSubMenus: { [key: string]: string | null };
  openSubSubMenus: { [key: string]: string | null };
  handleSubMenuToggle: (menuName: string, subFeatureName: string) => void;
  handleSubSubMenuToggle: (
    menuName: string,
    subFeatureName: string,
    subSubFeatureName: string
  ) => void;
  applyHoverStyles: (
    e: React.MouseEvent<HTMLDivElement | HTMLAnchorElement, MouseEvent>
  ) => void;
  resetHoverStyles: (
    e: React.MouseEvent<HTMLDivElement | HTMLAnchorElement, MouseEvent>
  ) => void;
  onMenuClick: (pointName: string) => void;
  isOpen: boolean;
}

const SidebarSubFeatures: React.FC<SidebarSubFeaturesProps> = ({
  subFeatures,
  menuName,
  openSubMenus,
  openSubSubMenus,
  handleSubMenuToggle,
  handleSubSubMenuToggle,
  applyHoverStyles,
  resetHoverStyles,
  onMenuClick,
  isOpen,
}) => {
  return (
    <ul className="mt-2 space-y-1 px-4">
      {subFeatures.map((subFeature: any, subIndex: number) => (
        <li key={subIndex}>
          <div>
            <summary
              onClick={() => handleSubMenuToggle(menuName, subFeature.name)}
              onMouseOver={applyHoverStyles}
              onMouseOut={resetHoverStyles}
              className={`flex cursor-pointer items-center justify-${
                isOpen ? "start" : "center"
              } rounded-lg px-4 py-2 text-gray-800 dark:text-gray-200`}
            >
              <span className={`${!isOpen && "hidden"} text-sm font-medium`}>
                {subFeature.name}
              </span>
            </summary>
            {openSubMenus[menuName] === subFeature.name &&
              subFeature.sub_features_1 && (
                <ul className="mt-2 space-y-1 px-4">
                  {subFeature.sub_features_1.map(
                    (subSubFeature: any, subSubIndex: number) => (
                      <li key={subSubIndex}>
                        <div>
                          <summary
                            onClick={() =>
                              handleSubSubMenuToggle(
                                menuName,
                                subFeature.name,
                                subSubFeature.name
                              )
                            }
                            onMouseOver={applyHoverStyles}
                            onMouseOut={resetHoverStyles}
                            className={`flex cursor-pointer items-center justify-${
                              isOpen ? "start" : "center"
                            } rounded-lg px-4 py-2 text-gray-800 dark:text-gray-200`}
                          >
                            <span
                              className={`${
                                !isOpen && "hidden"
                              } text-sm font-medium`}
                            >
                              {subSubFeature.name}
                            </span>
                          </summary>
                          {openSubSubMenus[
                            `${menuName}-${subFeature.name}`
                          ] === subSubFeature.name && (
                            <ul className="mt-2 space-y-1 px-4">
                              {subSubFeature.sub_features_2?.map(
                                (point: any, pointIndex: number) => (
                                  <li key={pointIndex}>
                                    <a
                                      href="#"
                                      className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-200"
                                      onClick={() => onMenuClick(point.name)}
                                      onMouseOver={applyHoverStyles}
                                      onMouseOut={resetHoverStyles}
                                    >
                                      {point.name}
                                    </a>
                                  </li>
                                )
                              )}
                            </ul>
                          )}
                        </div>
                      </li>
                    )
                  )}
                </ul>
              )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default SidebarSubFeatures;
