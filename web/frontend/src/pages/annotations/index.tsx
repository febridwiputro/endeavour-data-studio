// pages/annotations/index.tsx

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { RootState, AppDispatch } from "@/store/store";
import { fetchMenu } from "@/features/menu/menuSlice";
import {
  fetchAnnotationFeatures,
  fetchProjectAnnotationsByType,
  setSelectedAnnotation,
} from "@/features/annotations/project/projectAnnotationSlice";
import Sidebar from "@/components/sidebar/Sidebar";
import Breadcrumb from "@/components/Breadcrumb";
import { HomeIcon, FolderIcon } from "@heroicons/react/24/outline";
import AnnotationsProjectPage from "@/components/annotations/project/AnnotationsProjectPage";
import CreateButton from "@/components/annotations/base/CreateButton";
import RenderCard from "@/components/annotations/base/RenderCard";
import DropdownSearch from "@/components/annotations/base/DropdownSearch";
import { useDarkMode } from "@/context/DarkModeContext";

const AnnotationsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { menu } = useSelector((state: RootState) => state.menu);
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const { annotationFeatures, selectedAnnotation } = useSelector(
    (state: RootState) => state.projectAnnotations
  );
  const { isDarkMode } = useDarkMode();

  const [selectedMenu, setSelectedMenu] = useState<string>("Annotations");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [annotationsByType, setAnnotationsByType] = useState<
    Record<string, any[]>
  >({});
  const [expandedTypes, setExpandedTypes] = useState<Record<string, boolean>>(
    {}
  );
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!accessToken) {
      router.push("/login");
    } else {
      dispatch(fetchMenu());
      dispatch(fetchAnnotationFeatures());
    }
  }, [accessToken, dispatch, router]);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  // // ✅ Auto-update URL saat `selectedAnnotation` tersedia
  // useEffect(() => {
  //   if (selectedAnnotation) {
  //     const formattedName = selectedAnnotation.name
  //       .toLowerCase()
  //       .replace(/\s+/g, "-");
  //     router.replace(`/annotations/${formattedName}`, undefined, {
  //       shallow: true,
  //     });
  //   }
  // }, [selectedAnnotation, router]);

  // ✅ Handle klik kategori untuk menampilkan daftar proyek (tanpa masuk ke proyek)
  const handleCategoryClick = (codeName: string) => {
    setExpandedTypes((prev) => ({
      ...prev,
      [codeName]: !prev[codeName],
    }));

    if (!annotationsByType[codeName]) {
      dispatch(fetchProjectAnnotationsByType(codeName))
        .unwrap()
        .then((response) => {
          setAnnotationsByType((prev) => ({
            ...prev,
            [codeName]: response.data || [],
          }));
        });
    }
  };

  // ✅ Handle klik proyek (gambar) agar URL diperbarui
  const handleAnnotationSelect = (annotation: any) => {
    dispatch(setSelectedAnnotation(annotation));
    localStorage.setItem("selectedAnnotation", JSON.stringify(annotation));
  };

  // ✅ Breadcrumb
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

  return (
    <div className="min-h-screen flex transition-colors bg-gray-100 dark:bg-gray-900">
      {/* ✅ Sidebar Tetap Muncul */}
      <Sidebar
        onMenuClick={() => {
          setSelectedMenu("Annotations");
          dispatch(setSelectedAnnotation(null));
          router.push("/annotations");
        }}
        selectedMenu={selectedMenu}
        menuData={menu}
      />

      <div className="flex flex-col flex-grow">
        {/* ✅ Breadcrumb Tetap Muncul */}
        <div className="bg-white dark:bg-gray-800 shadow-sm px-3 flex justify-between items-center">
          <Breadcrumb items={breadcrumbItems} />
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

            <CreateButton onClick={handleOpenModal} label="Create" />
          </div>
        </div>

        {/* ✅ Title: Hanya Tampilkan Jika Tidak Memilih Annotation */}
        {!selectedAnnotation && (
          <div className="px-2 py-2">
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg px-6 py-3">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-200">
                Annotations
              </h1>
            </div>
          </div>
        )}

        {/* ✅ Main Content */}
        <div className="flex-1 flex-col transition-colors bg-white dark:bg-gray-800 shadow-md rounded-md mx-2 mt-2">
          {selectedAnnotation ? (
            <AnnotationsProjectPage selectedAnnotation={selectedAnnotation} />
          ) : (
            <section className="flex-1 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 w-full">
              <div className="h-screen overflow-hidden flex">
                <div className="flex-1 overflow-auto px-6 py-4 sm:px-8 sm:py-6 lg:px-6 lg:py-6">
                  <DropdownSearch
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                  />
                  {annotationFeatures.map((type) => {
                    const {
                      code_name: codeName,
                      name: typeName,
                      logo_url,
                    } = type;
                    const isExpanded = expandedTypes[codeName] || false;
                    const annotations = annotationsByType[codeName] || [];

                    return (
                      <div key={codeName} className="mt-6">
                        <div
                          className="flex items-center justify-between cursor-pointer bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                          onClick={() => handleCategoryClick(codeName)}
                        >
                          <div className="flex items-center">
                            {logo_url && (
                              <img
                                src={logo_url}
                                alt={typeName}
                                className="h-8 w-8 mr-3 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (annotations.length > 0) {
                                    handleAnnotationSelect(annotations[0]);
                                  }
                                }}
                              />
                            )}
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                              {typeName}
                            </h3>
                          </div>
                          <span className="text-gray-500 dark:text-gray-400 text-sm">
                            {isExpanded ? "Hide" : "Show"}
                          </span>
                        </div>
                        {isExpanded && (
                          <div className="mt-4">
                            <RenderCard
                              annotations={annotations}
                              onClick={(id) =>
                                handleAnnotationSelect(
                                  annotations.find((a) => a.id === id)
                                )
                              }
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnnotationsPage;

// // pages/annotations/index.tsx

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useRouter } from "next/router";
// import { RootState, AppDispatch } from "@/store/store";
// import { fetchMenu } from "@/features/menu/menuSlice";
// import {
//   fetchAnnotationFeatures,
//   fetchProjectAnnotationsByType,
//   setSelectedAnnotation,
// } from "@/features/annotations/project/projectAnnotationSlice";
// import Sidebar from "@/components/sidebar/Sidebar";
// import Breadcrumb from "@/components/Breadcrumb";
// import { HomeIcon, FolderIcon } from "@heroicons/react/24/outline";
// import AnnotationsProject from "@/pages/annotations/[project]";
// import CreateButton from "@/components/annotations/base/CreateButton";
// import RenderCard from "@/components/annotations/base/RenderCard";
// import DropdownSearch from "@/components/annotations/base/DropdownSearch";
// import { useDarkMode } from "@/context/DarkModeContext";

// const AnnotationsPage: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const router = useRouter();
//   const { menu } = useSelector((state: RootState) => state.menu);
//   const { accessToken } = useSelector((state: RootState) => state.auth);
//   const { annotationFeatures, selectedAnnotation } = useSelector(
//     (state: RootState) => state.projectAnnotations
//   );
//   const { isDarkMode } = useDarkMode();

//   const [selectedMenu, setSelectedMenu] = useState<string>("Annotations");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
//   const [annotationsByType, setAnnotationsByType] = useState<Record<string, any[]>>({});
//   const [expandedTypes, setExpandedTypes] = useState<Record<string, boolean>>({});

//   useEffect(() => {
//     if (!accessToken) {
//       router.push("/login");
//     } else {
//       dispatch(fetchMenu());
//       dispatch(fetchAnnotationFeatures());
//     }
//   }, [accessToken, dispatch, router]);

//   // ✅ Handle klik kategori untuk menampilkan daftar proyek (tanpa masuk ke halaman proyek)
//   const handleCategoryClick = (codeName: string) => {
//     setExpandedTypes((prev) => ({
//       ...prev,
//       [codeName]: !prev[codeName],
//     }));

//     if (!annotationsByType[codeName]) {
//       dispatch(fetchProjectAnnotationsByType(codeName)).unwrap().then((response) => {
//         setAnnotationsByType((prev) => ({
//           ...prev,
//           [codeName]: response.data || [],
//         }));
//       });
//     }
//   };

//   // ✅ Handle klik gambar annotation agar tidak langsung pindah halaman
//   const handleAnnotationSelect = (annotation: any) => {
//     dispatch(setSelectedAnnotation(annotation));
//   };

//   return (
//     <div className="min-h-screen flex transition-colors bg-gray-100 dark:bg-gray-900">
//       <Sidebar
//         onMenuClick={() => {
//           setSelectedMenu("Annotations");
//           dispatch(setSelectedAnnotation(null));
//           router.push("/annotations");
//         }}
//         selectedMenu={selectedMenu}
//         menuData={menu}
//       />

//       <div className="flex flex-col flex-grow">
//         {/* ✅ Breadcrumb */}
//         <div className="bg-white dark:bg-gray-800 shadow-sm px-3 flex justify-between items-center">
//           <Breadcrumb
//             items={[
//               { label: "Home", href: "/home", icon: <HomeIcon className="w-4 h-4" /> },
//               { label: "Annotations", href: "/annotations", icon: <FolderIcon className="w-4 h-4" />, isActive: true },
//             ]}
//           />
//           <CreateButton onClick={() => console.log("Open Create Modal")} label="Create" />
//         </div>

//         {/* ✅ Jika `selectedAnnotation` tersedia, tampilkan halaman proyek */}
//         {selectedAnnotation ? (
//           <AnnotationsProject />
//         ) : (
//           <div className="flex-grow p-4 transition-colors bg-white dark:bg-gray-800 shadow-md rounded-md mx-2 mt-2">
//             <section className="flex-1 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 w-full">
//               <div className="h-screen overflow-hidden flex">
//                 <div className="flex-1 overflow-auto px-6 py-4 sm:px-8 sm:py-6 lg:px-10 lg:py-8">
//                   <DropdownSearch
//                     searchQuery={searchQuery}
//                     setSearchQuery={setSearchQuery}
//                     selectedCategory={selectedCategory}
//                     setSelectedCategory={setSelectedCategory}
//                   />
//                   {annotationFeatures.map((type) => {
//                     const { code_name: codeName, name: typeName, logo_url } = type;
//                     const isExpanded = expandedTypes[codeName] || false;
//                     const annotations = annotationsByType[codeName] || [];

//                     return (
//                       <div key={codeName} className="mt-6">
//                         {/* ✅ Klik kategori hanya menampilkan daftar proyek, bukan masuk ke proyek */}
//                         <div
//                           className="flex items-center justify-between cursor-pointer bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition"
//                           onClick={() => handleCategoryClick(codeName)}
//                         >
//                           <div className="flex items-center">
//                             {logo_url && (
//                               <img
//                                 src={logo_url}
//                                 alt={typeName}
//                                 className="h-8 w-8 mr-3"
//                               />
//                             )}
//                             <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
//                               {typeName}
//                             </h3>
//                           </div>
//                           <span className="text-gray-500 dark:text-gray-400 text-sm">
//                             {isExpanded ? "Hide" : "Show"}
//                           </span>
//                         </div>

//                         {/* ✅ Jika kategori diperluas, tampilkan daftar proyek */}
//                         {isExpanded && (
//                           <div className="mt-4">
//                             <RenderCard
//                               annotations={annotations}
//                               onClick={(id) =>
//                                 handleAnnotationSelect(
//                                   annotations.find((a) => a.id === id)
//                                 )
//                               }
//                             />
//                           </div>
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             </section>
//           </div>
//         )}
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
// import {
//   fetchAnnotationFeatures,
//   fetchProjectAnnotationsByType,
//   setSelectedAnnotation,
// } from "@/features/annotations/project/projectAnnotationSlice";
// import Sidebar from "@/components/sidebar/Sidebar";
// import Breadcrumb from "@/components/Breadcrumb";
// import { HomeIcon, FolderIcon } from "@heroicons/react/24/outline";
// import AnnotationsProjectPage from "@/components/annotations/project/AnnotationsProjectPage";
// import CreateButton from "@/components/annotations/base/CreateButton";
// import RenderCard from "@/components/annotations/base/RenderCard";
// import DropdownSearch from "@/components/annotations/base/DropdownSearch";
// import { useDarkMode } from "@/context/DarkModeContext";

// const AnnotationsPage: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const router = useRouter();
//   const { menu } = useSelector((state: RootState) => state.menu);
//   const { accessToken } = useSelector((state: RootState) => state.auth);
//   const { annotationFeatures, status, selectedAnnotation } = useSelector(
//     (state: RootState) => state.projectAnnotations
//   );
//   const { isDarkMode } = useDarkMode();

//   const [showModal, setShowModal] = useState(false);
//   const [selectedMenu, setSelectedMenu] = useState<string>("Annotations");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
//   const [annotationsByType, setAnnotationsByType] = useState<
//     Record<string, any[]>
//   >({});
//   const [loadingTypes, setLoadingTypes] = useState<Record<string, boolean>>({});
//   const [errorTypes, setErrorTypes] = useState<Record<string, boolean>>({});
//   const [expandedTypes, setExpandedTypes] = useState<Record<string, boolean>>(
//     {}
//   );

//   useEffect(() => {
//     if (!accessToken) {
//       router.push("/login");
//     } else {
//       dispatch(fetchMenu());
//       dispatch(fetchAnnotationFeatures());
//     }
//   }, [accessToken, dispatch, router]);

//   // ✅ Auto-update URL ketika annotation dipilih
//   useEffect(() => {
//     if (selectedAnnotation) {
//       const formattedName = selectedAnnotation.name
//         .toLowerCase()
//         .replace(/\s+/g, "-");
//       router.push(`/annotations/${formattedName}`);
//     }
//   }, [selectedAnnotation, router]);

//   // ✅ Menyesuaikan annotation berdasarkan URL
//   useEffect(() => {
//     const projectName = router.query.project;
//     if (projectName && typeof projectName === "string") {
//       const foundAnnotation = menu.find(
//         (m) => m.name.toLowerCase().replace(/\s+/g, "-") === projectName
//       );
//       if (foundAnnotation) {
//         dispatch(setSelectedAnnotation(foundAnnotation)); // ✅ Simpan ke Redux
//       }
//     }
//   }, [router.query.project, menu, dispatch]);

//   // ✅ Handle klik menu sidebar
//   const handleMenuClick = (menuName: string) => {
//     setSelectedMenu(menuName);
//     dispatch(setSelectedAnnotation(null)); // ✅ Reset selectedAnnotation saat pindah menu
//     router.push("/annotations");
//   };

//   // ✅ Handle klik annotation dari daftar
//   const handleAnnotationSelect = (annotation: any) => {
//     dispatch(setSelectedAnnotation(annotation)); // ✅ Simpan ke Redux
//     localStorage.setItem("selectedAnnotation", JSON.stringify(annotation)); // ✅ Simpan ke localStorage
//     const formattedName = annotation.name.toLowerCase().replace(/\s+/g, "-");
//     router.push(`/annotations/${formattedName}`); // ✅ Arahkan ke halaman proyek
//   };

//   // ✅ Expand kategori annotation
//   const toggleTypeExpansion = async (codeName: string) => {
//     setExpandedTypes((prev) => ({
//       ...prev,
//       [codeName]: !prev[codeName],
//     }));

//     if (!annotationsByType[codeName] && !loadingTypes[codeName]) {
//       setLoadingTypes((prev) => ({ ...prev, [codeName]: true }));
//       setErrorTypes((prev) => ({ ...prev, [codeName]: false }));

//       try {
//         const response = await dispatch(
//           fetchProjectAnnotationsByType(codeName)
//         ).unwrap();
//         setAnnotationsByType((prev) => ({
//           ...prev,
//           [codeName]: response.data || [],
//         }));
//       } catch (error) {
//         console.error(`Failed to fetch annotations for ${codeName}:`, error);
//         setErrorTypes((prev) => ({ ...prev, [codeName]: true }));
//       } finally {
//         setLoadingTypes((prev) => ({ ...prev, [codeName]: false }));
//       }
//     }
//   };

//   // ✅ Breadcrumb
//   const breadcrumbItems = [
//     { label: "Home", href: "/home", icon: <HomeIcon className="w-4 h-4" /> },
//     {
//       label: "Annotations",
//       href: "/annotations",
//       icon: <FolderIcon className="w-4 h-4" />,
//       isActive: !selectedAnnotation,
//     },
//     selectedAnnotation
//       ? {
//           label: selectedAnnotation.name,
//           href: `/annotations/${selectedAnnotation.name.toLowerCase().replace(/\s+/g, "-")}`,
//           isActive: true,
//         }
//       : null,
//   ].filter(Boolean) as {
//     label: string;
//     href: string;
//     icon?: React.ReactNode;
//     isActive?: boolean;
//   }[];

//   return (
//     <div className="min-h-screen flex transition-colors bg-gray-100 dark:bg-gray-900">
//       <Sidebar
//         onMenuClick={handleMenuClick}
//         selectedMenu={selectedMenu}
//         menuData={menu}
//       />

//       <div className="flex flex-col flex-grow">
//         {/* ✅ Breadcrumb */}
//         <div className="bg-white dark:bg-gray-800 shadow-sm px-3 flex justify-between items-center">
//           <Breadcrumb items={breadcrumbItems} />
//           <div className="flex items-center space-x-4">
//             <CreateButton onClick={() => setShowModal(true)} label="Create" />
//           </div>
//         </div>

//         {/* ✅ Title */}
//         <div className="px-2 py-2">
//           <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg px-6 py-3">
//             <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-200">
//               Annotations
//             </h1>
//           </div>
//         </div>

//         {/* ✅ Main Content */}
//         <div className="flex-grow p-4 transition-colors bg-white dark:bg-gray-800 shadow-md rounded-md mx-2 mt-2">
//           <div className="p-4">
//             {selectedAnnotation ? (
//               <AnnotationsProjectPage selectedAnnotation={selectedAnnotation} />
//             ) : (
//               <section className="flex-1 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 w-full">
//                 <div className="h-screen overflow-hidden flex">
//                   <div className="flex-1 overflow-auto px-6 py-4 sm:px-8 sm:py-6 lg:px-10 lg:py-8">
//                     <DropdownSearch
//                       searchQuery={searchQuery}
//                       setSearchQuery={setSearchQuery}
//                       selectedCategory={selectedCategory}
//                       setSelectedCategory={setSelectedCategory}
//                     />
//                     {annotationFeatures.map((type) => {
//                       const {
//                         code_name: codeName,
//                         name: typeName,
//                         logo_url,
//                       } = type;
//                       const isExpanded = expandedTypes[codeName] || false;
//                       const isLoading = loadingTypes[codeName];
//                       const hasError = errorTypes[codeName];
//                       const annotations = annotationsByType[codeName] || [];

//                       return (
//                         <div key={codeName} className="mt-6">
//                           <div
//                             className="flex items-center justify-between cursor-pointer bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition"
//                             onClick={() => toggleTypeExpansion(codeName)}
//                           >
//                             <div className="flex items-center">
//                               {logo_url && (
//                                 <img
//                                   src={logo_url}
//                                   alt={typeName}
//                                   className="h-8 w-8 mr-3 cursor-pointer"
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     if (annotations.length > 0) {
//                                       handleAnnotationSelect(annotations[0]);
//                                     }
//                                   }}
//                                 />
//                               )}
//                               <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
//                                 {typeName}
//                               </h3>
//                             </div>
//                             <span className="text-gray-500 dark:text-gray-400 text-sm">
//                               {isExpanded ? "Hide" : "Show"}
//                             </span>
//                           </div>
//                           {isExpanded && (
//                             <div className="mt-4">
//                               {isLoading ? (
//                                 <p>Loading...</p>
//                               ) : hasError ? (
//                                 <p className="text-red-500">
//                                   Error loading data.
//                                 </p>
//                               ) : (
//                                 <RenderCard
//                                   annotations={annotations}
//                                   onClick={(id) =>
//                                     handleAnnotationSelect(
//                                       annotations.find((a) => a.id === id)
//                                     )
//                                   }
//                                 />
//                               )}
//                             </div>
//                           )}
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               </section>
//             )}
//           </div>
//         </div>
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
// import { fetchAnnotationFeatures, fetchProjectAnnotationsByType } from "@/features/annotations/project/projectAnnotationSlice";
// import Sidebar from "@/components/sidebar/Sidebar";
// import Breadcrumb from "@/components/Breadcrumb";
// import { HomeIcon, FolderIcon } from "@heroicons/react/24/outline";
// import AnnotationsProjectPage from "@/components/annotations/project/AnnotationsProjectPage";
// import CreateButton from "@/components/annotations/base/CreateButton";
// import RenderCard from "@/components/annotations/base/RenderCard";
// import DropdownSearch from "@/components/annotations/base/DropdownSearch";
// import { useDarkMode } from "@/context/DarkModeContext";

// const AnnotationsPage: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const router = useRouter();
//   const { menu } = useSelector((state: RootState) => state.menu);
//   const { accessToken } = useSelector((state: RootState) => state.auth);
//   const { annotationFeatures, status } = useSelector((state: RootState) => state.projectAnnotations);
//   const { isDarkMode } = useDarkMode();

//   const [showModal, setShowModal] = useState(false);
//   const [selectedAnnotation, setSelectedAnnotation] = useState<{
//     name: string;
//     project_photo_url?: string;
//     annotation_type?: string;
//     code_name?: string;
//   } | null>(null);
//   const [selectedMenu, setSelectedMenu] = useState<string>("Annotations");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
//   const [annotationsByType, setAnnotationsByType] = useState<Record<string, any[]>>({});
//   const [loadingTypes, setLoadingTypes] = useState<Record<string, boolean>>({});
//   const [errorTypes, setErrorTypes] = useState<Record<string, boolean>>({});
//   const [expandedTypes, setExpandedTypes] = useState<Record<string, boolean>>({});

//   useEffect(() => {
//     if (!accessToken) {
//       router.push("/login");
//     } else {
//       dispatch(fetchMenu());
//       dispatch(fetchAnnotationFeatures());
//     }
//   }, [accessToken, dispatch, router]);

//   // ✅ Auto-update URL saat annotation dipilih
//   useEffect(() => {
//     if (selectedAnnotation) {
//       const formattedName = selectedAnnotation.name.toLowerCase().replace(/\s+/g, "-");
//       router.push(`/annotations/${formattedName}`);
//     }
//   }, [selectedAnnotation, router]);

//   // ✅ Menyesuaikan annotation berdasarkan URL
//   useEffect(() => {
//     const projectName = router.query.project;
//     if (projectName && typeof projectName === "string") {
//       const foundAnnotation = menu.find((m) => m.name.toLowerCase().replace(/\s+/g, "-") === projectName);
//       if (foundAnnotation) {
//         setSelectedAnnotation(foundAnnotation);
//       }
//     }
//   }, [router.query.project, menu]);

//   // ✅ Handle klik menu sidebar
//   const handleMenuClick = (menuName: string) => {
//     setSelectedMenu(menuName);
//     setSelectedAnnotation(null);
//     router.push("/annotations");
//   };

//   // ✅ Handle klik annotation dari daftar
//   const handleAnnotationSelect = (annotation: any) => {
//     setSelectedAnnotation(annotation);
//   };

//   // ✅ Expand kategori annotation
//   const toggleTypeExpansion = async (codeName: string) => {
//     setExpandedTypes((prev) => ({
//       ...prev,
//       [codeName]: !prev[codeName],
//     }));

//     if (!annotationsByType[codeName] && !loadingTypes[codeName]) {
//       setLoadingTypes((prev) => ({ ...prev, [codeName]: true }));
//       setErrorTypes((prev) => ({ ...prev, [codeName]: false }));

//       try {
//         const response = await dispatch(fetchProjectAnnotationsByType(codeName)).unwrap();
//         setAnnotationsByType((prev) => ({
//           ...prev,
//           [codeName]: response.data || [],
//         }));
//       } catch (error) {
//         console.error(`Failed to fetch annotations for ${codeName}:`, error);
//         setErrorTypes((prev) => ({ ...prev, [codeName]: true }));
//       } finally {
//         setLoadingTypes((prev) => ({ ...prev, [codeName]: false }));
//       }
//     }
//   };

//   // ✅ Breadcrumb
//   const breadcrumbItems = [
//     { label: "Home", href: "/home", icon: <HomeIcon className="w-4 h-4" /> },
//     { label: "Annotations", href: "/annotations", icon: <FolderIcon className="w-4 h-4" />, isActive: !selectedAnnotation },
//     selectedAnnotation ? { label: selectedAnnotation.name, href: `/annotations/${selectedAnnotation.name.toLowerCase().replace(/\s+/g, "-")}`, isActive: true } : null,
//   ].filter(Boolean) as { label: string; href: string; icon?: React.ReactNode; isActive?: boolean }[];

//   return (
//     <div className="min-h-screen flex transition-colors bg-gray-100 dark:bg-gray-900">
//       <Sidebar onMenuClick={handleMenuClick} selectedMenu={selectedMenu} menuData={menu} />

//       <div className="flex flex-col flex-grow">
//         {/* ✅ Breadcrumb */}
//         <div className="bg-white dark:bg-gray-800 shadow-sm px-3 flex justify-between items-center">
//           <Breadcrumb items={breadcrumbItems} />
//           <div className="flex items-center space-x-4">
//             <CreateButton onClick={() => setShowModal(true)} label="Create" />
//           </div>
//         </div>

//         {/* ✅ Title */}
//         <div className="px-2 py-2">
//           <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg px-6 py-3">
//             <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-200">Annotations</h1>
//           </div>
//         </div>

//         {/* ✅ Main Content */}
//         <div className="flex-grow p-4 transition-colors bg-white dark:bg-gray-800 shadow-md rounded-md mx-2 mt-2">
//           <div className="p-4">
//             {selectedAnnotation ? (
//               <AnnotationsProjectPage selectedAnnotation={selectedAnnotation} />
//             ) : (
//               <section className="flex-1 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 w-full">
//                 <div className="h-screen overflow-hidden flex">
//                   <div className="flex-1 overflow-auto px-6 py-4 sm:px-8 sm:py-6 lg:px-10 lg:py-8">
//                     <DropdownSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
//                     {annotationFeatures.map((type) => {
//                       const { code_name: codeName, name: typeName, logo_url } = type;
//                       const isExpanded = expandedTypes[codeName] || false;
//                       const isLoading = loadingTypes[codeName];
//                       const hasError = errorTypes[codeName];
//                       const annotations = annotationsByType[codeName] || [];

//                       return (
//                         <div key={codeName} className="mt-6">
//                           <div className="flex items-center justify-between cursor-pointer bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition" onClick={() => toggleTypeExpansion(codeName)}>
//                             <div className="flex items-center">
//                               {logo_url && <img src={logo_url} alt={typeName} className="h-8 w-8 mr-3" />}
//                               <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{typeName}</h3>
//                             </div>
//                             <span className="text-gray-500 dark:text-gray-400 text-sm">{isExpanded ? "Hide" : "Show"}</span>
//                           </div>

//                           {isExpanded && (
//                             <div className="mt-4">
//                               {isLoading ? <p>Loading...</p> : hasError ? <p className="text-red-500">Error loading data.</p> : <RenderCard annotations={annotations} onClick={(id) => handleAnnotationSelect(annotations.find((a) => a.id === id))} />}
//                             </div>
//                           )}
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               </section>
//             )}
//           </div>
//         </div>
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
// import Sidebar from "@/components/sidebar/Sidebar";
// import Breadcrumb from "@/components/Breadcrumb";
// import { HomeIcon, FolderIcon } from "@heroicons/react/24/outline";
// import DefaultContent from "@/components/annotations/base/DefaultContent";
// import AnnotationsProjectPage from "@/components/annotations/project/AnnotationsProjectPage";
// import CreateButton from "@/components/annotations/base/CreateButton";
// import { useDarkMode } from "@/context/DarkModeContext";

// const AnnotationsPage: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const router = useRouter();
//   const { menu } = useSelector((state: RootState) => state.menu);
//   const { accessToken } = useSelector((state: RootState) => state.auth);
//   const { isDarkMode } = useDarkMode();

//   const [showModal, setShowModal] = useState(false);
//   const [selectedMenu, setSelectedMenu] = useState<string>("Annotations");

//   // ✅ Ambil project dari URL (Dynamic Routing)
//   const projectName = router.query.project;
//   const selectedAnnotation = menu.find(
//     (m) => m.name.toLowerCase().replace(/\s+/g, "-") === projectName
//   );

//   useEffect(() => {
//     if (!accessToken) {
//       router.push("/login");
//     } else {
//       dispatch(fetchMenu());
//     }
//   }, [accessToken, dispatch, router]);

//   // ✅ Navigasi otomatis ketika `selectedAnnotation` berubah
//   const handleAnnotationSelect = (annotation: {
//     name: string;
//     project_photo_url?: string;
//     annotation_type?: string;
//     code_name?: string;
//   }) => {
//     const formattedName = annotation.name.toLowerCase().replace(/\s+/g, "-");
//     router.push(`/annotations/${formattedName}`);
//   };

//   // ✅ Handle Sidebar Click
//   const handleMenuClick = (menuName: string) => {
//     setSelectedMenu(menuName);
//     router.push("/annotations");
//   };

//   // ✅ Breadcrumb
//   const breadcrumbItems = [
//     { label: "Home", href: "/home", icon: <HomeIcon className="w-4 h-4" /> },
//     {
//       label: "Annotations",
//       href: "/annotations",
//       icon: <FolderIcon className="w-4 h-4" />,
//       isActive: !selectedAnnotation,
//     },
//     selectedAnnotation
//       ? {
//           label: selectedAnnotation.name,
//           href: `/annotations/${selectedAnnotation.name.toLowerCase().replace(/\s+/g, "-")}`,
//           isActive: true,
//         }
//       : null,
//   ].filter(Boolean) as {
//     label: string;
//     href: string;
//     icon?: React.ReactNode;
//     isActive?: boolean;
//   }[];

//   const handleOpenModal = () => {
//     setShowModal(true);
//   };

//   return (
//     <div className="min-h-screen flex transition-colors bg-gray-100 dark:bg-gray-900">
//       {/* ✅ Sidebar Always Visible */}
//       <Sidebar onMenuClick={handleMenuClick} selectedMenu={selectedMenu} menuData={menu} />

//       <div className="flex flex-col flex-grow">
//         {/* ✅ Breadcrumb Positioned Like HomePage */}
//         <div className="bg-white dark:bg-gray-800 shadow-sm px-3 flex justify-between items-center">
//           <Breadcrumb items={breadcrumbItems} />

//           <div className="flex items-center space-x-4">
//             <a
//               href="#docs"
//               className={`flex items-center space-x-1 px-4 py-2 text-sm font-medium text-white ${
//                 isDarkMode ? "bg-blue-700" : "bg-[#1a4f9d]"
//               } rounded-[8px] hover:opacity-90 transition`}
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m2 8H7a2 2 0 01-2-2V6a2 2 0 012-2h6l4 4v12a2 2 0 01-2 2z" />
//               </svg>
//               <span>Docs</span>
//             </a>

//             <CreateButton onClick={handleOpenModal} label="Create" />
//           </div>
//         </div>

//         {/* ✅ Title Section */}
//         <div className="px-2 py-2">
//           <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg px-6 py-3">
//             <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-200">Annotations</h1>
//           </div>
//         </div>

//         {/* ✅ Content Area */}
//         <div className="flex-grow p-4 transition-colors bg-white dark:bg-gray-800 shadow-md rounded-md mx-2 mt-2">
//           <div className="p-4">
//             {selectedAnnotation ? (
//               <AnnotationsProjectPage selectedAnnotation={selectedAnnotation} />
//             ) : (
//               <DefaultContent menuData={menu} onAnnotationSelect={handleAnnotationSelect} />
//             )}
//           </div>
//         </div>
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
// import Sidebar from "@/components/sidebar/Sidebar";
// import Breadcrumb from "@/components/Breadcrumb";
// import { HomeIcon, FolderIcon } from "@heroicons/react/24/outline";
// import DefaultContent from "@/components/annotations/base/DefaultContent";
// import AnnotationsProjectPage from "@/components/annotations/project/AnnotationsProjectPage";
// import CreateButton from "@/components/annotations/base/CreateButton";
// import { useDarkMode } from "@/context/DarkModeContext";

// const AnnotationsPage: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const router = useRouter();
//   const { menu } = useSelector((state: RootState) => state.menu);
//   const { accessToken } = useSelector((state: RootState) => state.auth);
//   const { isDarkMode } = useDarkMode();

//   const [showModal, setShowModal] = useState(false);
//   const [selectedAnnotation, setSelectedAnnotation] = useState<{
//     name: string;
//     project_photo_url?: string;
//     annotation_type?: string;
//     code_name?: string;
//   } | null>(null);
//   const [selectedMenu, setSelectedMenu] = useState<string>("Annotations");

//   useEffect(() => {
//     if (!accessToken) {
//       router.push("/login");
//     } else {
//       dispatch(fetchMenu());
//     }
//   }, [accessToken, dispatch, router]);

//   // Read project name from URL & set selected project
//   useEffect(() => {
//     const projectName = router.query.project;
//     if (projectName && typeof projectName === "string") {
//       const foundAnnotation = menu.find(
//         (m) => m.name.toLowerCase().replace(/\s+/g, "-") === projectName
//       );
//       if (foundAnnotation) {
//         setSelectedAnnotation(foundAnnotation);
//       }
//     }
//   }, [router.query.project, menu]);

//   // Handle sidebar menu click
//   const handleMenuClick = (menuName: string) => {
//     setSelectedMenu(menuName);
//     setSelectedAnnotation(null);
//     router.push("/annotations");
//   };

//   // ✅ Fungsi untuk menangani pemilihan annotation dari DefaultContent
//   const handleAnnotationSelect = (annotation: {
//     name: string;
//     project_photo_url?: string;
//     annotation_type?: string;
//     code_name?: string;
//   }) => {
//     setSelectedAnnotation(annotation);
//     const formattedName = annotation.name.toLowerCase().replace(/\s+/g, "-");
//     router.push(`/annotations/${formattedName}`);
//   };

//   // Constructing Breadcrumb items
//   const breadcrumbItems = [
//     { label: "Home", href: "/home", icon: <HomeIcon className="w-4 h-4" /> },
//     {
//       label: "Annotations",
//       href: "/annotations",
//       icon: <FolderIcon className="w-4 h-4" />,
//       isActive: !selectedAnnotation,
//     },
//     selectedAnnotation
//       ? {
//           label: selectedAnnotation.name,
//           href: `/annotations/${selectedAnnotation.name.toLowerCase().replace(/\s+/g, "-")}`,
//           isActive: true,
//         }
//       : null,
//   ].filter(Boolean) as {
//     label: string;
//     href: string;
//     icon?: React.ReactNode;
//     isActive?: boolean;
//   }[];

//   const handleOpenModal = () => {
//     setShowModal(true);
//   };

//   return (
//     <div className="min-h-screen flex transition-colors bg-gray-100 dark:bg-gray-900">
//       <Sidebar onMenuClick={handleMenuClick} selectedMenu={selectedMenu} menuData={menu} />

//       <div className="flex flex-col flex-grow">
//         <div className="bg-white dark:bg-gray-800 shadow-sm px-3 flex justify-between items-center">
//           <Breadcrumb items={breadcrumbItems} />

//           <div className="flex items-center space-x-4">
//             <a
//               href="#docs"
//               className={`flex items-center space-x-1 px-4 py-2 text-sm font-medium text-white ${
//                 isDarkMode ? "bg-blue-700" : "bg-[#1a4f9d]"
//               } rounded-[8px] hover:opacity-90 transition`}
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m2 8H7a2 2 0 01-2-2V6a2 2 0 012-2h6l4 4v12a2 2 0 01-2 2z" />
//               </svg>
//               <span>Docs</span>
//             </a>

//             <CreateButton onClick={handleOpenModal} label="Create" />
//           </div>
//         </div>

//         <div className="px-2 py-2">
//           <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg px-6 py-3">
//             <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-200">Annotations</h1>
//           </div>
//         </div>

//         <div className="flex-grow p-4 transition-colors bg-white dark:bg-gray-800 shadow-md rounded-md mx-2 mt-2">
//           <div className="p-4">
//             {selectedAnnotation ? (
//               <AnnotationsProjectPage selectedAnnotation={selectedAnnotation} />
//             ) : (
//               <DefaultContent menuData={menu} onAnnotationSelect={handleAnnotationSelect} />
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AnnotationsPage;
