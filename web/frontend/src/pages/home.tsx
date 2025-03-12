import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { RootState, AppDispatch } from "@/store/store";
import Layout from "@/components/Layout";
import {
  HomeIcon,
  FolderIcon,
} from "@heroicons/react/24/outline";
import { fetchMenu } from "@/features/menu/menuSlice";
import dynamic from "next/dynamic";

// Dynamically import pages
const DashboardPage = dynamic(() => import("./dashboard"));
// const DashboardPage = dynamic(() => import("@/pages/dashboard"), { ssr: false });
const AnnotationsPage = dynamic(() => import("./annotations"));
const ImageColorPickerPage = dynamic(() => import("./image-color-picker"));
const DataVisualizationPage = dynamic(() => import("./data-visualization"));
const ImageEditorPage = dynamic(() => import("./image-editor"));
const AudioEditorPage = dynamic(() => import("./audio-editor"));
const TextEditorPage = dynamic(() => import("./text-editor"));
const NumericDataEditorPage = dynamic(() => import("./numeric-data-editor"));
const DocumentEditorPage = dynamic(() => import("./document-editor"));
const RegexEditorPage = dynamic(() => import("./regex-editor"));
const JsonEditorPage = dynamic(() => import("./json-editor"));
const URLExtractorPage = dynamic(() => import("./url-extractor"));
const DatasetSplitPage = dynamic(() => import("./dataset-split"));
const DataScraperPage = dynamic(() => import("./data-scraper"));
const CryptographyGeneratorPage = dynamic(
  () => import("./cryptography-generator")
);
const GeospatialDataEditorPage = dynamic(
  () => import("./geospatial-data-editor")
);
const StatisticalAnalysisPage = dynamic(() => import("./statistical-analysis"));
const AlgorithmExplanationPage = dynamic(
  () => import("./algorithm-explanation")
);
const VideoEditorPage = dynamic(() => import("./video-editor"));

const HomePage: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = useState<string>("Dashboard");
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { menu } = useSelector((state: RootState) => state.menu);

  useEffect(() => {
    dispatch(fetchMenu());
  }, [dispatch]);

  const handleMenuClick = (menuName: string) => {
    setSelectedMenu(menuName);
    const formattedMenuName = menuName.toLowerCase().replace(/ /g, "-");
    router.push(`/${formattedMenuName}`);
  };

  const renderPageContent = () => {
    const { pathname } = router;
    switch (pathname.replace("/", "").replace(/-/g, " ").toLowerCase()) {
      case "annotations":
        return <AnnotationsPage />;
      case "data visualization":
        return <DataVisualizationPage />;
      case "image color picker":
        return <ImageColorPickerPage />;
      case "image editor":
        return <ImageEditorPage />;
      case "audio editor":
        return <AudioEditorPage />;
      case "text editor":
        return <TextEditorPage />;
      case "numeric data editor":
        return <NumericDataEditorPage />;
      case "document editor":
        return <DocumentEditorPage />;
      case "regex editor":
        return <RegexEditorPage />;
      case "json editor":
        return <JsonEditorPage />;
      case "url extractor":
        return <URLExtractorPage />;
      case "dataset split":
        return <DatasetSplitPage />;
      case "data scraper":
        return <DataScraperPage />;
      case "cryptography generator":
        return <CryptographyGeneratorPage />;
      case "geospatial data editor":
        return <GeospatialDataEditorPage />;
      case "statistical analysis":
        return <StatisticalAnalysisPage />;
      case "algorithm explanation":
        return <AlgorithmExplanationPage />;
      case "video editor":
        return <VideoEditorPage />;
      default:
        return <DashboardPage onMenuClick={handleMenuClick} />;
    }
  };

  // Breadcrumb items based on current route
  const breadcrumbItems = [
    { label: "Home", href: "/", icon: <HomeIcon className="w-4 h-4" /> },
    ...(router.pathname !== "/"
      ? [
          {
            label: router.pathname
              .replace("/", "")
              .replace(/-/g, " "),
              // .toUpperCase(),
            href: router.pathname,
            icon: <FolderIcon className="w-4 h-4" />,
          },
        ]
      : []),
  ];

  return (
    <Layout
      menuData={menu}
      onMenuClick={(menuName) => {
        const formattedPath = menuName.toLowerCase().replace(/ /g, "-");
        if (router.pathname !== `/${formattedPath}`) {
          router.push(`/${formattedPath}`);
        }
      }}
      selectedMenu={router.pathname
        .replace("/", "")
        .replace(/-/g, " ")
        .toUpperCase()}
      breadcrumbItems={breadcrumbItems}
    >
      {renderPageContent()}
    </Layout>
  );
};

export default HomePage;




// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useRouter } from "next/router";
// import { RootState, AppDispatch } from "@/store/store";
// import Layout from "@/components/Layout";
// import { HomeIcon, FolderIcon } from "@heroicons/react/24/outline";
// import { fetchMenu } from "@/features/menu/menuSlice";
// import DashboardPage from "./dashboard";
// import AnnotationsPage from "./annotations";
// import ImageColorPickerPage from "./image-color-picker";
// import DataVisualizationPage from "./data-visualization/dashboard4";
// import Data from "./data-visualization/dashboard4";
// import ImageEditorPage from "./image-editor";
// import AudioEditorPage from "./audio-editor";
// import TextEditorPage from "./text-editor";
// import NumericDataEditorPage from "./numeric-data-editor";
// import DocumentEditorPage from "./document-editor";
// import RegexEditorPage from "./regex-editor";
// import JsonEditorPage from "./json-editor";
// import URLExtractorPage from "./url-extractor";
// import DatasetSplitPage from "./dataset-split";
// import DataScraperPage from "./data-scraper";
// import CryptographyGeneratorPage from "./cryptography-generator";
// import GeospatialDataEditorPage from "./geospatial-data-editor";
// import DataVisualization from "./data-visualization";
// import VideoEditorPage from "./video-editor";

// const HomePage: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const router = useRouter();
//   const { menu } = useSelector((state: RootState) => state.menu);
//   const { selectedAnnotation } = useSelector(
//     (state: RootState) => state.projectAnnotations
//   );

//   const [selectedMenu, setSelectedMenu] = useState<string>("Dashboard");

//   useEffect(() => {
//     dispatch(fetchMenu());
//   }, [dispatch]);

//   const handleMenuClick = (menuName: string) => {
//     setSelectedMenu(menuName);
//     const formattedMenuName = menuName.toLowerCase().replace(/ /g, "-");
//     router.push(`/${formattedMenuName}`);
//   };

//   const renderPageContent = () => {
//     switch (selectedMenu) {
//       case "Annotations":
//         return <AnnotationsPage />;
//       case "Data Visualization":
//         return <DataVisualizationPage />;
//       case "Image Color Picker":
//         return <ImageColorPickerPage />;
//       case "Image Editor":
//         return <ImageEditorPage />;
//       case "Video Editor":
//         return <VideoEditorPage/>;
//       case "Audio Editor":
//         return <AudioEditorPage />;
//       case "Text Editor":
//         return <TextEditorPage />;
//       case "Numeric Data Editor":
//         return <NumericDataEditorPage />;
//       case "Document Editor":
//         return <DocumentEditorPage />;
//       case "Regex Editor":
//         return <RegexEditorPage />;
//       case "JSON Editor":
//         return <JsonEditorPage />;
//       case "URL Extractor":
//         return <URLExtractorPage />;
//       case "Dataset Split":
//         return <DatasetSplitPage />;
//       case "Data Scraper":
//         return <DataScraperPage />;
//       case "Cryptography Generator":
//         return <CryptographyGeneratorPage />;
//       case "Geospatial Data Editor":
//         return <GeospatialDataEditorPage />;
//       default:
//         return <DashboardPage onMenuClick={handleMenuClick} />;
//     }
//   };

//   const breadcrumbItems = [
//     { label: "Home", href: "/", icon: <HomeIcon className="w-4 h-4" /> },
//     ...(selectedMenu !== "Dashboard"
//       ? [
//           {
//             label: selectedMenu,
//             href: `/${selectedMenu.toLowerCase().replace(/ /g, "-")}`,
//             icon: <FolderIcon className="w-4 h-4" />,
//             isActive: selectedMenu !== "Annotations" || !selectedAnnotation,
//           },
//         ]
//       : []),
//     ...(selectedAnnotation
//       ? [
//           {
//             label: selectedAnnotation.name,
//             href: "",
//             icon: <FolderIcon className="w-4 h-4" />,
//             isActive: true,
//           },
//         ]
//       : []),
//   ];

//   return (
//     <Layout
//       menuData={menu}
//       onMenuClick={handleMenuClick}
//       selectedMenu={selectedMenu}
//       breadcrumbItems={breadcrumbItems}
//     >
//       {renderPageContent()}
//     </Layout>
//   );
// };

// export default HomePage;

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useRouter } from "next/router";
// import { RootState, AppDispatch } from "@/store/store";
// import Sidebar from "@/components/sidebar/Sidebar";
// import Breadcrumb from "@/components/Breadcrumb";
// import { HomeIcon, FolderIcon } from "@heroicons/react/24/outline";
// import { fetchMenu } from "@/features/menu/menuSlice";
// import DashboardPage from "./dashboard";
// import AnnotationsPage from "./annotations";
// import ImageColorPickerPage from "./image-color-picker";
// import Dashboard from "./data-visualization/dashboard4";
// import ImageEditorPage from "./images-editor";
// import VideoEditor from "@/components/video/ConcatenateVideo";
// import AudioEditorPage from "./audio-editor";
// import TextEditorPage from "./text-editor";
// import NumericDataEditorPage from "./numeric-data-editor";
// import DocumentEditorPage from "./document-editor";
// import RegexEditorPage from "./regex-editor";
// import JsonEditorPage from "./json-editor";
// import URLExtractorPage from "./url-extractor";
// import DatasetSplitPage from "./dataset-split";
// import DataScraperPage from "./data-scraper";
// import CryptographyGeneratorPage from "./cryptography-generator";
// import GeospatialDataEditorPage from "./geospatial-data-editor";
// import DataVisualization from "./data-visualization";

// const HomePage: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const router = useRouter();
//   const { menu } = useSelector((state: RootState) => state.menu);
//   const { selectedAnnotation } = useSelector(
//     (state: RootState) => state.projectAnnotations
//   );

//   const [selectedMenu, setSelectedMenu] = useState<string>("Dashboard");

//   useEffect(() => {
//     dispatch(fetchMenu());
//   }, [dispatch]);

//   // Handle menu click: update state and navigate to the corresponding page
//   const handleMenuClick = (menuName: string) => {
//     setSelectedMenu(menuName);
//     const formattedMenuName = menuName.toLowerCase().replace(/ /g, "-");
//     router.push(`/${formattedMenuName}`);
//   };

//   // Render content for the active menu
//   const renderPageContent = () => {
//     switch (selectedMenu) {
//       case "Annotations":
//         return <AnnotationsPage />;
//       case "Data Visualization":
//         return <DataVisualization />;
//       case "Image Color Picker":
//         return <ImageColorPickerPage />;
//       case "Image Editor":
//         return <ImageEditorPage />;
//       case "Video Editor":
//         return <VideoEditor />;
//       case "Audio Editor":
//         return <AudioEditorPage />;
//       case "Text Editor":
//         return <TextEditorPage />;
//       case "Numeric Data Editor":
//         return <NumericDataEditorPage />;
//       case "Document Editor":
//         return <DocumentEditorPage />;
//       case "Regex Editor":
//         return <RegexEditorPage />;
//       case "JSON Editor":
//         return <JsonEditorPage />;
//       case "URL Extractor":
//         return <URLExtractorPage />;
//       case "Dataset Split":
//         return <DatasetSplitPage />;
//       case "Data Scraper":
//         return <DataScraperPage />;
//       case "Cryptography Generator":
//         return <CryptographyGeneratorPage />;
//       case "Geospatial Data Editor":
//         return <GeospatialDataEditorPage />;
//       default:
//         return <DashboardPage onMenuClick={handleMenuClick} />;
//     }
//   };

//   // Breadcrumb items based on the selected menu
//   const breadcrumbItems = [
//     { label: "Home", href: "/", icon: <HomeIcon className="w-4 h-4" /> },
//     ...(selectedMenu !== "Dashboard"
//       ? [
//           {
//             label: selectedMenu,
//             href: `/${selectedMenu.toLowerCase().replace(/ /g, "-")}`,
//             icon: <FolderIcon className="w-4 h-4" />,
//             isActive: selectedMenu !== "Annotations" || !selectedAnnotation,
//           },
//         ]
//       : []),
//     ...(selectedAnnotation
//       ? [
//           {
//             label: selectedAnnotation.name,
//             href: "",
//             icon: <FolderIcon className="w-4 h-4" />,
//             isActive: true,
//           },
//         ]
//       : []),
//   ];

//   return (
//     <div className="flex h-screen">
//       <Sidebar
//         menuData={menu}
//         onMenuClick={handleMenuClick}
//         selectedMenu={selectedMenu}
//       />
//       <div className="flex flex-col flex-grow">
//         {/* Breadcrumb */}
//         <div className="bg-white shadow-sm px-3">
//           <Breadcrumb items={breadcrumbItems} />
//         </div>

//         {/* Page Content */}
//         <div className="flex-grow bg-gray-100">{renderPageContent()}</div>
//       </div>
//     </div>
//   );
// };

// export default HomePage;

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useRouter } from "next/router";
// import { RootState, AppDispatch } from "@/store/store";
// import Sidebar from "@/components/sidebar/Sidebar";
// import Breadcrumb from "@/components/Breadcrumb";
// import { HomeIcon, FolderIcon } from "@heroicons/react/24/outline";
// import { fetchMenu } from "@/features/menu/menuSlice";
// import DashboardPage from "./dashboard";
// import AnnotationsPage from "./annotations";
// import ImageColorPickerPage from "./image-color-picker";
// import Dashboard from "./data-visualization/dashboard4";
// import ImageEditorPage from "./images-editor";
// import VideoEditor from "@/components/video/ConcatenateVideo";
// import AudioEditorPage from "./audio-editor";
// import TextEditorPage from "./text-editor";
// import NumericDataEditorPage from "./numeric-data-editor";
// import DocumentEditorPage from "./document-editor";
// import RegexEditorPage from "./regex-editor";
// import JsonEditorPage from "./json-editor";
// import URLExtractorPage from "./url-extractor";
// import DatasetSplitPage from "./dataset-split";
// import DataScraperPage from "./data-scraper";
// import CryptographyGeneratorPage from "./cryptography-generator";
// import GeospatialDataEditorPage from "./geospatial-data-editor";
// import DataVisualization from "./data-visualization";

// const HomePage: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const router = useRouter();
//   const { menu } = useSelector((state: RootState) => state.menu);
//   const { selectedAnnotation } = useSelector(
//     (state: RootState) => state.projectAnnotations
//   );

//   const [selectedMenu, setSelectedMenu] = useState<string>("Dashboard");

//   useEffect(() => {
//     dispatch(fetchMenu());
//   }, [dispatch]);

//   const handleMenuClick = (menuName: string) => {
//     setSelectedMenu(menuName);
//   };

//   const renderPageContent = () => {
//     switch (selectedMenu) {
//       case "Annotations":
//         return <AnnotationsPage />;
//       case "Data Visualization":
//         return <DataVisualization />;
//       case "Image Color Picker":
//         return <ImageColorPickerPage />;
//       case "Image Editor":
//         return <ImageEditorPage />;
//       case "Video Editor":
//         return <VideoEditor />;
//       case "Audio Editor":
//         return <AudioEditorPage />;
//       case "Text Editor":
//         return <TextEditorPage />;
//       case "Numeric Data Editor":
//         return <NumericDataEditorPage />;
//       case "Document Editor":
//         return <DocumentEditorPage />;
//       case "Regex Editor":
//         return <RegexEditorPage />;
//       case "JSON Editor":
//         return <JsonEditorPage />;
//       case "URL Extractor":
//         return <URLExtractorPage />;
//       case "Dataset Split":
//         return <DatasetSplitPage />;
//       case "Data Scraper":
//         return <DataScraperPage />;
//       case "Cryptography Generator":
//         return <CryptographyGeneratorPage />;
//       case "Geospatial Data Editor":
//         return <GeospatialDataEditorPage />;
//       default:
//         return <DashboardPage onMenuClick={handleMenuClick} />;
//     }
//   };

//   const breadcrumbItems = [
//     { label: "Home", href: "/", icon: <HomeIcon className="w-4 h-4" /> },
//     ...(selectedMenu !== "Dashboard"
//       ? [
//           {
//             label: selectedMenu,
//             href: `/${selectedMenu.toLowerCase().replace(/ /g, "-")}`,
//             icon: <FolderIcon className="w-4 h-4" />,
//             isActive: selectedMenu !== "Annotations" || !selectedAnnotation,
//           },
//         ]
//       : []),
//     ...(selectedAnnotation
//       ? [
//           {
//             label: selectedAnnotation.name,
//             href: "",
//             icon: <FolderIcon className="w-4 h-4" />,
//             isActive: true,
//           },
//         ]
//       : []),
//   ];

//   return (
//     <div className="flex h-screen">
//       <Sidebar
//         menuData={menu}
//         onMenuClick={handleMenuClick}
//         selectedMenu={selectedMenu}
//       />
//       <div className="flex flex-col flex-grow">
//         {/* Breadcrumb */}
//         <div className="bg-white shadow-sm px-3">
//           <Breadcrumb items={breadcrumbItems} />
//         </div>

//         {/* Page Content */}
//         <div className="flex-grow bg-gray-100">{renderPageContent()}</div>
//       </div>
//     </div>
//   );
// };

// export default HomePage;

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useRouter } from "next/router";
// import { RootState, AppDispatch } from "@/store/store";
// import Sidebar from "@/components/sidebar/Sidebar";
// import Breadcrumb from "@/components/Breadcrumb";
// import {
//   HomeIcon,
//   FolderIcon,
// } from "@heroicons/react/24/outline";
// import { fetchMenu } from "@/features/menu/menuSlice";
// import DashboardPage from "./dashboard";
// import AnnotationsPage from "./annotations";
// import ImageColorPickerPage from "./image-color-picker";
// import Dashboard from "./data-visualization/dashboard4";
// import ImageEditorPage from "./images-editor";
// import VideoEditor from "@/components/video/ConcatenateVideo";
// import AudioEditorPage from "./audio-editor";
// import TextEditorPage from "./text-editor";
// import NumericDataEditorPage from "./numeric-data-editor";
// import DocumentEditorPage from "./document-editor";
// import RegexEditorPage from "./regex-editor";
// import JsonEditorPage from "./json-editor";
// import URLExtractorPage from "./url-extractor";
// import DatasetSplitPage from "./dataset-split";
// import DataScraperPage from "./data-scraper";
// import CryptographyGeneratorPage from "./cryptography-generator";
// import GeospatialDataEditorPage from "./geospatial-data-editor";
// import DataVisualization from "./data-visualization";

// const HomePage: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const router = useRouter();
//   const { menu } = useSelector((state: RootState) => state.menu);

//   const [selectedMenu, setSelectedMenu] = useState<string>("Dashboard");

//   useEffect(() => {
//     dispatch(fetchMenu());
//   }, [dispatch]);

//   const handleMenuClick = (menuName: string) => {
//     setSelectedMenu(menuName);
//   };

//   const renderPageContent = () => {
//     switch (selectedMenu) {
//       case "Annotations":
//         return <AnnotationsPage />;
//       case "Data Visualization":
//         return <DataVisualization />;
//       case "Image Color Picker":
//         return <ImageColorPickerPage />;
//       case "Image Editor":
//         return <ImageEditorPage />;
//       case "Video Editor":
//         return <VideoEditor />;
//       case "Audio Editor":
//         return <AudioEditorPage />;
//       case "Text Editor":
//         return <TextEditorPage />;
//       case "Numeric Data Editor":
//         return <NumericDataEditorPage />;
//       case "Document Editor":
//         return <DocumentEditorPage />;
//       case "Regex Editor":
//         return <RegexEditorPage />;
//       case "JSON Editor":
//         return <JsonEditorPage />;
//       case "URL Extractor":
//         return <URLExtractorPage />;
//       case "Dataset Split":
//         return <DatasetSplitPage />;
//       case "Data Scraper":
//         return <DataScraperPage />;
//       case "Cryptography Generator":
//         return <CryptographyGeneratorPage />;
//       case "Geospatial Data Editor":
//         return <GeospatialDataEditorPage />;
//       default:
//         return <DashboardPage onMenuClick={handleMenuClick} />;
//     }
//   };

//   return (
//     <div className="flex h-screen">
//       <Sidebar
//         menuData={menu}
//         onMenuClick={handleMenuClick}
//         selectedMenu={selectedMenu}
//       />
//       <div className="flex flex-col flex-grow">
//         {/* Breadcrumb */}
//         <div className="bg-white shadow-sm px-3">
//           <Breadcrumb
//             items={[
//               { label: "Home", href: "/", icon: <HomeIcon className="w-4 h-4" /> },
//               ...(selectedMenu !== "Dashboard"
//                 ? [
//                     {
//                       label: selectedMenu,
//                       href: `/${selectedMenu.toLowerCase().replace(/ /g, "-")}`,
//                       icon: <FolderIcon className="w-4 h-4" />,
//                       isActive: true,
//                     },
//                   ]
//                 : []),
//             ]}
//           />
//         </div>

//         {/* Page Content */}
//         <div className="flex-grow bg-gray-100">{renderPageContent()}</div>
//       </div>
//     </div>
//   );
// };

// export default HomePage;

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useRouter } from "next/router";
// import { fetchMenu } from "@/features/menu/menuSlice";
// import { RootState, AppDispatch } from "@/store/store";
// import Sidebar from "@/components/sidebar/Sidebar";
// import VideoToImage from "@/components/video/VideoToImage";
// import ConcatenateVideo from "@/components/video/ConcatenateVideo";
// import CompressImagesInFolder from "@/components/images/CompressImagesInFolder";
// import ImageSizeAdjustment from "@/components/images/ImageSizeAdjusment";
// import { useDarkMode } from "@/context/DarkModeContext";
// import Breadcrumb from "@/components/Breadcrumb";
// import { HomeIcon, FolderIcon } from "@heroicons/react/24/outline";
// import DashboardMenu from "@/components/dashboard/DashboardMenu";
// import DashboardPage from "./dashboard";
// // import AnnotationsPage from "@/pages/annotations";
// import AnnotationsPage from "./annotations";
// import ImageColorPickerPage from "./image-color-picker";
// import Dashboard from "./data-visualization/dashboard4";
// import ImageEditorPage from "./images-editor";
// import VideoEditor from "@/components/video/ConcatenateVideo";
// import AudioEditorPage from "./audio-editor";
// import TextEditorPage from "./text-editor";
// import NumericDataEditorPage from "./numeric-data-editor";
// import DocumentEditorPage from "./document-editor";
// import RegexEditorPage from "./regex-editor";
// import JsonEditorPage from "./json-editor";
// import URLExtractorPage from "./url-extractor";
// import DatasetSplitPage from "./dataset-split";
// import DataScraperPage from "./data-scraper";
// import CryptographyGeneratorPage from "./cryptography-generator";
// import GeospatialDataEditorPage from "./geospatial-data-editor";

// const HomePage: React.FC = () => {
//   const { isDarkMode } = useDarkMode();
//   const dispatch = useDispatch<AppDispatch>();
//   const router = useRouter();
//   const { accessToken } = useSelector((state: RootState) => state.auth);
//   const { menu } = useSelector((state: RootState) => state.menu);

//   const [selectedMenu, setSelectedMenu] = useState<string>("Dashboard");

//   useEffect(() => {
//     const token = accessToken || localStorage.getItem("accessToken");

//     if (!token) {
//       router.push("/login");
//       return;
//     }

//     dispatch(fetchMenu());
//   }, [accessToken, dispatch, router]);

//   useEffect(() => {
//     if (selectedMenu === "Annotations" && router.pathname !== "/annotations") {
//       router.push("/annotations");
//     }
//   }, [selectedMenu, router]);

//   const handleMenuClick = (menuName: string) => {
//     setSelectedMenu(menuName);
//   };

//   return (
//     <div
//       className={`max-h-screen flex transition-colors ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}
//     >
//       <Sidebar
//         onMenuClick={handleMenuClick}
//         selectedMenu={selectedMenu}
//         menuData={menu}
//       />

//       <div className="flex flex-col flex-grow">
//         {/* Breadcrumb */}
//         <div className="bg-white dark:bg-gray-800 shadow-sm px-3">
//           <Breadcrumb
//             items={[
//               { label: "Home", href: "/home", icon: <HomeIcon className="w-4 h-4" /> },
//               ...(selectedMenu !== "Dashboard"
//                 ? [
//                     {
//                       label: selectedMenu,
//                       href: `/${selectedMenu.toLowerCase().replace(/ /g, "-")}`,
//                       icon: <FolderIcon className="w-4 h-4" />,
//                       isActive: true,
//                     },
//                   ]
//                 : []),
//             ]}
//           />
//         </div>

//         <div
//           className={`flex-grow p-0 transition-colors ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-md rounded-md mx-2 mt-2`}
//         >
//           {selectedMenu === "Dashboard" && (
//             <DashboardPage onMenuClick={handleMenuClick} />
//           )}
//           {selectedMenu === "Annotations" && <AnnotationsPage />}
//           {selectedMenu === "Image Color Picker" && <ImageColorPickerPage />}
//           {selectedMenu === "Data Visualization" && <Dashboard />}
//           {selectedMenu === "Image Editor" && <ImageEditorPage />}
//           {selectedMenu === "Video Editor" && <VideoEditor />}
//           {selectedMenu === "Audio Editor" && <AudioEditorPage />}
//           {selectedMenu === "Text Editor" && <TextEditorPage />}
//           {selectedMenu === "Numeric Data Editor" && <NumericDataEditorPage />}
//           {selectedMenu === "Document Editor" && <DocumentEditorPage />}
//           {selectedMenu === "Regex Editor" && <RegexEditorPage />}
//           {selectedMenu === "JSON Editor" && <JsonEditorPage />}
//           {selectedMenu === "URL Extractor" && <URLExtractorPage />}
//           {selectedMenu === "Dataset Split" && <DatasetSplitPage />}
//           {selectedMenu === "Data Scraper" && <DataScraperPage />}
//           {selectedMenu === "Cryptography Generator" && <CryptographyGeneratorPage />}
//           {selectedMenu === "Geospatial Data Editor" && <GeospatialDataEditorPage />}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HomePage;

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useRouter } from "next/router";
// import { fetchMenu } from "@/features/menu/menuSlice";
// import { RootState, AppDispatch } from "@/store/store";
// import Sidebar from "@/components/sidebar/Sidebar";
// import VideoToImage from "@/components/video/VideoToImage";
// import ConcatenateVideo from "@/components/video/ConcatenateVideo";
// import CompressImagesInFolder from "@/components/images/CompressImagesInFolder";
// import ImageSizeAdjustment from "@/components/images/ImageSizeAdjusment";
// import { useDarkMode } from "@/context/DarkModeContext";
// import Breadcrumb from "@/components/Breadcrumb";
// import { HomeIcon, FolderIcon } from "@heroicons/react/24/outline";
// import DashboardMenu from "@/components/dashboard/DashboardMenu";
// import DashboardPage from "./dashboard";
// // import AnnotationsPage from "@/pages/annotations";
// import AnnotationsPage from "./annotations";

// const HomePage: React.FC = () => {
//   const { isDarkMode } = useDarkMode();
//   const dispatch = useDispatch<AppDispatch>();
//   const router = useRouter();
//   const { accessToken } = useSelector((state: RootState) => state.auth);
//   const { menu } = useSelector((state: RootState) => state.menu);

//   const [selectedMenu, setSelectedMenu] = useState<string>("Dashboard");

//   useEffect(() => {
//     const token = accessToken || localStorage.getItem("accessToken");

//     if (!token) {
//       router.push("/login");
//       return;
//     }

//     dispatch(fetchMenu());
//   }, [accessToken, dispatch, router]);

//   useEffect(() => {
//     // **Pindahkan URL ke "/annotations" jika menu "Annotations" dipilih**
//     if (selectedMenu === "Annotations" && router.pathname !== "/annotations") {
//       router.push("/annotations");
//     }
//   }, [selectedMenu, router]);

//   const handleMenuClick = (menuName: string) => {
//     setSelectedMenu(menuName);
//   };

//   return (
//     <div
//       className={`max-h-screen flex transition-colors ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}
//     >
//       {/* Sidebar tetap ada */}
//       <Sidebar
//         onMenuClick={handleMenuClick}
//         selectedMenu={selectedMenu}
//         menuData={menu}
//       />

//       {/* Main Content Wrapper */}
//       <div className="flex flex-col flex-grow">
//         {/* Breadcrumb di luar Main Content */}
//         <div className="bg-white dark:bg-gray-800 shadow-sm px-3">
//           <Breadcrumb
//             items={[
//               {
//                 label: "Home",
//                 href: "/home",
//                 icon: <HomeIcon className="w-4 h-4" />,
//               },
//               ...(selectedMenu === "Annotations"
//                 ? [
//                     {
//                       label: "Annotations",
//                       href: "/annotations",
//                       icon: <FolderIcon className="w-4 h-4" />,
//                       isActive: true,
//                     },
//                   ]
//                 : []),
//             ]}
//           />
//         </div>

//         {/* Main Content */}
//         <div
//           className={`flex-grow p-0 transition-colors ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-md rounded-md mx-2 mt-2`}
//         >
//           <div className="p-0">
//             {selectedMenu === "Dashboard" && <DashboardPage />}
//             {selectedMenu === "Annotations" && <AnnotationsPage />}
//             {selectedMenu === "Split by Number of Images" && <VideoToImage />}
//             {selectedMenu === "Concatenate by Composition" && (
//               <ConcatenateVideo />
//             )}
//             {selectedMenu === "Compress" && <CompressImagesInFolder />}
//             {selectedMenu === "Image Size Adjustment" && (
//               <ImageSizeAdjustment />
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HomePage;

// // src/pages/home.tsx

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useRouter } from "next/router";
// import { fetchMenu } from "@/features/menu/menuSlice";
// import { RootState, AppDispatch } from "@/store/store";
// import Sidebar from "@/components/sidebar/Sidebar";
// import VideoToImage from "@/components/video/VideoToImage";
// import ConcatenateVideo from "@/components/video/ConcatenateVideo";
// import CompressImagesInFolder from "@/components/images/CompressImagesInFolder";
// import ImageSizeAdjustment from "@/components/images/ImageSizeAdjusment";
// import AnnotationsPage from "@/pages/annotations";
// import { useDarkMode } from "@/context/DarkModeContext";
// import Breadcrumb from "@/components/Breadcrumb";
// import { HomeIcon } from "@heroicons/react/24/outline";
// import DashboardMenu from "@/components/dashboard/DashboardMenu";

// const HomePage: React.FC = () => {
//   const { isDarkMode } = useDarkMode();
//   const dispatch = useDispatch<AppDispatch>();
//   const router = useRouter();
//   const { accessToken } = useSelector((state: RootState) => state.auth);
//   const { menu, loading, error } = useSelector((state: RootState) => state.menu);

//   const [selectedMenu, setSelectedMenu] = useState<string>("Dashboard");

//   useEffect(() => {
//     const token = accessToken || localStorage.getItem("accessToken");

//     if (!token) {
//       router.push("/login");
//       return;
//     }

//     dispatch(fetchMenu());
//   }, [accessToken, dispatch, router]);

//   const handleMenuClick = (menuName: string) => {
//     setSelectedMenu(menuName);
//   };

//   return (
//     <div className={`max-h-screen flex transition-colors ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
//       {/* Sidebar dengan lebar tetap */}
//       <Sidebar onMenuClick={handleMenuClick} selectedMenu={selectedMenu} menuData={menu} />

//       {/* Main Content Wrapper */}
//       <div className="flex flex-col flex-grow">

//         {/* Breadcrumb di luar Main Content */}
//         <div className="bg-white dark:bg-gray-800 shadow-sm px-3">
//           <Breadcrumb items={[{ label: "Home", href: "/home", icon: <HomeIcon className="w-4 h-4" />, isActive: true }]} />
//         </div>

//         {/* Main Content */}
//         <div className={`flex-grow p-6 transition-colors ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-md rounded-md mx-2 mt-2`}>
//           {/* Dynamic Content Based on Selected Menu */}
//           <div className="p-6">
//             {selectedMenu === "Dashboard" && <DashboardMenu />}
//             {selectedMenu === "Annotations" && <AnnotationsPage />}
//             {selectedMenu === "Split by Number of Images" && <VideoToImage />}
//             {selectedMenu === "Concatenate by Composition" && <ConcatenateVideo />}
//             {selectedMenu === "Compress" && <CompressImagesInFolder />}
//             {selectedMenu === "Image Size Adjustment" && <ImageSizeAdjustment />}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HomePage;
