import React, { useState } from "react";
import {
  FaPenFancy,
  FaVideo,
  FaImage,
  FaFileAlt,
  FaMusic,
  FaCalculator,
  FaCut,
  FaFile,
  FaLink,
  FaCode,
  FaPalette,
  FaSearch,
  FaLock,
} from "react-icons/fa";

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
        {menuIcons[menuName] || <FaFileAlt className={iconSize} />}
      </div>
    );
  };

  const menuIcons: { [key: string]: JSX.Element } = {
    Annotations: <FaPenFancy />,
    "Image Editor": <FaImage />,
    "Text Editor": <FaFileAlt />,
    "Audio Editor": <FaMusic />,
    "Video Editor": <FaVideo />,
    "Numeric Data Editor": <FaCalculator />,
    "Dataset Split": <FaCut />,
    "Document Editor": <FaFile />,
    "URL Extractor": <FaLink />,
    "JSON Editor": <FaCode />,
    "Image Color Picker": <FaPalette />,
    "Regex Editor": <FaSearch />,
    "Cryptography Generator": <FaLock />,
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

// import React, { useState } from "react";
// import {
//   FaPenFancy,
//   FaVideo,
//   FaImage,
//   FaFileAlt,
//   FaMusic,
//   FaFilm,
//   FaCalculator,
//   FaCut,
//   FaFile,
//   FaLink,
//   FaCode,
//   FaPalette,
//   FaSearch,
//   FaLock,
//   FaMoon,
//   FaSun,
//   FaUser,
//   FaCog,
//   FaSignOutAlt,
// } from "react-icons/fa";
// import AnnotationPage from "@/pages/AnnotationsPage";

// interface SidebarProps {
//   menuData: any[];
//   onMenuClick: (menuName: string) => void;
//   selectedMenu: string;
// }

// const Sidebar: React.FC<SidebarProps> = ({
//   menuData,
//   onMenuClick,
//   selectedMenu,
// }) => {
//   const [openSubMenus, setOpenSubMenus] = useState<{
//     [key: string]: string | null;
//   }>({});
//   const [openSubSubMenus, setOpenSubSubMenus] = useState<{
//     [key: string]: string | null;
//   }>({});

//   const [isOpen, setIsOpen] = useState(true);
//   const [openMenu, setOpenMenu] = useState<string | null>(null);
//   const [isDarkMode, setIsDarkMode] = useState<boolean>(
//     localStorage.getItem("theme") === "dark"
//   );
//   const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

//   const handleMenuToggle = (menuName: string) => {
//     setOpenMenu((prev) => (prev === menuName ? null : menuName));
//   };

//   const handleIconClick = (menuName: string) => {
//     if (!isOpen) {
//       setIsOpen(true);
//     } else {
//       onMenuClick(menuName);
//     }
//   };

//   const toggleProfileMenu = () => {
//     setIsProfileMenuOpen(!isProfileMenuOpen);
//   };

//   const handleSubSubMenuToggle = (
//     menuName: string,
//     subFeatureName: string,
//     subSubFeatureName: string
//   ) => {
//     setOpenSubSubMenus((prev) => ({
//       ...prev,
//       [`${menuName}-${subFeatureName}`]:
//         prev[`${menuName}-${subFeatureName}`] === subSubFeatureName
//           ? null
//           : subSubFeatureName,
//     }));
//     console.log("subSubFeatureName ==", subSubFeatureName);
//   };

// const applyHoverStyles = (
//   e: React.MouseEvent<HTMLDivElement | HTMLAnchorElement, MouseEvent>
// ) => {
//   const element = e.currentTarget;
//   const isDarkMode = document.documentElement.classList.contains("dark");

//   element.style.backgroundColor = isDarkMode
//     ? "var(--hover-dark)"
//     : "var(--hover-blue)";
//   element.style.color = isDarkMode ? "var(--text-light)" : "white";
// };

// const resetHoverStyles = (
//   e: React.MouseEvent<HTMLDivElement | HTMLAnchorElement, MouseEvent>
// ) => {
//   const element = e.currentTarget;
//   const isDarkMode = document.documentElement.classList.contains("dark");

//   element.style.backgroundColor = "";
//   element.style.color = isDarkMode
//     ? "var(--default-light)"
//     : "var(--default-blue)";
// };

//   const handleSidebarToggle = () => {
//     if (!isOpen) {
//       setOpenMenu(null);
//     }
//     setIsOpen(!isOpen);
//   };
//   const handleSubMenuToggle = (menuName: string, subFeatureName: string) => {
//     setOpenSubMenus((prev) => ({
//       ...prev,
//       [menuName]: prev[menuName] === subFeatureName ? null : subFeatureName,
//     }));
//     console.log("subFeatureName ==", subFeatureName);
//     setOpenSubSubMenus({});
//   };

//   const toggleDarkMode = () => {
//     const newMode = !isDarkMode;
//     setIsDarkMode(newMode);
//     localStorage.setItem("theme", newMode ? "dark" : "light");
//     document.documentElement.classList.toggle("dark", newMode);
//   };

//   const getMenuIcon = (menuName: string) => {
//     const iconSize = isOpen ? "w-6 h-6" : "w-4 h-4";
//     const icons: { [key: string]: JSX.Element } = {
//       Annotations: <FaPenFancy className={iconSize} />,
//       "Image Editor": <FaImage className={iconSize} />,
//       "Text Editor": <FaFileAlt className={iconSize} />,
//       "Audio Editor": <FaMusic className={iconSize} />,
//       "Video Editor": <FaVideo className={iconSize} />,
//       "Numeric Data Editor": <FaCalculator className={iconSize} />,
//       "Dataset Split": <FaCut className={iconSize} />,
//       "Document Editor": <FaFile className={iconSize} />,
//       "URL Extractor": <FaLink className={iconSize} />,
//       "JSON Editor": <FaCode className={iconSize} />,
//       "Image Color Picker": <FaPalette className={iconSize} />,
//       "Regex Editor": <FaSearch className={iconSize} />,
//       "Cryptography Generator": <FaLock className={iconSize} />,
//     };
//     return icons[menuName] || <FaFileAlt className={iconSize} />;
//   };

//   const renderSubFeatures = (subFeatures: any[], menuName: string) => {
//     return (
//       <ul className="mt-2 space-y-1 px-4">
//         {subFeatures.map((subFeature: any, subIndex: number) => (
//           <li key={subIndex}>
//             <div>
//               <summary
//                 onClick={() => handleSubMenuToggle(menuName, subFeature.name)}
//                 onMouseOver={applyHoverStyles}
//                 onMouseOut={resetHoverStyles}
//                 className={`flex cursor-pointer items-center justify-${isOpen ? "start" : "center"} rounded-lg px-4 py-2 text-gray-800 dark:text-gray-200`}
//               >
//                 <span className={`${!isOpen && "hidden"} text-sm font-medium`}>
//                   {subFeature.name}
//                 </span>
//               </summary>
//               {openSubMenus[menuName] === subFeature.name &&
//                 subFeature.sub_features_1 && (
//                   <ul className="mt-2 space-y-1 px-4">
//                     {subFeature.sub_features_1.map(
//                       (subSubFeature: any, subSubIndex: number) => (
//                         <li key={subSubIndex}>
//                           <div>
//                             <summary
//                               onClick={() =>
//                                 handleSubSubMenuToggle(
//                                   menuName,
//                                   subFeature.name,
//                                   subSubFeature.name
//                                 )
//                               }
//                               onMouseOver={applyHoverStyles}
//                               onMouseOut={resetHoverStyles}
//                               className={`flex cursor-pointer items-center justify-${isOpen ? "start" : "center"} rounded-lg px-4 py-2 text-gray-800 dark:text-gray-200`}
//                             >
//                               <span
//                                 className={`${!isOpen && "hidden"} text-sm font-medium`}
//                               >
//                                 {subSubFeature.name}
//                               </span>
//                             </summary>
//                             {openSubSubMenus[
//                               `${menuName}-${subFeature.name}`
//                             ] === subSubFeature.name && (
//                               <ul className="mt-2 space-y-1 px-4">
//                                 {subSubFeature.sub_features_2?.map(
//                                   (point: any, pointIndex: number) => (
//                                     <li key={pointIndex}>
//                                       <a
//                                         href="#"
//                                         className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-200"
//                                         onClick={() => onMenuClick(point.name)}
//                                         onMouseOver={applyHoverStyles}
//                                         onMouseOut={resetHoverStyles}
//                                       >
//                                         {point.name}
//                                       </a>
//                                     </li>
//                                   )
//                                 )}
//                               </ul>
//                             )}
//                           </div>
//                         </li>
//                       )
//                     )}
//                   </ul>
//                 )}
//             </div>
//           </li>
//         ))}
//       </ul>
//     );
//   };

//   return (
//     <div
//       className={`flex h-screen flex-col justify-between border-e bg-white dark:bg-gray-900 transition-all duration-300 ${
//         isOpen ? "w-64" : "w-16"
//       }`}
//     >
//       <div
//         className="px-2 py-6"
//         style={{ overflowY: "auto", maxHeight: "calc(100vh - 96px)" }}
//       >
//         <div className="flex items-center justify-center">
//           <div
//             className="flex items-center cursor-pointer"
//             onClick={handleSidebarToggle}
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="1.5em"
//               height="1.5em"
//               viewBox="0 0 2048 2048"
//               fill="currentColor"
//               className="block text-[#699bf7] dark:text-blue-400"
//             >
//               <rect width="2048" height="2048" fill="none" />
//               <path
//                 fill="currentColor"
//                 d="M2048 640h-640V482L691 960l717 478v-158h640v640h-640v-328l-768-512v200H0V640h640v200l768-512V0h640zm-512 768v384h384v-384zM512 1152V768H128v384zM1536 128v384h384V128z"
//               />
//             </svg>
//             <span
//               className={`text-xl font-bold ml-2 text-gray-800 dark:text-gray-200 ${
//                 !isOpen && "hidden"
//               }`}
//             >
//               Data Studio
//             </span>
//           </div>
//         </div>

//   <ul className="mt-6 space-y-1">
//     {menuData.map((menuItem, index) => (
//       <li key={index}>
//         <div>
//           <summary
//             onClick={() => handleMenuToggle(menuItem.name)}
//             onMouseOver={applyHoverStyles}
//             onMouseOut={resetHoverStyles}
//             className={`flex cursor-pointer items-center justify-${
//               isOpen ? "start" : "center"
//             } rounded-lg px-2 py-2 text-gray-800 dark:text-gray-200`}
//           >
//             <span className="flex items-center">
//               <div
//                 className={`flex justify-${
//                   isOpen ? "start" : "center"
//                 } items-center`}
//                 onClick={() => handleIconClick(menuItem.name)}
//               >
//                 {getMenuIcon(menuItem.name)}
//               </div>
//               <span
//                 className={`${
//                   !isOpen && "hidden"
//                 } text-sm font-medium ml-2`}
//               >
//                 {menuItem.name}
//               </span>
//             </span>
//           </summary>
//           {openMenu === menuItem.name &&
//             menuItem.features &&
//             renderSubFeatures(menuItem.features, menuItem.name)}
//         </div>
//       </li>
//     ))}
//   </ul>
// </div>

//       {/* Footer Section: Dark Mode Toggle and Profile Info */}
//       <div className="flex flex-col items-start space-y-4 p-4 border-t border-gray-200 dark:border-gray-700">
//         {/* Dark Mode Toggle */}
//         <div className="flex items-center space-x-2">
//           <button
//             onClick={toggleDarkMode}
//             className="text-white bg-blue-500 hover:bg-blue-600 rounded-full p-2 transition duration-300"
//           >
//             {isDarkMode ? (
//               <FaSun className="w-5 h-5 text-yellow-400" />
//             ) : (
//               <FaMoon className="w-5 h-5" />
//             )}
//           </button>
//           {isOpen && (
//             <span className="text-sm text-gray-700 dark:text-gray-300">
//               {isDarkMode ? "Light Mode" : "Dark Mode"}
//             </span>
//           )}
//         </div>

//         {/* Profile Info */}
//         <div className="relative flex items-center space-x-2">
//           <button
//             onClick={toggleProfileMenu}
//             className="overflow-hidden rounded-full shadow-inner transition duration-300"
//           >
//             <img
//               src="https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
//               alt="Profile"
//               className="w-10 h-10 object-cover"
//             />
//           </button>
//           {isOpen && (
//             <div className="text-sm">
//               <p className="text-xs text-gray-800 dark:text-gray-200">
//                 Febri Dwi Putro
//               </p>
//               <p className="text-xs text-gray-800 dark:text-gray-200">
//                 putrodwifebri@gmail.com
//               </p>
//             </div>
//           )}
//           {isProfileMenuOpen && (
//             <div className="absolute bottom-full right-0 z-10 mb-2 w-48 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
//               <div className="p-2">
//                 <a
//                   href="#"
//                   className="flex items-center gap-2 block rounded-lg px-4 py-2 text-sm text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200"
//                 >
//                   <FaUser className="w-4 h-4" />
//                   Profile
//                 </a>
//                 <a
//                   href="#"
//                   className="flex items-center gap-2 block rounded-lg px-4 py-2 text-sm text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200"
//                 >
//                   <FaCog className="w-4 h-4" />
//                   Settings
//                 </a>
//                 <form method="POST" action="#">
//                   <button
//                     type="submit"
//                     className="flex items-center gap-2 w-full rounded-lg px-4 py-2 text-sm text-red-700 hover:bg-red-50 dark:hover:bg-red-700"
//                   >
//                     <FaSignOutAlt className="w-4 h-4" />
//                     Logout
//                   </button>
//                 </form>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;
