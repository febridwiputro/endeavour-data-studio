import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { RootState, AppDispatch } from "@/store/store";
import { fetchMenu } from "@/features/menu/menuSlice";
import CreateButton from "@/components/annotations/base/CreateButton";
import DefaultContent from "@/components/annotations/base/DefaultContent";
import CreateProjectModal from "@/components/annotations/CreateProjectModal";
import { useDarkMode } from "@/context/DarkModeContext";
import Sidebar from "@/components/sidebar/Sidebar";
import Breadcrumb from "@/components/Breadcrumb";
import { HomeIcon, FolderIcon } from "@heroicons/react/24/outline";

const AnnotationsPage: React.FC = () => {
  const { isDarkMode } = useDarkMode();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const { menu } = useSelector((state: RootState) => state.menu);

  const [showModal, setShowModal] = useState(false);
  const [selectedPage, setSelectedPage] = useState("AnnotationProjectPage");
  const [selectedMenu, setSelectedMenu] = useState<string>("Annotations");

  useEffect(() => {
    if (selectedPage === "AnnotationProjectPage" && router.pathname !== "/annotations") {
      router.push("/annotations");
    }
  }, [selectedPage, router]);

  useEffect(() => {
    if (!accessToken) {
      router.push("/login");
    } else {
      dispatch(fetchMenu());
    }
  }, [accessToken, dispatch, router]);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleMenuClick = (menuName: string) => {
    setSelectedMenu(menuName);
  };

  return (
    <div className={`max-h-screen flex transition-colors ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      {/* Sidebar tetap ada */}
      <Sidebar onMenuClick={handleMenuClick} selectedMenu={selectedMenu} menuData={menu} />

      {/* Main Content Wrapper */}
      <div className="flex flex-col flex-grow">
        {/* Breadcrumb & Buttons Section */}
        <div className="bg-white dark:bg-gray-800 shadow-sm px-3 flex justify-between items-center">
          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { label: "Home", href: "/home", icon: <HomeIcon className="w-4 h-4" /> },
              { label: "Annotations", href: "/annotations", icon: <FolderIcon className="w-4 h-4" />, isActive: true },
            ]}
          />

          {/* Buttons Section (Docs & Create) di pojok kanan */}
          <div className="flex items-center space-x-4">
            {/* Docs Button */}
            <a
              href="#docs"
              className={`flex items-center space-x-1 px-4 py-2 text-sm font-medium text-white ${isDarkMode ? "bg-blue-700" : "bg-[#1a4f9d]"} rounded-[8px] hover:opacity-90 transition`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m2 8H7a2 2 0 01-2-2V6a2 2 0 012-2h6l4 4v12a2 2 0 01-2 2z" />
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

        {/* Title "Annotations" dalam Card Putih */}
        <div className="px-2 py-2">
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg px-6 py-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-200">Annotations</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className={`flex-grow p-4 transition-colors ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-md rounded-md mx-2 mt-2`}>
          <div className="p-4">
            {showModal && <CreateProjectModal onClose={() => setShowModal(false)} />}
            <DefaultContent menuData={menu} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnotationsPage;






// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useRouter } from "next/router";
// import { RootState, AppDispatch } from "@/store/store";
// import { fetchMenu } from "@/features/menu/menuSlice";
// import CreateButton from "@/components/annotations/base/CreateButton";
// import DefaultContent from "@/components/annotations/base/DefaultContent";
// import CreateProjectModal from "@/components/annotations/CreateProjectModal";
// import { useDarkMode } from "@/context/DarkModeContext";
// import Sidebar from "@/components/sidebar/Sidebar";
// import Breadcrumb from "@/components/Breadcrumb";
// import { HomeIcon, FolderIcon } from "@heroicons/react/24/outline";

// const AnnotationsPage: React.FC = () => {
//   const { isDarkMode } = useDarkMode();
//   const router = useRouter();
//   const dispatch = useDispatch<AppDispatch>();
//   const { menu } = useSelector((state: RootState) => state.menu);

//   const [showModal, setShowModal] = useState(false);
//   const [selectedMenu, setSelectedMenu] = useState<string>("Annotations");

//   useEffect(() => {
//     dispatch(fetchMenu());
//   }, [dispatch]);

//   const handleOpenModal = () => {
//     setShowModal(true);
//   };

//   return (
//     <div className={`max-h-screen flex transition-colors ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
//       {/* Sidebar tetap ada */}
//       <Sidebar onMenuClick={setSelectedMenu} selectedMenu={selectedMenu} menuData={menu} />

//       {/* Main Content Wrapper */}
//       <div className="flex flex-col flex-grow">
        
//         {/* Breadcrumb + Buttons Section */}
//         <div className="bg-white dark:bg-gray-800 shadow-sm px-3 py-2 flex justify-between items-center">
//           {/* Breadcrumb */}
//           <Breadcrumb
//             items={[
//               { label: "Home", href: "/home", icon: <HomeIcon className="w-4 h-4" /> },
//               { label: "Annotations", href: "/annotations", icon: <FolderIcon className="w-4 h-4" />, isActive: true },
//             ]}
//           />

//           {/* Buttons Section di pojok kanan */}
//           <div className="flex items-center space-x-4">
//             {/* Docs Button */}
//             <a
//               href="#docs"
//               className={`flex items-center space-x-1 px-4 py-2 text-sm font-medium text-white ${isDarkMode ? "bg-blue-700" : "bg-[#1a4f9d]"} rounded-[8px] hover:opacity-90 transition`}
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m2 8H7a2 2 0 01-2-2V6a2 2 0 012-2h6l4 4v12a2 2 0 01-2 2z" />
//               </svg>
//               <span>Docs</span>
//             </a>

//             {/* Create Button */}
//             <CreateButton onClick={handleOpenModal} label="Create" />
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className={`flex-grow p-4 transition-colors ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-md rounded-md mx-2 mt-2`}>
//           <DefaultContent menuData={menu} />
//         </div>

//         {showModal && <CreateProjectModal onClose={() => setShowModal(false)} />}
//       </div>
//     </div>
//   );
// };

// export default AnnotationsPage;



// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useRouter } from "next/router";
// import { RootState, AppDispatch } from "@/store/store";
// import { fetchMenu } from "@/features/menu/menuSlice";
// import CreateButton from "@/components/annotations/base/CreateButton";
// import DefaultContent from "@/components/annotations/base/DefaultContent";
// import CreateProjectModal from "@/components/annotations/CreateProjectModal";
// import { useDarkMode } from "@/context/DarkModeContext";
// import Sidebar from "@/components/sidebar/Sidebar";
// import Breadcrumb from "@/components/Breadcrumb";
// import { HomeIcon, FolderIcon } from "@heroicons/react/24/outline";

// const AnnotationsPage: React.FC = () => {
//   const { isDarkMode } = useDarkMode();
//   const router = useRouter();

//   const dispatch = useDispatch<AppDispatch>();
//   const { accessToken } = useSelector((state: RootState) => state.auth);
//   const { menu } = useSelector((state: RootState) => state.menu);

//   const [showModal, setShowModal] = useState(false);
//   const [selectedPage, setSelectedPage] = useState("AnnotationProjectPage");
//   const [selectedMenu, setSelectedMenu] = useState<string>("Dashboard");


//   useEffect(() => {
//     // **Pindahkan URL ke "/annotations" jika page "AnnotationProjectPage" dipilih**
//     if (selectedPage === "AnnotationProjectPage" && router.pathname !== "/annotations") {
//       router.push("/annotations");
//     }
//   }, [selectedPage, router]);

//   const handleOpenModal = () => {
//     setShowModal(true);
//   };


//   const handleMenuClick = (menuName: string) => {
//     setSelectedMenu(menuName);
//   };

//   return (
//     <div className={`max-h-screen flex transition-colors ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
//       {/* Sidebar tetap ada */}
//       <Sidebar onMenuClick={handleMenuClick} selectedMenu={selectedMenu} menuData={menu} />

//       {/* Main Content Wrapper */}
//       <div className="flex flex-col flex-grow">

//         {/* Breadcrumb */}
//         <div className="bg-white dark:bg-gray-800 shadow-sm px-3">
//           <Breadcrumb
//             items={[
//               { label: "Home", href: "/home", icon: <HomeIcon className="w-4 h-4" /> },
//               { label: "Annotations", href: "/annotations", icon: <FolderIcon className="w-4 h-4" />, isActive: true },
//             ]}
//           />
//         </div>

//         {/* Main Content */}
//         <div className={`flex-grow p-4 transition-colors ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-md rounded-md mx-2 mt-2`}>
//           <div className="p-4">
//             <div className="flex items-center justify-between mb-4">
//               {/* Buttons Section */}
//               <div className="flex items-center space-x-4">
//                 {/* Docs Button */}
//                 <a
//                   href="#docs"
//                   className={`flex items-center space-x-1 px-4 py-2 text-sm font-medium text-white ${isDarkMode ? "bg-blue-700" : "bg-[#1a4f9d]"} rounded-[8px] hover:opacity-90 transition`}
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m2 8H7a2 2 0 01-2-2V6a2 2 0 012-2h6l4 4v12a2 2 0 01-2 2z" />
//                   </svg>
//                   <span>Docs</span>
//                 </a>

//                 {/* Dynamic Button */}
//                 {selectedPage === "AnnotationProjectPage" ? (
//                   <CreateButton onClick={handleOpenModal} label="Create Settings" />
//                 ) : (
//                   <CreateButton onClick={handleOpenModal} label="Create" />
//                 )}
//               </div>
//             </div>

//             {showModal && <CreateProjectModal onClose={() => setShowModal(false)} />}
//             <DefaultContent menuData={menu} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AnnotationsPage;



// import React, { useState } from "react";
// import Breadcrumb from "@/components/Breadcrumb";
// import CreateButton from "@/components/annotations/base/CreateButton";
// import DefaultContent from "@/components/annotations/base/DefaultContent";
// import CreateProjectModal from "@/components/annotations/CreateProjectModal";
// import ProjectSettingsModal from "@/components/annotations/project/settings/ProjectSettingsModal";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faHome, faFolder } from "@fortawesome/free-solid-svg-icons";
// import { useDarkMode } from "@/context/DarkModeContext";


// const AnnotationsPage: React.FC = () => {
//   const { isDarkMode } = useDarkMode();
//   const breadcrumbItems = [
//     { label: "Home", href: "/", icon: <FontAwesomeIcon icon={faHome} /> },
//     {
//       label: "Annotations",
//       href: "/annotations",
//       isActive: true,
//       icon: <FontAwesomeIcon icon={faFolder} />,
//     },
//     { label: "Details" },
//   ];

//   const [showModal, setShowModal] = useState(false);
//   const menuData = [{ name: "Category 1" }, { name: "Category 2" }];

//   const [selectedPage, setSelectedPage] = useState("AnnotationProjectPage");

//   const handleOpenModal = () => {
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//   };

//   return (
//     <div
//       className={`max-h-screen transition-colors ${
//         isDarkMode
//           ? "bg-gray-900 text-gray-200"
//           : "bg-white text-gray-800"
//       }`}
//     >
//       <div className="flex items-center justify-between mb-4">
//         <Breadcrumb items={breadcrumbItems} />

//         {/* Buttons Section */}
//         <div className="flex items-center space-x-4">
//           {/* Docs Button */}
//           <a
//             href="#docs"
//             className={`flex items-center space-x-1 px-4 py-2 text-sm font-medium text-white ${
//               isDarkMode ? "bg-blue-700" : "bg-[#1a4f9d]"
//             } rounded-[8px] hover:opacity-90 transition`}
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="w-4 h-4"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//               strokeWidth={2}
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M9 12h6m2 8H7a2 2 0 01-2-2V6a2 2 0 012-2h6l4 4v12a2 2 0 01-2 2z"
//               />
//             </svg>
//             <span>Docs</span>
//           </a>

//           {/* Dynamic Button */}
//           {selectedPage === "AnnotationProjectPage" ? (
//             <CreateButton onClick={handleOpenModal} label="Create Settings" />
//           ) : (
//             <CreateButton onClick={handleOpenModal} label="Create" />
//           )}
//         </div>
//       </div>

//       {showModal && <CreateProjectModal onClose={() => setShowModal(false)} />}
//       <DefaultContent menuData={menuData} />
//     </div>
//   );
// };

// export default AnnotationsPage;