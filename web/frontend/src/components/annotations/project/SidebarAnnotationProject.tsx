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
        { name: "External Models", icon: faCube },
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