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
  AiOutlinePlusCircle
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
  const [showSpeedDial, setShowSpeedDial] = useState(false);

  const handleSidebarToggle = () => {
    setIsOpen(!isOpen);
  };

  const router = useRouter();

  const handleMenuClick = async (menuName: string) => {
    if (isNavigating) return;
    setIsNavigating(true);

    try {
      onMenuClick(menuName);
      const formattedMenuName = menuName.toLowerCase().replace(/ /g, "-");
      if (router.pathname !== `/${formattedMenuName}`) {
        await router.push(`/${formattedMenuName}`);
      }
    } finally {
      setIsNavigating(false);
    }
  };

  const menuIcons: { [key: string]: JSX.Element } = {
    "Algorithm Explanation": <AiOutlineBulb />, "Annotations": <AiOutlineHighlight />, "Audio Editor": <AiOutlineAudio />, "Cryptography Generator": <AiOutlineLock />, "Data Scraper": <AiOutlineCloudServer />, "Data Visualization": <AiOutlinePieChart />, "Dataset Split": <AiOutlineScissor />, "Document Editor": <AiOutlineFolderOpen />, "Home": <AiFillHome />, "Image Color Picker": <AiOutlineBgColors />, "Image Editor": <AiOutlinePicture />, "JSON Editor": <AiOutlineCode />, "Numeric Data Editor": <AiOutlineCalculator />, "Regex Editor": <AiOutlineSearch />, "Statistical Analysis": <AiOutlineBarChart />, "Text Editor": <AiOutlineFileText />, "URL Extractor": <AiOutlineLink />, "Video Editor": <AiOutlineVideoCamera />, "Geospatial Data Editor": <AiOutlineGlobal />
  };

  return (
    <div
      className={`relative flex h-screen flex-col justify-between border-e bg-white dark:bg-gray-900 transition-all duration-300 ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      <div className="px-4 py-6 hidden md:block">
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
              onClick={() => handleMenuClick(menu.name)}
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
      <div className="md:hidden fixed bottom-6 right-6">
        <button
          className="bg-blue-600 p-4 rounded-full shadow-lg text-white"
          onClick={() => setShowSpeedDial(!showSpeedDial)}
        >
          <AiOutlinePlusCircle className="w-8 h-8" />
        </button>
        {showSpeedDial && (
          <div className="absolute bottom-16 right-0 flex flex-col space-y-2 bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg">
            {Object.keys(menuIcons).map((menuName) => (
              <button
                key={menuName}
                className="flex items-center space-x-2 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
                onClick={() => handleMenuClick(menuName)}
              >
                {menuIcons[menuName]}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {menuName}
                </span>
              </button>
            ))}
          </div>
        )}
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
// import { useRouter } from "next/router";
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
//   AiOutlineBarChart,
//   AiOutlineBulb,
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
//   const [isNavigating, setIsNavigating] = useState(false);
//   const [isDarkMode, setIsDarkMode] = useState(
//     typeof window !== "undefined" && localStorage.getItem("theme") === "dark"
//   );
//   const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

//   const handleSidebarToggle = () => {
//     setIsOpen(!isOpen);
//   };

//   const router = useRouter();

//   const handleMenuClick = async (menuName: string) => {
//     if (isNavigating) return; // Prevent multiple clicks during navigation
//     setIsNavigating(true);

//     try {
//       onMenuClick(menuName); // Call parent handler
//       const formattedMenuName = menuName.toLowerCase().replace(/ /g, "-");
//       if (router.pathname !== `/${formattedMenuName}`) {
//         await router.push(`/${formattedMenuName}`); // Only navigate if not already on the page
//       }
//     } finally {
//       setIsNavigating(false); // Re-enable menu clicks after navigation
//     }
//   };

//   const menuIcons: { [key: string]: JSX.Element } = {
//     "Algorithm Explanation": <AiOutlineBulb />,
//     Annotations: <AiOutlineHighlight />,
//     "Audio Editor": <AiOutlineAudio />,
//     "Cryptography Generator": <AiOutlineLock />,
//     "Data Scraper": <AiOutlineCloudServer />,
//     "Data Visualization": <AiOutlinePieChart />,
//     "Dataset Split": <AiOutlineScissor />,
//     "Document Editor": <AiOutlineFolderOpen />,
//     Home: <AiFillHome />,
//     "Image Color Picker": <AiOutlineBgColors />,
//     "Image Editor": <AiOutlinePicture />,
//     "JSON Editor": <AiOutlineCode />,
//     "Numeric Data Editor": <AiOutlineCalculator />,
//     "Regex Editor": <AiOutlineSearch />,
//     "Statistical Analysis": <AiOutlineBarChart />,
//     "Text Editor": <AiOutlineFileText />,
//     "URL Extractor": <AiOutlineLink />,
//     "Video Editor": <AiOutlineVideoCamera />,
//     "Geospatial Data Editor": <AiOutlineGlobal />,
//   };

//   return (
//     <div
//       className={`relative flex h-screen flex-col justify-between border-e bg-white dark:bg-gray-900 transition-all duration-300 ${
//         isOpen ? "w-64" : "w-16"
//       }`}
//     >
//       <div className="px-4 py-6">
//         <SidebarHeader
//           isOpen={isOpen}
//           handleSidebarToggle={handleSidebarToggle}
//         />
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
//               onClick={() => handleMenuClick(menu.name)}
//             >
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
//               {isOpen && <span className="ml-3 truncate">{menu.name}</span>}
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