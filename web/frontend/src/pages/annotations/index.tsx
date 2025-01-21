import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { RootState, AppDispatch } from "@/store/store";
import { fetchMenu } from "@/features/menu/menuSlice";
import Sidebar from "@/components/sidebar/Sidebar";
import Breadcrumb from "@/components/Breadcrumb";
import { HomeIcon, FolderIcon } from "@heroicons/react/24/outline";
import DefaultContent from "@/components/annotations/base/DefaultContent";
import AnnotationsProjectPage from "@/components/annotations/project/AnnotationsProjectPage";
import CreateButton from "@/components/annotations/base/CreateButton";
import { useDarkMode } from "@/context/DarkModeContext";

const AnnotationsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { menu } = useSelector((state: RootState) => state.menu);
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const { isDarkMode } = useDarkMode();

  const [showModal, setShowModal] = useState(false);
  const [selectedPage, setSelectedPage] = useState("AnnotationProjectPage");
  const [selectedAnnotation, setSelectedAnnotation] = useState<{
    name: string;
    project_photo_url?: string;
    annotation_type?: string;
  } | null>(null);
  const [selectedMenu, setSelectedMenu] = useState<string>("Annotations");

  useEffect(() => {
    if (!accessToken) {
      router.push("/login");
    } else {
      dispatch(fetchMenu());
    }
  }, [accessToken, dispatch, router]);

  // Read project name from URL & set selected project
  useEffect(() => {
    const projectName = router.query.project;
    if (projectName && typeof projectName === "string") {
      const foundAnnotation = menu.find(
        (m) => m.name.toLowerCase().replace(/\s+/g, "-") === projectName
      );
      if (foundAnnotation) {
        setSelectedAnnotation(foundAnnotation);
      }
    }
  }, [router.query.project, menu]);

  // Handle sidebar menu click
  const handleMenuClick = (menuName: string) => {
    setSelectedMenu(menuName);
    setSelectedAnnotation(null); // Reset selected project when switching menus
    router.push("/annotations"); // Ensure URL resets when switching menus
  };

  // Constructing Breadcrumb items
  const breadcrumbItems = [
    { label: "Home", href: "/home", icon: <HomeIcon className="w-4 h-4" /> },
    {
      label: "Annotations",
      href: "/annotations",
      icon: <FolderIcon className="w-4 h-4" />,
      isActive: !selectedAnnotation,
    },
    selectedAnnotation
      ? {
          label: selectedAnnotation.name,
          href: `/annotations/${selectedAnnotation.name.toLowerCase().replace(/\s+/g, "-")}`,
          isActive: true,
        }
      : null,
  ].filter(Boolean) as {
    label: string;
    href: string;
    icon?: React.ReactNode;
    isActive?: boolean;
  }[];

  const handleOpenModal = () => {
    setShowModal(true);
  };

  return (
    <div className="min-h-screen flex transition-colors bg-gray-100 dark:bg-gray-900">
      {/* ✅ Sidebar Now Always Visible */}
      <Sidebar onMenuClick={handleMenuClick} selectedMenu={selectedMenu} menuData={menu} />

      <div className="flex flex-col flex-grow">
        {/* ✅ Breadcrumb Positioned Like HomePage */}
        <div className="bg-white dark:bg-gray-800 shadow-sm px-3 flex justify-between items-center">
          <Breadcrumb items={breadcrumbItems} />

          {/* ✅ Docs & Create Buttons (Top-Right) */}
          <div className="flex items-center space-x-4">
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m2 8H7a2 2 0 01-2-2V6a2 2 0 012-2h6l4 4v12a2 2 0 01-2 2z" />
              </svg>
              <span>Docs</span>
            </a>

            {/* Dynamic Create Button */}
            {selectedPage === "AnnotationProjectPage" ? (
              <CreateButton onClick={handleOpenModal} label="Create Settings" />
            ) : (
              <CreateButton onClick={handleOpenModal} label="Create" />
            )}
          </div>
        </div>

        {/* ✅ Title "Annotations" in White Card (Like HomePage) */}
        <div className="px-2 py-2">
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg px-6 py-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-200">Annotations</h1>
          </div>
        </div>

        {/* ✅ Main Content Section */}
        <div className="flex-grow p-4 transition-colors bg-white dark:bg-gray-800 shadow-md rounded-md mx-2 mt-2">
          <div className="p-4">
            {selectedAnnotation ? (
              <AnnotationsProjectPage selectedAnnotation={selectedAnnotation} />
            ) : (
              <DefaultContent menuData={menu} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnotationsPage;
