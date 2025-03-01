import React, { JSX, useState } from "react";
import SidebarHeader from "./SidebarHeader";
import ProfileInfo from "./ProfileInfo";
import DarkModeToggle from "./DarkModeToggle";
import { useRouter } from "next/router";
import {
  AiFillHome,
  AiOutlineHighlight,
  AiOutlinePicture,
  AiOutlineFileText,
  AiOutlineAudio,
  AiOutlineVideoCamera,
  AiOutlineCalculator,
  AiOutlineScissor,
  AiOutlineFolderOpen,
  AiOutlineLink,
  AiOutlineCode,
  AiOutlineBgColors,
  AiOutlineSearch,
  AiOutlineLock,
  AiOutlinePieChart,
  AiOutlineCloudServer,
  AiOutlineGlobal,
  AiOutlineBarChart,
  AiOutlineBulb,
} from "react-icons/ai";

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
  const [isNavigating, setIsNavigating] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    typeof window !== "undefined" && localStorage.getItem("theme") === "dark"
  );
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleSidebarToggle = () => {
    setIsOpen(!isOpen);
  };

  const router = useRouter();

  const handleMenuClick = async (menuName: string) => {
    if (isNavigating) return; // Prevent multiple clicks during navigation
    setIsNavigating(true);

    try {
      onMenuClick(menuName); // Call parent handler
      const formattedMenuName = menuName.toLowerCase().replace(/ /g, "-");
      if (router.pathname !== `/${formattedMenuName}`) {
        await router.push(`/${formattedMenuName}`); // Only navigate if not already on the page
      }
    } finally {
      setIsNavigating(false); // Re-enable menu clicks after navigation
    }
  };

  const menuIcons: { [key: string]: JSX.Element } = {
    "Algorithm Explanation": <AiOutlineBulb />,
    Annotations: <AiOutlineHighlight />,
    "Audio Editor": <AiOutlineAudio />,
    "Cryptography Generator": <AiOutlineLock />,
    "Data Scraper": <AiOutlineCloudServer />,
    "Data Visualization": <AiOutlinePieChart />,
    "Dataset Split": <AiOutlineScissor />,
    "Document Editor": <AiOutlineFolderOpen />,
    Home: <AiFillHome />,
    "Image Color Picker": <AiOutlineBgColors />,
    "Image Editor": <AiOutlinePicture />,
    "JSON Editor": <AiOutlineCode />,
    "Numeric Data Editor": <AiOutlineCalculator />,
    "Regex Editor": <AiOutlineSearch />,
    "Statistical Analysis": <AiOutlineBarChart />,
    "Text Editor": <AiOutlineFileText />,
    "URL Extractor": <AiOutlineLink />,
    "Video Editor": <AiOutlineVideoCamera />,
    "Geospatial Data Editor": <AiOutlineGlobal />,
  };

  return (
    <div
      className={`relative flex h-screen flex-col justify-between border-e bg-white dark:bg-gray-900 transition-all duration-300 ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      <div className="px-4 py-6">
        <SidebarHeader
          isOpen={isOpen}
          handleSidebarToggle={handleSidebarToggle}
        />
        <div className="mt-6 space-y-2">
          {menuData.map((menu) => (
            <div
              key={menu.name}
              className={`relative group flex items-center ${
                isOpen ? "justify-start" : "justify-center"
              } px-4 py-2 text-sm font-medium cursor-pointer rounded-lg transition ${
                selectedMenu === menu.name
                  ? "bg-blue-100 text-blue-600"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
              onClick={() => handleMenuClick(menu.name)} // Ensure single execution
            >
              <span
                className={`flex-shrink-0 ${
                  selectedMenu === menu.name
                    ? "text-blue-600"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                {menuIcons[menu.name] &&
                  React.cloneElement(menuIcons[menu.name], {
                    className: "w-6 h-6",
                  })}
              </span>
              {isOpen && <span className="ml-3 truncate">{menu.name}</span>}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-start space-y-4 p-4 border-t border-gray-200 dark:border-gray-700">
        <DarkModeToggle
          isDarkMode={isDarkMode}
          toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          isOpen={isOpen}
        />
        <ProfileInfo
          isProfileMenuOpen={isProfileMenuOpen}
          toggleProfileMenu={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          isOpen={isOpen}
        />
      </div>
    </div>
  );
};

export default Sidebar;





// import React, { JSX, useState } from "react";
// import SidebarHeader from "./SidebarHeader";
// import ProfileInfo from "./ProfileInfo";
// import DarkModeToggle from "./DarkModeToggle";
// import {
//   AiFillHome,
//   AiOutlineHighlight,
//   AiOutlinePicture,
//   AiOutlineFileText,
//   AiOutlineAudio,
//   AiOutlineVideoCamera,
//   AiOutlineCalculator,
//   AiOutlineScissor,
//   AiOutlineFolderOpen,
//   AiOutlineLink,
//   AiOutlineCode,
//   AiOutlineBgColors,
//   AiOutlineSearch,
//   AiOutlineLock,
//   AiOutlinePieChart,
//   AiOutlineCloudServer,
//   AiOutlineGlobal,
// } from "react-icons/ai";

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
//   const [isOpen, setIsOpen] = useState(true);
//   const [isDarkMode, setIsDarkMode] = useState(
//     typeof window !== "undefined" && localStorage.getItem("theme") === "dark"
//   );
//   const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

//   const handleSidebarToggle = () => {
//     setIsOpen(!isOpen);
//   };

//   const menuIcons: { [key: string]: JSX.Element } = {
//     Home: <AiFillHome />,
//     Annotations: <AiOutlineHighlight />,
//     "Image Editor": <AiOutlinePicture />,
//     "Text Editor": <AiOutlineFileText />,
//     "Audio Editor": <AiOutlineAudio />,
//     "Video Editor": <AiOutlineVideoCamera />,
//     "Numeric Data Editor": <AiOutlineCalculator />,
//     "Dataset Split": <AiOutlineScissor />,
//     "Document Editor": <AiOutlineFolderOpen />,
//     "URL Extractor": <AiOutlineLink />,
//     "JSON Editor": <AiOutlineCode />,
//     "Image Color Picker": <AiOutlineBgColors />,
//     "Regex Editor": <AiOutlineSearch />,
//     "Cryptography Generator": <AiOutlineLock />,
//     "Data Visualization": <AiOutlinePieChart />,
//     "Data Scraper": <AiOutlineCloudServer />,
//     "Geospatial Data Editor": <AiOutlineGlobal />,
//   };

//   return (
//     <div
//       className={`relative flex h-screen flex-col justify-between border-e bg-white dark:bg-gray-900 transition-all duration-300 ${
//         isOpen ? "w-64" : "w-16"
//       }`}
//     >
//       <div className="px-4 py-6">
//         <SidebarHeader isOpen={isOpen} handleSidebarToggle={handleSidebarToggle} />
//         <div className="mt-6 space-y-2">
//           {menuData.map((menu) => (
//             <div
//               key={menu.name}
//               className={`relative group flex items-center ${
//                 isOpen ? "justify-start" : "justify-center"
//               } px-4 py-2 text-sm font-medium cursor-pointer rounded-lg transition ${
//                 selectedMenu === menu.name
//                   ? "bg-blue-100 text-blue-600"
//                   : "hover:bg-gray-200 dark:hover:bg-gray-700"
//               }`}
//               onClick={() => onMenuClick(menu.name)}
//             >
//               {/* Ensure icon color and size are consistent */}
//               <span
//                 className={`flex-shrink-0 ${
//                   selectedMenu === menu.name
//                     ? "text-blue-600"
//                     : "text-gray-600 dark:text-gray-400"
//                 }`}
//               >
//                 {menuIcons[menu.name] &&
//                   React.cloneElement(menuIcons[menu.name], {
//                     className: "w-6 h-6",
//                   })}
//               </span>
//               {isOpen && (
//                 <span className="ml-3 truncate">{menu.name}</span>
//               )}

//               {/* Tooltip for minimized sidebar */}
//               {!isOpen && (
//                 <div className="absolute left-full ml-2 hidden group-hover:flex items-center bg-blue-600/80 text-white text-xs rounded-md px-2 py-1">
//                   {menu.name}
//                   <div className="absolute left-[-4px] w-2 h-2 bg-blue-600/80 rotate-45"></div>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//       <div className="flex flex-col items-start space-y-4 p-4 border-t border-gray-200 dark:border-gray-700">
//         <DarkModeToggle
//           isDarkMode={isDarkMode}
//           toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
//           isOpen={isOpen}
//         />
//         <ProfileInfo
//           isProfileMenuOpen={isProfileMenuOpen}
//           toggleProfileMenu={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
//           isOpen={isOpen}
//         />
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

// import React, { JSX, useState } from "react";
// import SidebarHeader from "./SidebarHeader";
// import ProfileInfo from "./ProfileInfo";
// import DarkModeToggle from "./DarkModeToggle";
// import {
//   AiFillHome,
//   AiOutlineHighlight,
//   AiOutlinePicture,
//   AiOutlineFileText,
//   AiOutlineAudio,
//   AiOutlineVideoCamera,
//   AiOutlineCalculator,
//   AiOutlineScissor,
//   AiOutlineFolderOpen,
//   AiOutlineLink,
//   AiOutlineCode,
//   AiOutlineBgColors,
//   AiOutlineSearch,
//   AiOutlineLock,
//   AiOutlinePieChart,
//   AiOutlineCloudServer,
//   AiOutlineGlobal,
// } from "react-icons/ai";

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
//   const [isDarkMode, setIsDarkMode] = useState(
//     typeof window !== "undefined" && localStorage.getItem("theme") === "dark"
//   );
//   const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

//   const handleMenuToggle = (menuName: string) => {
//     setOpenMenu((prev) => (prev === menuName ? null : menuName));
//   };

//   const handleSidebarToggle = () => {
//     if (isOpen) {
//       setOpenMenu(null);
//       setOpenSubMenus({});
//       setOpenSubSubMenus({});
//     }
//     setIsOpen(!isOpen);
//   };

//   const handleMenuClickWrapper = (menuName: string) => {
//     onMenuClick(menuName);
//   };

//   const handleSubMenuToggle = (menuName: string, subFeatureName: string) => {
//     setOpenSubMenus((prev) => ({
//       ...prev,
//       [menuName]: prev[menuName] === subFeatureName ? null : subFeatureName,
//     }));
//     setOpenSubSubMenus({});
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
//   };

//   const toggleDarkMode = () => {
//     const newMode = !isDarkMode;
//     setIsDarkMode(newMode);
//     localStorage.setItem("theme", newMode ? "dark" : "light");
//     document.documentElement.classList.toggle("dark", newMode);
//   };

//   const toggleProfileMenu = () => {
//     setIsProfileMenuOpen(!isProfileMenuOpen);
//   };

//   const getMenuIcon = (menuName: string) => {
//     const iconSize = isOpen ? "w-6 h-6" : "w-4 h-4";
//     return menuIcons[menuName] || <AiOutlineFolderOpen className={iconSize} />;
//   };

//   const menuIcons: { [key: string]: JSX.Element } = {
//     Home: <AiFillHome className="w-6 h-6" />,
//     Annotations: <AiOutlineHighlight className="w-6 h-6" />,
//     "Image Editor": <AiOutlinePicture className="w-6 h-6" />,
//     "Text Editor": <AiOutlineFileText className="w-6 h-6" />,
//     "Audio Editor": <AiOutlineAudio className="w-6 h-6" />,
//     "Video Editor": <AiOutlineVideoCamera className="w-6 h-6" />,
//     "Numeric Data Editor": <AiOutlineCalculator className="w-6 h-6" />,
//     "Dataset Split": <AiOutlineScissor className="w-6 h-6" />,
//     "Document Editor": <AiOutlineFolderOpen className="w-6 h-6" />,
//     "URL Extractor": <AiOutlineLink className="w-6 h-6" />,
//     "JSON Editor": <AiOutlineCode className="w-6 h-6" />,
//     "Image Color Picker": <AiOutlineBgColors className="w-6 h-6" />,
//     "Regex Editor": <AiOutlineSearch className="w-6 h-6" />,
//     "Cryptography Generator": <AiOutlineLock className="w-6 h-6" />,
//     "Data Visualization": <AiOutlinePieChart className="w-6 h-6" />,
//     "Data Scraper": <AiOutlineCloudServer className="w-6 h-6" />,
//     "Geospatial Data Editor": <AiOutlineGlobal className="w-6 h-6" />,
//   };

//   return (
//     <div
//       className={`relative flex h-screen flex-col justify-between border-e bg-white dark:bg-gray-900 transition-all duration-300 ${
//         isOpen ? "w-50" : "w-16"
//       }`}
//     >
//       <div
//         className="px-2 py-6"
//         style={{ overflowY: "auto", maxHeight: "calc(100vh - 96px)" }}
//       >
//         <SidebarHeader
//           isOpen={isOpen}
//           handleSidebarToggle={handleSidebarToggle}
//         />
//         <div className="mt-6 space-y-2">
//           {menuData.map((menu) => (
//             <div
//               key={menu.name}
//               className={`flex items-center px-4 py-2 text-sm font-medium cursor-pointer rounded-lg transition ${
//                 selectedMenu === menu.name
//                   ? "bg-blue-100 text-blue-600"
//                   : "hover:bg-gray-200 dark:hover:bg-gray-700"
//               }`}
//               onClick={() => handleMenuClickWrapper(menu.name)}
//             >
//               {getMenuIcon(menu.name)}
//               {isOpen && <span className="ml-3">{menu.name}</span>}
//             </div>
//           ))}
//         </div>
//       </div>
//       <div className="flex flex-col items-start space-y-4 p-4 border-t border-gray-200 dark:border-gray-700">
//         <DarkModeToggle
//           isDarkMode={isDarkMode}
//           toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
//           isOpen={isOpen}
//         />
//         <ProfileInfo
//           isProfileMenuOpen={isProfileMenuOpen}
//           toggleProfileMenu={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
//           isOpen={isOpen}
//         />
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

// import React, { JSX, useState } from "react";
// import SidebarMenu from "./SidebarMenu";
// import SidebarHeader from "./SidebarHeader";
// import DarkModeToggle from "./DarkModeToggle";
// import ProfileInfo from "./ProfileInfo";
// // import {
// //   HomeIcon,
// //   PencilSquareIcon,
// //   PhotoIcon,
// //   DocumentTextIcon,
// //   MusicalNoteIcon,
// //   VideoCameraIcon,
// //   CalculatorIcon,
// //   ScissorsIcon,
// //   DocumentIcon,
// //   LinkIcon,
// //   CodeBracketIcon,
// //   PaintBrushIcon,
// //   MagnifyingGlassIcon,
// //   LockClosedIcon,
// // } from "@heroicons/react/24/outline"

// import {
//   FaHome,
//   FaPencilRuler,
//   FaEdit,
//   FaMusic,
//   FaFilm,
//   FaCalculator,
//   FaCut,
//   FaFileAlt,
//   FaLink,
//   FaProjectDiagram,
//   FaPalette,
//   FaSearchPlus,
//   FaLock,
//   FaChartPie,
//   FaNetworkWired,
//   FaGlobeAmericas,
// } from "react-icons/fa";

// import {
//   AiFillHome,
//   AiOutlineHighlight,
//   AiOutlinePicture,
//   AiOutlineFileText,
//   AiOutlineAudio,
//   AiOutlineVideoCamera,
//   AiOutlineCalculator,
//   AiOutlineScissor,
//   AiOutlineFolderOpen,
//   AiOutlineLink,
//   AiOutlineCode,
//   AiOutlineBgColors,
//   AiOutlineSearch,
//   AiFillLock,
//   AiOutlineBarChart,
//   AiOutlineCloudServer,
//   AiOutlineGlobal,
//   AiOutlinePieChart,
//   AiTwotonePieChart,
//   AiFillPieChart,
//   AiOutlineLock,
// } from "react-icons/ai";

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
//   const [isDarkMode, setIsDarkMode] = useState(
//     typeof window !== "undefined" && localStorage.getItem("theme") === "dark"
//   );
//   const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

//   const handleMenuToggle = (menuName: string) => {
//     setOpenMenu((prev) => (prev === menuName ? null : menuName));
//   };

//   const handleSidebarToggle = () => {
//     if (isOpen) {
//       // Close all menus when minimizing
//       setOpenMenu(null);
//       setOpenSubMenus({});
//       setOpenSubSubMenus({});
//     }
//     setIsOpen(!isOpen);
//   };

//   const handleMenuClick = (menuName: string) => {
//     if (!isOpen) {
//       // Maximize sidebar and auto-expand clicked menu
//       setIsOpen(true);
//       setOpenMenu(menuName);
//     } else {
//       // Expand or collapse menu as usual
//       setOpenMenu((prev) => (prev === menuName ? null : menuName));
//     }
//   };

//   const handleSubMenuToggle = (menuName: string, subFeatureName: string) => {
//     setOpenSubMenus((prev) => ({
//       ...prev,
//       [menuName]: prev[menuName] === subFeatureName ? null : subFeatureName,
//     }));
//     setOpenSubSubMenus({});
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
//   };

//   const toggleDarkMode = () => {
//     const newMode = !isDarkMode;
//     setIsDarkMode(newMode);
//     localStorage.setItem("theme", newMode ? "dark" : "light");
//     document.documentElement.classList.toggle("dark", newMode);
//   };

//   const toggleProfileMenu = () => {
//     setIsProfileMenuOpen(!isProfileMenuOpen);
//   };

//   const getMenuIcon = (menuName: string) => {
//     const iconSize = isOpen ? "w-6 h-6" : "w-4 h-4";
//     return (
//       <div className="cursor-pointer" onClick={() => handleMenuClick(menuName)}>
//         {menuIcons[menuName] || <AiOutlineFolderOpen className={iconSize} />}
//       </div>
//     );
//   };

//   const menuIcons: { [key: string]: JSX.Element } = {
//     Home: <AiFillHome className="w-6 h-6" />,
//     Annotations: <AiOutlineHighlight className="w-6 h-6" />,
//     "Image Editor": <AiOutlinePicture className="w-6 h-6" />,
//     "Text Editor": <AiOutlineFileText className="w-6 h-6" />,
//     "Audio Editor": <AiOutlineAudio className="w-6 h-6" />,
//     "Video Editor": <AiOutlineVideoCamera className="w-6 h-6" />,
//     "Numeric Data Editor": <AiOutlineCalculator className="w-6 h-6" />,
//     "Dataset Split": <AiOutlineScissor className="w-6 h-6" />,
//     "Document Editor": <AiOutlineFolderOpen className="w-6 h-6" />,
//     "URL Extractor": <AiOutlineLink className="w-6 h-6" />,
//     "JSON Editor": <AiOutlineCode className="w-6 h-6" />,
//     "Image Color Picker": <AiOutlineBgColors className="w-6 h-6" />,
//     "Regex Editor": <AiOutlineSearch className="w-6 h-6" />,
//     "Cryptography Generator": <AiOutlineLock className="w-6 h-6" />,
//     "Data Visualization": <AiOutlinePieChart className="w-6 h-6" />,
//     "Data Scraper": <AiOutlineCloudServer className="w-6 h-6" />,
//     "Geospatial Data Editor": <AiOutlineGlobal className="w-6 h-6" />,
//   };

//   // const menuIcons: { [key: string]: JSX.Element } = {
//   //   Home: <HomeIcon className="w-6 h-6" />,
//   //   Annotations: <PencilSquareIcon className="w-6 h-6" />,
//   //   "Image Editor": <PhotoIcon className="w-6 h-6" />,
//   //   "Text Editor": <DocumentTextIcon className="w-6 h-6" />,
//   //   "Audio Editor": <MusicalNoteIcon className="w-6 h-6" />,
//   //   "Video Editor": <VideoCameraIcon className="w-6 h-6" />,
//   //   "Numeric Data Editor": <CalculatorIcon className="w-6 h-6" />,
//   //   "Dataset Split": <ScissorsIcon className="w-6 h-6" />,
//   //   "Document Editor": <DocumentIcon className="w-6 h-6" />,
//   //   "URL Extractor": <LinkIcon className="w-6 h-6" />,
//   //   "JSON Editor": <CodeBracketIcon className="w-6 h-6" />,
//   //   "Image Color Picker": <PaintBrushIcon className="w-6 h-6" />,
//   //   "Regex Editor": <MagnifyingGlassIcon className="w-6 h-6" />,
//   //   "Cryptography Generator": <LockClosedIcon className="w-6 h-6" />,
//   //   "Data Visualization": <MagnifyingGlassIcon className="w-6 h-6" />,
//   //   "Data Scraper": <MagnifyingGlassIcon className="w-6 h-6" />,
//   //   "GeospatialDataEditor": <MagnifyingGlassIcon className="w-6 h-6" />,
//   // };

//   const applyHoverStyles = (
//     e: React.MouseEvent<HTMLDivElement | HTMLAnchorElement, MouseEvent>
//   ) => {
//     const element = e.currentTarget;
//     const isDarkMode = document.documentElement.classList.contains("dark");

//     element.style.backgroundColor = isDarkMode
//       ? "#1a4f9d"
//       : "var(--hover-blue)";
//     element.style.color = isDarkMode ? "white" : "var(--text-light)";
//   };

//   const resetHoverStyles = (
//     e: React.MouseEvent<HTMLDivElement | HTMLAnchorElement, MouseEvent>
//   ) => {
//     const element = e.currentTarget;
//     const isDarkMode = document.documentElement.classList.contains("dark");

//     element.style.backgroundColor = "";
//     element.style.color = isDarkMode
//       ? "var(--default-light)"
//       : "var(--default-blue)";
//   };

//   return (
//     <div
//       className={`relative flex h-screen flex-col justify-between border-e bg-white dark:bg-gray-900 transition-all duration-300 ${
//         isOpen ? "w-50" : "w-16"
//       }`}
//     >
//       <div
//         className="px-2 py-6"
//         style={{ overflowY: "auto", maxHeight: "calc(100vh - 96px)" }}
//       >
//         <SidebarHeader
//           isOpen={isOpen}
//           handleSidebarToggle={handleSidebarToggle}
//         />
//         <SidebarMenu
//           menuData={menuData}
//           onMenuClick={onMenuClick}
//           selectedMenu={selectedMenu}
//           openMenu={openMenu}
//           openSubMenus={openSubMenus}
//           openSubSubMenus={openSubSubMenus}
//           handleMenuToggle={handleMenuToggle}
//           handleSubMenuToggle={handleSubMenuToggle}
//           handleSubSubMenuToggle={handleSubSubMenuToggle}
//           getMenuIcon={getMenuIcon}
//           isOpen={isOpen}
//           applyHoverStyles={applyHoverStyles}
//           resetHoverStyles={resetHoverStyles}
//         />
//       </div>
//       <div className="flex flex-col items-start space-y-4 p-4 border-t border-gray-200 dark:border-gray-700">
//         <DarkModeToggle
//           isDarkMode={isDarkMode}
//           toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
//           isOpen={isOpen}
//         />
//         <ProfileInfo
//           isProfileMenuOpen={isProfileMenuOpen}
//           toggleProfileMenu={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
//           isOpen={isOpen}
//         />
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

// import React, { JSX, useState } from "react";
// import {
//   HomeIcon,
//   PencilSquareIcon,
//   PhotoIcon,
//   DocumentTextIcon,
//   MusicalNoteIcon,
//   VideoCameraIcon,
//   CalculatorIcon,
//   ScissorsIcon,
//   DocumentIcon,
//   LinkIcon,
//   CodeBracketIcon,
//   PaintBrushIcon,
//   MagnifyingGlassIcon,
//   LockClosedIcon,
// } from "@heroicons/react/24/outline";

// import SidebarHeader from "./SidebarHeader";
// import SidebarMenu from "./SidebarMenu";
// import DarkModeToggle from "./DarkModeToggle";
// import ProfileInfo from "./ProfileInfo";

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
//   const [isDarkMode, setIsDarkMode] = useState(
//     typeof window !== "undefined" && localStorage.getItem("theme") === "dark"
//   );
//   const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

//   const handleMenuToggle = (menuName: string) => {
//     setOpenMenu((prev) => (prev === menuName ? null : menuName));
//   };

//   const handleSidebarToggle = () => {
//     if (isOpen) {
//       // Close all menus when minimizing
//       setOpenMenu(null);
//       setOpenSubMenus({});
//       setOpenSubSubMenus({});
//     }
//     setIsOpen(!isOpen);
//   };

//   const handleMenuClick = (menuName: string) => {
//     if (!isOpen) {
//       // Maximize sidebar and auto-expand clicked menu
//       setIsOpen(true);
//       setOpenMenu(menuName);
//     } else {
//       // Expand or collapse menu as usual
//       setOpenMenu((prev) => (prev === menuName ? null : menuName));
//     }
//   };

//   const handleSubMenuToggle = (menuName: string, subFeatureName: string) => {
//     setOpenSubMenus((prev) => ({
//       ...prev,
//       [menuName]: prev[menuName] === subFeatureName ? null : subFeatureName,
//     }));
//     setOpenSubSubMenus({});
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
//   };

//   const toggleDarkMode = () => {
//     const newMode = !isDarkMode;
//     setIsDarkMode(newMode);
//     localStorage.setItem("theme", newMode ? "dark" : "light");
//     document.documentElement.classList.toggle("dark", newMode);
//   };

//   const toggleProfileMenu = () => {
//     setIsProfileMenuOpen(!isProfileMenuOpen);
//   };

//   const getMenuIcon = (menuName: string) => {
//     const iconSize = isOpen ? "w-6 h-6" : "w-4 h-4";
//     return (
//       <div className="cursor-pointer" onClick={() => handleMenuClick(menuName)}>
//         {menuIcons[menuName] || <DocumentTextIcon className={iconSize} />}
//       </div>
//     );
//   };

//   const menuIcons: { [key: string]: JSX.Element } = {
//     Home: <HomeIcon className="w-6 h-6" />,
//     Annotations: <PencilSquareIcon className="w-6 h-6" />,
//     "Image Editor": <PhotoIcon className="w-6 h-6" />,
//     "Text Editor": <DocumentTextIcon className="w-6 h-6" />,
//     "Audio Editor": <MusicalNoteIcon className="w-6 h-6" />,
//     "Video Editor": <VideoCameraIcon className="w-6 h-6" />,
//     "Numeric Data Editor": <CalculatorIcon className="w-6 h-6" />,
//     "Dataset Split": <ScissorsIcon className="w-6 h-6" />,
//     "Document Editor": <DocumentIcon className="w-6 h-6" />,
//     "URL Extractor": <LinkIcon className="w-6 h-6" />,
//     "JSON Editor": <CodeBracketIcon className="w-6 h-6" />,
//     "Image Color Picker": <PaintBrushIcon className="w-6 h-6" />,
//     "Regex Editor": <MagnifyingGlassIcon className="w-6 h-6" />,
//     "Cryptography Generator": <LockClosedIcon className="w-6 h-6" />,
//   };

//   const applyHoverStyles = (
//     e: React.MouseEvent<HTMLDivElement | HTMLAnchorElement, MouseEvent>
//   ) => {
//     const element = e.currentTarget;
//     const isDarkMode = document.documentElement.classList.contains("dark");

//     element.style.backgroundColor = isDarkMode
//       ? "#1a4f9d"
//       : "var(--hover-blue)";
//     element.style.color = isDarkMode ? "white" : "var(--text-light)";
//   };

//   const resetHoverStyles = (
//     e: React.MouseEvent<HTMLDivElement | HTMLAnchorElement, MouseEvent>
//   ) => {
//     const element = e.currentTarget;
//     const isDarkMode = document.documentElement.classList.contains("dark");

//     element.style.backgroundColor = "";
//     element.style.color = isDarkMode
//       ? "var(--default-light)"
//       : "var(--default-blue)";
//   };

//   return (
//     <div
//     className={`relative flex h-screen flex-col justify-between border-e bg-white dark:bg-gray-900 transition-all duration-300 ${
//         isOpen ? "w-30" : "w-16"
//       }`}
//     >
//       <div
//         className="px-2 py-6"
//         style={{ overflowY: "auto", maxHeight: "calc(100vh - 96px)" }}
//       >
//         <SidebarHeader
//           isOpen={isOpen}
//           handleSidebarToggle={handleSidebarToggle}
//         />
//         <SidebarMenu
//           menuData={menuData}
//           onMenuClick={onMenuClick}
//           selectedMenu={selectedMenu}
//           openMenu={openMenu}
//           openSubMenus={openSubMenus}
//           openSubSubMenus={openSubSubMenus}
//           handleMenuToggle={handleMenuToggle}
//           handleSubMenuToggle={handleSubMenuToggle}
//           handleSubSubMenuToggle={handleSubSubMenuToggle}
//           getMenuIcon={getMenuIcon}
//           isOpen={isOpen}
//           applyHoverStyles={applyHoverStyles}
//           resetHoverStyles={resetHoverStyles}
//         />
//       </div>
//       <div className="flex flex-col items-start space-y-4 p-4 border-t border-gray-200 dark:border-gray-700">
//         <DarkModeToggle
//           isDarkMode={isDarkMode}
//           toggleDarkMode={toggleDarkMode}
//           isOpen={isOpen}
//         />
//         <ProfileInfo
//           isProfileMenuOpen={isProfileMenuOpen}
//           toggleProfileMenu={toggleProfileMenu}
//           isOpen={isOpen}
//         />
//       </div>
//     </div>
//   );
// };

// export default Sidebar;
