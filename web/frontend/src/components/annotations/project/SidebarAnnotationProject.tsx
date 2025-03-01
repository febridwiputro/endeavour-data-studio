import React, { useState } from "react";
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  PencilIcon,
  TableCellsIcon,
  Squares2X2Icon,
  CubeIcon,
  EyeIcon,
  ServerStackIcon,
  AcademicCapIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  ChartBarSquareIcon,
  TagIcon,
} from "@heroicons/react/24/outline";

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  selectedAnnotation?: {
    name: string;
    project_photo_url?: string;
    annotation_type?: string;
    code_name?: string;
    sub_feature_2_name?: string;
  };
}

const SidebarAnnotationProject: React.FC<SidebarProps> = ({
  activePage,
  setActivePage,
  selectedAnnotation,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);

  const menuItems = [
    {
      category: "Data",
      items: [
        { name: "Upload Data", icon: ArrowUpTrayIcon },
        { name: "Annotate", icon: PencilIcon },
        { name: "Dataset", icon: TableCellsIcon, badge: "100" },
        { name: "Versions", icon: Squares2X2Icon, badge: "Train" },
        { name: "Analytics (EDA)", icon: ChartBarSquareIcon },
        { name: "Classes & Tags", icon: TagIcon },
      ],
    },
    {
      category: "Models",
      items: [
        { name: "Models", icon: CubeIcon },
        { name: "External Models", icon: CubeIcon },
        { name: "Visualize", icon: EyeIcon },
        { name: "Monitoring", icon: ServerStackIcon },
      ],
    },
    {
      category: "Deploy",
      items: [
        { name: "Deployments", icon: ServerStackIcon },
        { name: "Active Learning", icon: AcademicCapIcon },
      ],
    },
  ];

  const getButtonClass = (item: { name: string }) =>
    `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all w-[95%]
    ${
      activePage === item.name
        ? "bg-blue-100 text-[#1a4f9d] font-semibold px-2"
        : "text-gray-700"
    }
    hover:bg-[#e6f0ff] hover:text-[#1a4f9d] hover:shadow-md hover:pl-2`;

  return (
    <div
      className={`bg-gray-50 h-screen ${
        isMinimized ? "w-20" : "w-80"
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
            {selectedAnnotation?.code_name || "Annotation Feature"}
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
          {isMinimized ? (
            <ArrowsPointingOutIcon className="h-5 w-5" />
          ) : (
            <ArrowsPointingInIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Project Section */}
      <div className={`p-4 ${isMinimized ? "text-center" : ""}`}>
        <img
          src={
            selectedAnnotation?.project_photo_url ||
            "https://via.placeholder.com/150"
          }
          alt="Project"
          className={`rounded-lg ${
            isMinimized ? "mx-auto w-12 h-12" : "w-full h-32"
          } object-cover transition-all`}
        />
        {!isMinimized && (
          <div className="mt-3">
            <h1 className="text-base font-semibold text-gray-800">
              {selectedAnnotation?.name || "Project Name"}
            </h1>
            <p className="text-sm text-gray-500">
              {selectedAnnotation?.sub_feature_2_name || "-"}
            </p>
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
                  className={`${getButtonClass(item)} ${
                    isMinimized
                      ? "justify-center flex-col h-10 w-10 mx-auto"
                      : "justify-start flex-row"
                  } flex items-center`}
                  onClick={() => setActivePage(item.name)}
                  title={isMinimized ? item.name : undefined}
                >
                  <div className={`flex items-center justify-center`}>
                    <item.icon
                      className={`${
                        isMinimized ? "w-5 h-5" : "w-6 h-6"
                      } text-gray-500`}
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
