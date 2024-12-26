import React, { useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import CreateButton from "@/components/annotations/base/CreateButton";
import DefaultContent from "@/components/annotations/base/DefaultContent";
import CreateProjectModal from "@/components/annotations/CreateProjectModal";
import ProjectSettingsModal from "@/components/annotations/project/settings/ProjectSettingsModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faFolder } from "@fortawesome/free-solid-svg-icons";
import { useDarkMode } from "@/context/DarkModeContext";


const AnnotationsPage: React.FC = () => {
  const { isDarkMode } = useDarkMode();
  const breadcrumbItems = [
    { label: "Home", href: "/", icon: <FontAwesomeIcon icon={faHome} /> },
    {
      label: "Annotations",
      href: "/annotations",
      icon: <FontAwesomeIcon icon={faFolder} />,
    },
    { label: "Details" }, // No icon
  ];

  const [showModal, setShowModal] = useState(false);
  const menuData = [{ name: "Category 1" }, { name: "Category 2" }];

  const [selectedPage, setSelectedPage] = useState("AnnotationProjectPage");

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div
      className={`min-h-screen transition-colors ${
        isDarkMode
          ? "bg-gray-900 text-gray-200"
          : "bg-white text-gray-800"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <Breadcrumb items={breadcrumbItems} />

        {/* Buttons Section */}
        <div className="flex items-center space-x-4">
          {/* Docs Button */}
          <a
            href="#docs"
            className={`flex items-center space-x-1 px-4 py-2 text-sm font-medium text-white ${
              isDarkMode ? "bg-blue-700" : "bg-[#1a4f9d]"
            } rounded-[8px] hover:opacity-90 transition`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m2 8H7a2 2 0 01-2-2V6a2 2 0 012-2h6l4 4v12a2 2 0 01-2 2z"
              />
            </svg>
            <span>Docs</span>
          </a>

          {/* Dynamic Button */}
          {selectedPage === "AnnotationProjectPage" ? (
            <CreateButton onClick={handleOpenModal} label="Create Settings" />
          ) : (
            <CreateButton onClick={handleOpenModal} label="Create" />
          )}
        </div>
      </div>

      {showModal && <CreateProjectModal onClose={() => setShowModal(false)} />}
      <DefaultContent menuData={menuData} />
    </div>
  );
};

export default AnnotationsPage;