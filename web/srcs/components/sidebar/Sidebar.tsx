import React, { JSX, useState } from "react";
import {
  PencilSquareIcon,
  PhotoIcon,
  DocumentTextIcon,
  MusicalNoteIcon,
  VideoCameraIcon,
  CalculatorIcon,
  ScissorsIcon,
  DocumentIcon,
  LinkIcon,
  CodeBracketIcon,
  PaintBrushIcon,
  MagnifyingGlassIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

import SidebarHeader from "./SidebarHeader";
import SidebarMenu from "./SidebarMenu";
import DarkModeToggle from "./DarkModeToggle";
import ProfileInfo from "./ProfileInfo";

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
  const [openSubMenus, setOpenSubMenus] = useState<{
    [key: string]: string | null;
  }>({});
  const [openSubSubMenus, setOpenSubSubMenus] = useState<{
    [key: string]: string | null;
  }>({});
  const [isOpen, setIsOpen] = useState(true);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(
    typeof window !== "undefined" && localStorage.getItem("theme") === "dark"
  );
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleMenuToggle = (menuName: string) => {
    setOpenMenu((prev) => (prev === menuName ? null : menuName));
  };

  const handleSidebarToggle = () => {
    if (isOpen) {
      // Close all menus when minimizing
      setOpenMenu(null);
      setOpenSubMenus({});
      setOpenSubSubMenus({});
    }
    setIsOpen(!isOpen);
  };

  const handleMenuClick = (menuName: string) => {
    if (!isOpen) {
      // Maximize sidebar and auto-expand clicked menu
      setIsOpen(true);
      setOpenMenu(menuName);
    } else {
      // Expand or collapse menu as usual
      setOpenMenu((prev) => (prev === menuName ? null : menuName));
    }
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

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newMode);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const getMenuIcon = (menuName: string) => {
    const iconSize = isOpen ? "w-6 h-6" : "w-4 h-4";
    return (
      <div className="cursor-pointer" onClick={() => handleMenuClick(menuName)}>
        {menuIcons[menuName] || <DocumentTextIcon className={iconSize} />}
      </div>
    );
  };

  const menuIcons: { [key: string]: JSX.Element } = {
    Annotations: <PencilSquareIcon className="w-6 h-6" />,
    "Image Editor": <PhotoIcon className="w-6 h-6" />,
    "Text Editor": <DocumentTextIcon className="w-6 h-6" />,
    "Audio Editor": <MusicalNoteIcon className="w-6 h-6" />,
    "Video Editor": <VideoCameraIcon className="w-6 h-6" />,
    "Numeric Data Editor": <CalculatorIcon className="w-6 h-6" />,
    "Dataset Split": <ScissorsIcon className="w-6 h-6" />,
    "Document Editor": <DocumentIcon className="w-6 h-6" />,
    "URL Extractor": <LinkIcon className="w-6 h-6" />,
    "JSON Editor": <CodeBracketIcon className="w-6 h-6" />,
    "Image Color Picker": <PaintBrushIcon className="w-6 h-6" />,
    "Regex Editor": <MagnifyingGlassIcon className="w-6 h-6" />,
    "Cryptography Generator": <LockClosedIcon className="w-6 h-6" />,
  };


  const applyHoverStyles = (
    e: React.MouseEvent<HTMLDivElement | HTMLAnchorElement, MouseEvent>
  ) => {
    const element = e.currentTarget;
    const isDarkMode = document.documentElement.classList.contains("dark");

    element.style.backgroundColor = isDarkMode
      ? "#1a4f9d"
      : "var(--hover-blue)";
    element.style.color = isDarkMode ? "white" : "var(--text-light)";
  };

  const resetHoverStyles = (
    e: React.MouseEvent<HTMLDivElement | HTMLAnchorElement, MouseEvent>
  ) => {
    const element = e.currentTarget;
    const isDarkMode = document.documentElement.classList.contains("dark");

    element.style.backgroundColor = "";
    element.style.color = isDarkMode
      ? "var(--default-light)"
      : "var(--default-blue)";
  };

  return (
    <div
      className={`flex h-screen flex-col justify-between border-e bg-white dark:bg-gray-900 transition-all duration-300 ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      <div
        className="px-2 py-6"
        style={{ overflowY: "auto", maxHeight: "calc(100vh - 96px)" }}
      >
        <SidebarHeader
          isOpen={isOpen}
          handleSidebarToggle={handleSidebarToggle}
        />
        <SidebarMenu
          menuData={menuData}
          onMenuClick={onMenuClick}
          selectedMenu={selectedMenu}
          openMenu={openMenu}
          openSubMenus={openSubMenus}
          openSubSubMenus={openSubSubMenus}
          handleMenuToggle={handleMenuToggle}
          handleSubMenuToggle={handleSubMenuToggle}
          handleSubSubMenuToggle={handleSubSubMenuToggle}
          getMenuIcon={getMenuIcon}
          isOpen={isOpen}
          applyHoverStyles={applyHoverStyles}
          resetHoverStyles={resetHoverStyles}
        />
      </div>
      <div className="flex flex-col items-start space-y-4 p-4 border-t border-gray-200 dark:border-gray-700">
        <DarkModeToggle
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          isOpen={isOpen}
        />
        <ProfileInfo
          isProfileMenuOpen={isProfileMenuOpen}
          toggleProfileMenu={toggleProfileMenu}
          isOpen={isOpen}
        />
      </div>
    </div>
  );
};

export default Sidebar;