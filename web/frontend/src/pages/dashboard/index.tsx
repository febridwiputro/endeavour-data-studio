import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface DashboardPageProps {
  onMenuClick: (menuName: string) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ onMenuClick }) => {
  const { menu, loading, error } = useSelector(
    (state: RootState) => state.menu
  );

  const isSvgCode = (logo: string | null) => logo?.trim().startsWith("<svg");

  const modifySvgColor = (svgString: string) => {
    return svgString
      .replace(/stroke="currentColor"/g, 'stroke="#1a4e9d"')
      .replace(/fill="none"/g, 'fill="transparent"')
      .replace(/fill="currentColor"/g, 'fill="#1a4e9d"');
  };

  return (
    <div className="relative h-screen w-full p-6">
      <h1 className="text-3xl font-bold text-center text-gray-900 mt-4 mb-8">
        Dashboard Menu
      </h1>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="bg-white animate-pulse rounded-lg shadow-sm p-4 flex flex-col items-center"
            >
              <div className="w-12 h-12 bg-gray-200 rounded-md mb-3"></div>
              <div className="h-3 w-20 bg-gray-300 rounded mb-2"></div>
              <div className="h-2 w-28 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Menu Grid */}
      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {menu.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-lg shadow-sm p-3 flex flex-col items-center hover:shadow-md hover:scale-105 transition transform duration-200 cursor-pointer border border-gray-200 dark:border-gray-700 dark:bg-gray-900"
              onClick={() => onMenuClick(item.name)} // Notify parent about menu click
            >
              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 hidden group-hover:flex items-center bg-[#1a4e9d] text-white text-xs rounded-md px-3 py-1 transition-opacity duration-200">
                {item.description}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1a4e9d] rotate-45"></div>
              </div>

              {/* Icon / Image */}
              {isSvgCode(item.logo_url) ? (
                <div
                  className="w-12 h-12 p-2 bg-[#e0ecff] rounded-md flex items-center justify-center mb-3"
                  dangerouslySetInnerHTML={{
                    __html: modifySvgColor(item.logo_url!),
                  }}
                />
              ) : (
                <img
                  src={item.logo_url || "/placeholder.svg"}
                  alt={item.name}
                  className="w-12 h-12 mb-3 rounded-md"
                  onError={(e) =>
                    (e.currentTarget.src = "/placeholder.svg")
                  }
                />
              )}

              {/* Menu Name */}
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                {item.name}
              </h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;






// import React, { useState } from "react";
// import { useSelector } from "react-redux";
// import { RootState } from "@/store/store";
// import AnnotationsPage from "../annotations";
// import DataVisualization from "../data-visualization";
// import Dashboard from "../data-visualization/dashboard4";
// import CompressImagesInFolder from "@/components/images/CompressImagesInFolder";
// import VideoEditor from "@/components/video/VideoEditorPage";
// import ImageColorPickerPage from "../image-color-picker";
// import ImageEditorPage from "../images-editor";
// import DocumentEditorPage from "../document-editor";
// import AudioEditorPage from "../audio-editor";
// import TextEditorPage from "../text-editor";
// import NumericDataEditorPage from "../numeric-data-editor";
// import RegexEditorPage from "../regex-editor";
// import JsonEditorPage from "../json-editor";
// import URLExtractorPage from "../url-extractor";
// import DatasetSplitPage from "../dataset-split";
// import CryptographyGeneratorPage from "../cryptography-generator";
// import DataScraperPage from "../data-scraper";
// import GeospatialDataEditorPage from "../geospatial-data-editor";

// const DashboardPage: React.FC = () => {
//   const { menu, loading, error } = useSelector(
//     (state: RootState) => state.menu
//   );
//   const [selectedMenu, setSelectedMenu] = useState<string | null>(null);

//   const isSvgCode = (logo: string | null) => logo?.trim().startsWith("<svg");

//   const modifySvgColor = (svgString: string) => {
//     return svgString
//       .replace(/stroke="currentColor"/g, 'stroke="#1a4e9d"')
//       .replace(/fill="none"/g, 'fill="transparent"')
//       .replace(/fill="currentColor"/g, 'fill="#1a4e9d"');
//   };

//   const handleMenuClick = (menuName: string) => {
//     setSelectedMenu(menuName);
//   };

//   return (
//     <div className="relative h-screen w-full">
//       {/* Dynamic Content */}
//       {selectedMenu ? (
//         <div className="absolute bg-white">
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
//       ) : (
//         <div className="p-6">
//           <h1 className="text-3xl font-bold text-center text-gray-900 mt-4 mb-8">
//             Dashboard Menu
//           </h1>

//           {/* Loading State */}
//           {loading && (
//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
//               {Array.from({ length: 8 }).map((_, index) => (
//                 <div
//                   key={index}
//                   className="bg-white animate-pulse rounded-lg shadow-sm p-4 flex flex-col items-center"
//                 >
//                   <div className="w-12 h-12 bg-gray-200 rounded-md mb-3"></div>
//                   <div className="h-3 w-20 bg-gray-300 rounded mb-2"></div>
//                   <div className="h-2 w-28 bg-gray-200 rounded"></div>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Error State */}
//           {error && <p className="text-center text-red-500">{error}</p>}

//           {/* Menu Grid */}
//           {!loading && (
//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
//               {menu.map((item) => (
//                 <div
//                   key={item.id}
//                   className="group bg-white rounded-lg shadow-sm p-3 flex flex-col items-center hover:shadow-md hover:scale-105 transition transform duration-200 cursor-pointer border border-gray-200 dark:border-gray-700 dark:bg-gray-900"
//                   onClick={() => handleMenuClick(item.name)}
//                 >
//                   {/* Tooltip */}
//                   <div className="absolute bottom-full mb-2 hidden group-hover:flex items-center bg-[#1a4e9d] text-white text-xs rounded-md px-3 py-1 transition-opacity duration-200">
//                     {item.description}
//                     <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1a4e9d] rotate-45"></div>
//                   </div>

//                   {/* Icon / Image */}
//                   {isSvgCode(item.logo_url) ? (
//                     <div
//                       className="w-12 h-12 p-2 bg-[#e0ecff] rounded-md flex items-center justify-center mb-3"
//                       dangerouslySetInnerHTML={{
//                         __html: modifySvgColor(item.logo_url!),
//                       }}
//                     />
//                   ) : (
//                     <img
//                       src={item.logo_url || "/placeholder.svg"}
//                       alt={item.name}
//                       className="w-12 h-12 mb-3 rounded-md"
//                       onError={(e) =>
//                         (e.currentTarget.src = "/placeholder.svg")
//                       }
//                     />
//                   )}

//                   {/* Menu Name */}
//                   <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
//                     {item.name}
//                   </h3>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default DashboardPage;



// import React, { useState } from "react";
// import { useSelector } from "react-redux";
// import { RootState } from "@/store/store";
// import AnnotationsPage from "../annotations";
// import DataVisualization from "../data-visualization";
// import Dashboard from "../data-visualization/dashboard4";
// import CompressImagesInFolder from "@/components/images/CompressImagesInFolder";
// import VideoEditor from "@/components/video/VideoEditorPage";

// const ImageColorPickerPage: React.FC = () => {
//   return (
//     <div className="text-center py-16">
//       <h1 className="text-2xl font-semibold">Image Color Picker</h1>
//       <p className="text-gray-600 text-sm mt-2">This feature is coming soon.</p>
//     </div>
//   );
// };

// const DashboardPage: React.FC = () => {
//   const { menu, loading, error } = useSelector(
//     (state: RootState) => state.menu
//   );
//   const [selectedMenu, setSelectedMenu] = useState<string | null>(null);

//   const isSvgCode = (logo: string | null) => logo?.trim().startsWith("<svg");

//   const modifySvgColor = (svgString: string) => {
//     return svgString
//       .replace(/stroke="currentColor"/g, 'stroke="#1a4e9d"')
//       .replace(/fill="none"/g, 'fill="transparent"')
//       .replace(/fill="currentColor"/g, 'fill="#1a4e9d"');
//   };

//   const handleMenuClick = (menuName: string) => {
//     setSelectedMenu(menuName);
//   };

//   return (
//     // <div className="max-h-screen w-full flex flex-col transition-colors bg-gray-100 dark:bg-gray-900 p-6">
//     //   <div className="flex-grow bg-white dark:bg-gray-800 shadow-md rounded-md p-6">
//     <div className="p-0">
//          {/* <div className={`p-0 h-screen w-full ${selectedMenu ? "" : "flex flex-col"}`}> */}

// {/* <div className="w-full h-screen"> */}
//       {/* Dynamic Content */}
//       {selectedMenu === "Annotations" && <AnnotationsPage />}
//       {selectedMenu === "Image Color Picker" && <ImageColorPickerPage />}
//       {selectedMenu === "Data Visualization" && <Dashboard />}
//       {selectedMenu === "Image Editor" && <CompressImagesInFolder />}
//       {selectedMenu === "Video Editor" && <VideoEditor />}
//       {!selectedMenu && (
//         <>
//           <h1 className="text-3xl font-bold text-center text-gray-900 mt-4 mb-8">
//             Dashboard Menu
//           </h1>

//           {/* Loading State */}
//           {loading && (
//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
//               {Array.from({ length: 8 }).map((_, index) => (
//                 <div
//                   key={index}
//                   className="bg-white animate-pulse rounded-lg shadow-sm p-4 flex flex-col items-center"
//                 >
//                   <div className="w-12 h-12 bg-gray-200 rounded-md mb-3"></div>
//                   <div className="h-3 w-20 bg-gray-300 rounded mb-2"></div>
//                   <div className="h-2 w-28 bg-gray-200 rounded"></div>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Error State */}
//           {error && <p className="text-center text-red-500">{error}</p>}

//           {/* Menu Grid */}
//           {!loading && (
//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
//               {menu.map((item) => (
//                 <div
//                   key={item.id}
//                   className="group bg-white rounded-lg shadow-sm p-3 flex flex-col items-center hover:shadow-md hover:scale-105 transition transform duration-200 cursor-pointer border border-gray-200 dark:border-gray-700 dark:bg-gray-900"
//                   onClick={() => setSelectedMenu(item.name)}
//                 >
//                   {/* Tooltip */}
//                   <div className="absolute bottom-full mb-2 hidden group-hover:flex items-center bg-[#1a4e9d] text-white text-xs rounded-md px-3 py-1 transition-opacity duration-200">
//                     {item.description}
//                     <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1a4e9d] rotate-45"></div>
//                   </div>

//                   {/* Icon / Image */}
//                   {isSvgCode(item.logo_url) ? (
//                     <div
//                       className="w-12 h-12 p-2 bg-[#e0ecff] rounded-md flex items-center justify-center mb-3"
//                       dangerouslySetInnerHTML={{
//                         __html: modifySvgColor(item.logo_url!),
//                       }}
//                     />
//                   ) : (
//                     <img
//                       src={item.logo_url || "/placeholder.svg"}
//                       alt={item.name}
//                       className="w-12 h-12 mb-3 rounded-md"
//                       onError={(e) =>
//                         (e.currentTarget.src = "/placeholder.svg")
//                       }
//                     />
//                   )}

//                   {/* Menu Name */}
//                   <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
//                     {item.name}
//                   </h3>
//                 </div>
//               ))}
//             </div>
//           )}
//         </>
//       )}
//     </div>
//     //   </div>
//     // </div>
//   );
// };

// export default DashboardPage;
