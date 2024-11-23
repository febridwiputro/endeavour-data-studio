import { useState } from "react";
import {
  FaPenFancy,
  FaVideo,
  FaImage,
  FaFileAlt,
  FaMusic,
  FaFilm,
  FaCalculator,
  FaCut,
  FaFile,
  FaLink,
  FaCode,
  FaPalette,
  FaSearch,
  FaLock,
} from "react-icons/fa";

interface SidebarProps {
  menuData: any[];
  onMenuClick: (menuName: string) => void;
  selectedMenu: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  menuData,
  onMenuClick,
  selectedMenu,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openSubMenus, setOpenSubMenus] = useState<{
    [key: string]: string | null;
  }>({});
  const [openSubSubMenus, setOpenSubSubMenus] = useState<{
    [key: string]: string | null;
  }>({}); // New state for deeper submenus

  const handleMenuToggle = (menuName: string) => {
    setOpenMenu((prev) => (prev === menuName ? null : menuName));
    setOpenSubMenus({});
    setOpenSubSubMenus({}); // Reset sub-sub menus
  };

  const handleSubMenuToggle = (menuName: string, subFeatureName: string) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [menuName]: prev[menuName] === subFeatureName ? null : subFeatureName,
    }));
    setOpenSubSubMenus({});
  };

  const handleSubSubMenuToggle = (
    menuName: string,
    subFeatureName: string,
    subSubFeatureName: string
  ) => {
    setOpenSubSubMenus((prev) => ({
      ...prev,
      [`${menuName}-${subFeatureName}`]:
        prev[`${menuName}-${subFeatureName}`] === subSubFeatureName
          ? null
          : subSubFeatureName,
    }));
  };

  const handleSidebarToggle = () => {
    if (isOpen) {
      setOpenMenu(null);
      setOpenSubMenus({});
      setOpenSubSubMenus({});
    }
    setIsOpen(!isOpen);
  };

  const handleIconClick = (menuName: string) => {
    if (!isOpen) {
      setIsOpen(true);
    } else {
      onMenuClick(menuName);
    }
  };

  const getMenuIcon = (menuName: string) => {
    const iconSize = isOpen ? "w-6 h-6" : "w-4 h-4"; // Adjust icon size based on `isOpen`
    const icons: { [key: string]: JSX.Element } = {
      "Annotations": <FaPenFancy className={iconSize} />,
      "Image Editor": <FaImage className={iconSize} />,
      "Text Editor": <FaFileAlt className={iconSize} />,
      "Audio Editor": <FaMusic className={iconSize} />,
      "Video Editor": <FaVideo className={iconSize} />,
      "Numeric Data Editor": <FaCalculator className={iconSize} />,
      "Dataset Split": <FaCut className={iconSize} />,
      "Document Editor": <FaFile className={iconSize} />,
      "URL Extractor": <FaLink className={iconSize} />,
      "JSON Editor": <FaCode className={iconSize} />,
      "Image Color Picker": <FaPalette className={iconSize} />,
      "Regex Editor": <FaSearch className={iconSize} />,
      "Cryptography Generator": <FaLock className={iconSize} />,
    };
    return icons[menuName] || <FaFileAlt className={iconSize} />;
  };

  const applyHoverStyles = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const element = e.currentTarget;
    element.style.backgroundColor = "var(--hover-blue)";
    element.style.color = "white";
  };

  const resetHoverStyles = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const element = e.currentTarget;
    element.style.backgroundColor = "";
    element.style.color = "var(--default-blue)";
  };

  const renderSubFeatures = (subFeatures: any[], menuName: string) => {
    return (
      <ul className="mt-2 space-y-1 px-4">
        {subFeatures.map((subFeature: any, subIndex: number) => (
          <li key={subIndex}>
            <div>
              <summary
                onClick={() => handleSubMenuToggle(menuName, subFeature.name)}
                onMouseOver={applyHoverStyles}
                onMouseOut={resetHoverStyles}
                className={`flex cursor-pointer items-center justify-${isOpen ? "start" : "center"} rounded-lg px-4 py-2`}
                style={{ color: "var(--default-blue)" }}
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
                              className={`flex cursor-pointer items-center justify-${isOpen ? "start" : "center"} rounded-lg px-4 py-2`}
                              style={{ color: "var(--default-blue)" }}
                            >
                              <span
                                className={`${!isOpen && "hidden"} text-sm font-medium`}
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
                                        className="block rounded-lg px-4 py-2 text-sm font-medium"
                                        style={{ color: "var(--default-blue)" }}
                                        onClick={() => onMenuClick(point.name)}
                                        onMouseOver={(e) => {
                                          e.currentTarget.style.backgroundColor =
                                            "var(--hover-blue)";
                                          e.currentTarget.style.color = "white";
                                        }}
                                        onMouseOut={(e) => {
                                          e.currentTarget.style.backgroundColor =
                                            "";
                                          e.currentTarget.style.color =
                                            "var(--default-blue)";
                                        }}
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

  return (
    <div
      className={`flex h-screen flex-col justify-between border-e bg-white transition-all duration-300 ${isOpen ? "w-64" : "w-16"}`}
    >
      <div
        className="px-2 py-6"
        style={{ overflowY: "auto", maxHeight: "calc(100vh - 96px)" }}
      >
        <div className="flex items-center justify-center">
          <div
            className="flex items-center cursor-pointer"
            onClick={handleSidebarToggle}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1.5em"
              height="1.5em"
              viewBox="0 0 2048 2048"
              fill="#699bf7"
              className="block"
            >
              <rect width="2048" height="2048" fill="none" />
              <path
                fill="#699bf7"
                d="M2048 640h-640V482L691 960l717 478v-158h640v640h-640v-328l-768-512v200H0V640h640v200l768-512V0h640zm-512 768v384h384v-384zM512 1152V768H128v384zM1536 128v384h384V128z"
              />
            </svg>
            <span
              style={{ color: "var(--default-blue)" }}
              className={`text-xl font-bold ml-2 ${!isOpen && "hidden"}`}
            >
              Dashboard
            </span>
          </div>
        </div>

        <ul className="mt-6 space-y-1">
          {menuData.map((menuItem, index) => (
            <li key={index}>
              <div>
                <summary
                  onClick={() => handleMenuToggle(menuItem.name)}
                  onMouseOver={applyHoverStyles}
                  onMouseOut={resetHoverStyles}
                  className={`flex cursor-pointer items-center justify-${isOpen ? "start" : "center"} rounded-lg px-2 py-2`}
                  style={{ color: "var(--default-blue)" }}
                >
                  <span className="flex items-center">
                    <div
                      className={`flex justify-${isOpen ? "start" : "center"} items-center`}
                      onClick={() => handleIconClick(menuItem.name)}
                    >
                      {getMenuIcon(menuItem.name)}
                    </div>
                    <span
                      className={`${!isOpen && "hidden"} text-sm font-medium ml-2`}
                    >
                      {menuItem.name}
                    </span>
                  </span>
                </summary>
                {openMenu === menuItem.name &&
                  menuItem.features &&
                  renderSubFeatures(menuItem.features, menuItem.name)}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
