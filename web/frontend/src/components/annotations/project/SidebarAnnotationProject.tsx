import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpload,
  faPencilAlt,
  faTable,
  faCodeBranch,
  faCube,
  faEye,
  faServer,
  faBrain,
  faCompressAlt,
  faExpandAlt,
} from "@fortawesome/free-solid-svg-icons";

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

const SidebarAnnotationProject: React.FC<SidebarProps> = ({
  activePage,
  setActivePage,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);

  const menuItems = [
    {
      category: "Data",
      items: [
        { name: "Upload Data", icon: faUpload },
        { name: "Annotate", icon: faPencilAlt },
        { name: "Dataset", icon: faTable, badge: "100" },
        { name: "Versions", icon: faCodeBranch, badge: "Train" },
      ],
    },
    {
      category: "Models",
      items: [
        { name: "Models", icon: faCube },
        { name: "Visualize", icon: faEye },
      ],
    },
    {
      category: "Deploy",
      items: [
        { name: "Deployments", icon: faServer },
        { name: "Active Learning", icon: faBrain },
      ],
    },
  ];

  const getButtonClass = (item: string) =>
    `flex items-center px-4 py-2 text-sm font-medium rounded-lg transition 
    ${activePage === item ? "bg-[#e6f0ff] text-[#1a4f9d]" : "text-gray-700"} 
    hover:bg-[#e6f0ff] hover:text-[#1a4f9d]`;

  return (
    <div
      className={`bg-gray-50 h-screen ${
        isMinimized ? "w-20" : "w-72"
      } flex flex-col border-r border-gray-200 shadow transition-all duration-300`}
    >
      {/* Header Section */}
      <div
        className={`flex items-center ${
          isMinimized ? "justify-center" : "justify-between"
        } p-4 bg-gray-100 border-b border-gray-200`}
      >
        {/* Title */}
        {!isMinimized && (
          <h1 className="text-lg font-semibold text-gray-800">
            Computer Vision
          </h1>
        )}

        {/* Toggle Button */}
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className={`flex items-center justify-center ${
            isMinimized ? "w-10 h-10" : "w-8 h-8"
          } bg-white rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-200 focus:outline-none transition-all`}
          title={isMinimized ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <FontAwesomeIcon
            icon={isMinimized ? faExpandAlt : faCompressAlt}
            className="w-5 h-5"
          />
        </button>
      </div>

      {/* Project Section */}
      <div className={`p-4 ${isMinimized ? "text-center" : ""}`}>
        <img
          src="https://www.batamnews.co.id/foto_berita/2023/04/2023-04-10-kenapa-mobil-di-batam-tak-boleh-dibawa-keluar-pulau-batam-atau-mudik.jpeg"
          alt="Project"
          className={`rounded-lg ${
            isMinimized ? "mx-auto w-12 h-12" : "w-full h-32"
          } object-cover transition-all`}
        />
        {!isMinimized && (
          <div className="mt-3">
            <h1 className="text-base font-semibold text-gray-800">
              Automatic License Plate Recognition
            </h1>
            <p className="text-sm text-gray-500">Object Detection</p>
          </div>
        )}
      </div>

      <hr className="my-4" />

      {/* Menu Sections */}
      {menuItems.map((section) => (
        <div key={section.category}>
          <div
            className={`flex items-center px-4 ${
              isMinimized ? "justify-center" : "justify-start"
            } mb-3`}
          >
            {/* Category Text */}
            {!isMinimized && (
              <h2 className="text-xs font-semibold text-gray-500 uppercase">
                {section.category}
              </h2>
            )}
          </div>
          <ul className="space-y-2">
            {section.items.map((item) => (
              <li key={item.name}>
                <button
                  className={`${getButtonClass(
                    item.name
                  )} ${isMinimized ? "justify-center flex-col h-10 w-10 mx-auto" : "justify-start flex-row px-4 py-2"} flex items-center`}
                  onClick={() => setActivePage(item.name)}
                  title={isMinimized ? item.name : undefined}
                >
                  <div
                    className={`flex items-center justify-center ${
                      isMinimized ? "w-full h-full" : ""
                    }`}
                  >
                    <FontAwesomeIcon
                      icon={item.icon}
                      className={`${isMinimized ? "w-4 h-4" : "w-5 h-5"}`} // Reduced size for minimized icons
                    />
                  </div>
                  {!isMinimized && (
                    <>
                      <span className="ml-3 text-sm font-medium">
                        {item.name}
                      </span>
                      {item.badge && (
                        <span
                          className={`ml-auto text-xs font-medium rounded px-2 py-0.5 ${
                            item.badge === "Train"
                              ? "bg-[#d0e4ff] text-[#1a4f9d]"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </button>
              </li>
            ))}
          </ul>
          <hr className="my-4" />
        </div>
      ))}
    </div>
  );
};

export default SidebarAnnotationProject;

// import React, { useState } from "react";

// interface SidebarProps {
//   activePage: string;
//   setActivePage: (page: string) => void;
// }

// const SidebarAnnotationProject: React.FC<SidebarProps> = ({
//   activePage,
//   setActivePage,
// }) => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const menuItems = [
//     {
//       category: "Data",
//       items: [
//         {
//           name: "Upload Data",
//           icon: (
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="w-5 h-5 mr-3"
//               fill="none"
//               viewBox="0 0 24 24"
//               strokeWidth={2}
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M4 16L12 8L20 16"
//               />
//             </svg>
//           ),
//         },
//         {
//           name: "Annotate",
//           icon: (
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="w-5 h-5 mr-3"
//               fill="none"
//               viewBox="0 0 24 24"
//               strokeWidth={2}
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M9 12H15M12 15V9"
//               />
//             </svg>
//           ),
//         },
//         {
//           name: "Dataset",
//           icon: (
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="w-5 h-5 mr-3"
//               fill="none"
//               viewBox="0 0 24 24"
//               strokeWidth={2}
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M4 6H20M4 12H20M4 18H20"
//               />
//             </svg>
//           ),
//           badge: "100",
//         },
//         {
//           name: "Versions",
//           icon: (
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="w-5 h-5 mr-3"
//               fill="none"
//               viewBox="0 0 24 24"
//               strokeWidth={2}
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M9 18L15 12L9 6"
//               />
//             </svg>
//           ),
//           badge: "Train",
//         },
//       ],
//     },
//     {
//       category: "Models",
//       items: [
//         {
//           name: "Models",
//           icon: (
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="w-5 h-5 mr-3"
//               fill="none"
//               viewBox="0 0 24 24"
//               strokeWidth={2}
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M12 6L16.5 12H7.5L12 18"
//               />
//             </svg>
//           ),
//         },
//         {
//           name: "Visualize",
//           icon: (
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="w-5 h-5 mr-3"
//               fill="none"
//               viewBox="0 0 24 24"
//               strokeWidth={2}
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M12 8L16 12L12 16L8 12L12 8"
//               />
//             </svg>
//           ),
//         },
//       ],
//     },
//     {
//       category: "Deploy",
//       items: [
//         {
//           name: "Deployments",
//           icon: (
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="w-5 h-5 mr-3"
//               fill="none"
//               viewBox="0 0 24 24"
//               strokeWidth={2}
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M5 13L10 18L20 8"
//               />
//             </svg>
//           ),
//         },
//         {
//           name: "Active Learning",
//           icon: (
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="w-5 h-5 mr-3"
//               fill="none"
//               viewBox="0 0 24 24"
//               strokeWidth={2}
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M8 16L12 12L16 16M12 12V4"
//               />
//             </svg>
//           ),
//         },
//       ],
//     },
//   ];

//   const getButtonClass = (item: string) =>
//     `w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg
//     ${activePage === item ? "bg-[#e6f0ff] text-[#1a4f9d]" : "text-gray-700"}
//     hover:bg-[#e6f0ff] hover:text-[#1a4f9d] transition`;

//   return (
//     <div className="bg-gray-50 h-screen w-72 flex flex-col border-r border-gray-200 shadow">
//       {/* Project Section */}
//       <div className="p-4">
//         <img
//           src="https://www.batamnews.co.id/foto_berita/2023/04/2023-04-10-kenapa-mobil-di-batam-tak-boleh-dibawa-keluar-pulau-batam-atau-mudik.jpeg"
//           alt="Project"
//           className="rounded-lg w-full h-32 object-cover"
//         />
//         <div className="mt-3">
//           <h1 className="text-base font-semibold text-gray-800">
//             Automatic License Plate Recognition
//           </h1>
//           <p className="text-sm text-gray-500">Object Detection</p>
//         </div>
//       </div>

//       <hr className="my-4" />

//       {/* Menu Sections */}
//       {menuItems.map((section) => (
//         <div key={section.category}>
//           <h2 className="text-xs font-semibold text-gray-500 uppercase mb-3">
//             {section.category}
//           </h2>
//           <ul className="space-y-2">
//             {section.items.map((item) => (
//               <li key={item.name}>
//                 <button
//                   className={getButtonClass(item.name)}
//                   onClick={() => setActivePage(item.name)}
//                 >
//                   {item.icon}
//                   {item.name}
//                   {item.badge && (
//                     <span
//                       className={`ml-auto text-xs font-medium rounded px-2 py-0.5 ${item.badge === "Train" ? "bg-[#d0e4ff] text-[#1a4f9d]" : "bg-gray-200 text-gray-700"}`}
//                     >
//                       {item.badge}
//                     </span>
//                   )}
//                 </button>
//               </li>
//             ))}
//           </ul>
//           <hr className="my-4" />
//         </div>
//       ))}
//     </div>
//   );
// };

// export default SidebarAnnotationProject;

// import React, { useState } from "react";

// interface SidebarProps {
//     activePage: string;
//     setActivePage: (page: string) => void;
//   }

// const SidebarAnnotationProject: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {

//     const [isMenuOpen, setIsMenuOpen] = useState(false);
//     const [activeItem, setActiveItem] = useState("Upload Data"); // Default active item

//     const handleSetActive = (item: string) => {
//       setActiveItem(item);
//     };

//     const getButtonClass = (item: string) =>
//         `w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg
//         ${activePage === item ? "bg-[#e6f0ff] text-[#1a4f9d]" : "text-gray-700"}
//         hover:bg-[#e6f0ff] hover:text-[#1a4f9d] transition`;

//     const toggleMenu = () => {
//       setIsMenuOpen(!isMenuOpen);
//     };

//   return (
//     <div className="bg-gray-50 h-screen w-72 flex flex-col border-r border-gray-200 shadow">
//       {/* Project Section */}
//       <div className="p-4 relative">
//         <div className="flex flex-col items-center">
//           <img
//             src="https://www.batamnews.co.id/foto_berita/2023/04/2023-04-10-kenapa-mobil-di-batam-tak-boleh-dibawa-keluar-pulau-batam-atau-mudik.jpeg"
//             alt="Project"
//             className="rounded-lg w-full h-32 object-cover"
//           />
//           <div className="flex justify-between items-start mt-3 w-full">
//             <div>
//               <h1 className="text-base font-semibold text-gray-800">
//               Automatic License Plate Recognition
//               </h1>
//               <p className="text-sm text-gray-500">Object Detection</p>
//             </div>
//             <div className="relative">
//               <button
//                 className="text-gray-500 hover:text-gray-700 focus:outline-none"
//                 onClick={toggleMenu}
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   strokeWidth={2}
//                   stroke="currentColor"
//                   className="w-5 h-5"
//                 >
//                   <circle cx="12" cy="6" r="1.5" />
//                   <circle cx="12" cy="12" r="1.5" />
//                   <circle cx="12" cy="18" r="1.5" />
//                 </svg>
//               </button>
//               {isMenuOpen && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
//                   <ul className="py-1 text-sm text-gray-700">
//                     <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center">
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         strokeWidth={2}
//                         stroke="currentColor"
//                         className="w-5 h-5 mr-2"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           d="M15.75 9V5.25M15.75 5.25h3.75M15.75 5.25h-3.75M15.75 15v3.75M15.75 15h3.75M15.75 15h-3.75"
//                         />
//                       </svg>
//                       Copy Project Id
//                     </li>
//                     <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center">
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         strokeWidth={2}
//                         stroke="currentColor"
//                         className="w-5 h-5 mr-2"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           d="M4 7h16M4 12h16m-7 5h7"
//                         />
//                       </svg>
//                       Rename Project
//                     </li>
//                     <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center">
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         strokeWidth={2}
//                         stroke="currentColor"
//                         className="w-5 h-5 mr-2"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           d="M9 5v6m6-6v6m-4 8h2M10 20h4"
//                         />
//                       </svg>
//                       Make Public
//                     </li>
//                     <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center">
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         strokeWidth={2}
//                         stroke="currentColor"
//                         className="w-5 h-5 mr-2"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           d="M5 12h14M5 12a7 7 0 01-7-7 7 7 0 0114 0M5 12a7 7 0 017 7"
//                         />
//                       </svg>
//                       Project Overview
//                     </li>
//                     <hr />
//                     <li className="px-4 py-2 text-red-600 hover:bg-gray-100 cursor-pointer flex items-center">
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         strokeWidth={2}
//                         stroke="currentColor"
//                         className="w-5 h-5 mr-2"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           d="M6 18L18 6M6 6l12 12"
//                         />
//                       </svg>
//                       Delete Project
//                     </li>
//                   </ul>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       <hr className="my-4" />

//       {/* Navigation Sections */}
//       <nav className="flex-1 px-4">
//       {/* Data Section */}
//       <h2 className="text-xs font-semibold text-gray-500 uppercase mb-3">Data</h2>
//       <ul className="space-y-2">
//         <li>
//           <button
//               className={getButtonClass("Upload Data")}
//               onClick={() => setActivePage("Upload Data")}
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               strokeWidth={2}
//               stroke="currentColor"
//               className="w-5 h-5 mr-3"
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" d="M4 16L12 8L20 16" />
//             </svg>
//             Upload Data
//           </button>
//         </li>
//         <li>
//           <button
//               className={getButtonClass("Annotate")}
//               onClick={() => setActivePage("Annotate")}
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               strokeWidth={2}
//               stroke="currentColor"
//               className="w-5 h-5 mr-3"
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" d="M9 12H15M12 15V9" />
//             </svg>
//             Annotate
//           </button>
//         </li>
//         <li>
//           <button
//             className={getButtonClass("Dataset")}
//             onClick={() => setActivePage("Dataset")}
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               strokeWidth={2}
//               stroke="currentColor"
//               className="w-5 h-5 mr-3"
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" d="M4 6H20M4 12H20M4 18H20" />
//             </svg>
//             Dataset
//             <span className="ml-auto text-xs font-medium bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
//               100
//             </span>
//           </button>
//         </li>
//         <li>
//           <button
//               className={getButtonClass("Versions")}
//               onClick={() => setActivePage("Versions")}
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               strokeWidth={2}
//               stroke="currentColor"
//               className="w-5 h-5 mr-3"
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" d="M9 18L15 12L9 6" />
//             </svg>
//             Versions
//             <span className="ml-auto text-xs font-medium bg-[#d0e4ff] text-[#1a4f9d] px-2 py-0.5 rounded">
//               Train
//             </span>
//           </button>
//         </li>
//       </ul>

//       <hr className="my-4" />

//       {/* Models Section */}
//       <h2 className="text-xs font-semibold text-gray-500 uppercase mb-3">Models</h2>
//       <ul className="space-y-2">
//         <li>
//           <button
//               className={getButtonClass("Models")}
//               onClick={() => setActivePage("Models")}
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               strokeWidth={2}
//               stroke="currentColor"
//               className="w-5 h-5 mr-3"
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" d="M12 6L16.5 12H7.5L12 18" />
//             </svg>
//             Models
//           </button>
//         </li>
//         <li>
//           <button
//               className={getButtonClass("Visualize")}
//               onClick={() => setActivePage("Visualize")}
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               strokeWidth={2}
//               stroke="currentColor"
//               className="w-5 h-5 mr-3"
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" d="M12 8L16 12L12 16L8 12L12 8" />
//             </svg>
//             Visualize
//           </button>
//         </li>
//       </ul>

//       <hr className="my-4" />

//       {/* Deploy Section */}
//       <h2 className="text-xs font-semibold text-gray-500 uppercase mb-3">Deploy</h2>
//       <ul className="space-y-2">
//         <li>
//           <button
//               className={getButtonClass("Deployments")}
//               onClick={() => setActivePage("Deployments")}
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               strokeWidth={2}
//               stroke="currentColor"
//               className="w-5 h-5 mr-3"
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" d="M5 13L10 18L20 8" />
//             </svg>
//             Deployments
//           </button>
//         </li>
//         <li>
//           <button
//             className={getButtonClass("Active Learning")}
//             onClick={() => setActivePage("Active Learning")}
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               strokeWidth={2}
//               stroke="currentColor"
//               className="w-5 h-5 mr-3"
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" d="M8 16L12 12L16 16M12 12V4" />
//             </svg>
//             Active Learning
//           </button>
//         </li>
//       </ul>
//     </nav>
//     </div>
//   );
// };

// export default SidebarAnnotationProject;
