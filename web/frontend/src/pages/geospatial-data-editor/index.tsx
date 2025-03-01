import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import {
  FaMapMarkerAlt,
  FaDrawPolygon,
  FaGlobe,
  FaLayerGroup,
  FaFileDownload,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";
import { HomeIcon, FolderIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/router";

const GeospatialDataEditorPage = () => {
  const features = [
    { name: "Map Visualization", icon: FaGlobe },
    { name: "Geospatial Analysis", icon: FaDrawPolygon },
    { name: "Layer Management", icon: FaLayerGroup },
    { name: "Coordinate Tools", icon: FaMapMarkerAlt },
    { name: "Data Export", icon: FaFileDownload },
  ];

  const subFeatures: Record<
    | "Map Visualization"
    | "Geospatial Analysis"
    | "Layer Management"
    | "Coordinate Tools"
    | "Data Export",
    string[]
  > = {
    "Map Visualization": [
      "View Shapefiles",
      "Overlay Multiple Maps",
      "Heatmap Generation",
      "Interactive Map Navigation",
    ],
    "Geospatial Analysis": [
      "Polygon Area Calculation",
      "Buffer Analysis",
      "Distance Measurement",
      "Spatial Joins",
      "Raster Analysis",
    ],
    "Layer Management": [
      "Add/Remove Layers",
      "Layer Styling",
      "Layer Grouping",
      "Opacity Adjustment",
      "Toggle Layer Visibility",
    ],
    "Coordinate Tools": [
      "Convert Coordinates",
      "Add Custom Markers",
      "Geocode Addresses",
      "Reverse Geocoding",
      "Bounding Box Calculation",
    ],
    "Data Export": [
      "Export as GeoJSON",
      "Export as KML",
      "Export as Shapefile",
      "Export as CSV",
    ],
  };

  const { menu } = useSelector((state: RootState) => state.menu);
  const router = useRouter();

  const [selectedFeature, setSelectedFeature] = useState<keyof typeof subFeatures>(
    "Map Visualization"
  );
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

  useEffect(() => {
    if (router.pathname === "/geospatial-data-editor") {
      setSelectedFeature("Map Visualization");
    }
  }, [router.pathname]);

  const breadcrumbItems = [
    { label: "Home", href: "/", icon: <HomeIcon className="w-4 h-4" /> },
    {
      label: "Geospatial Data Editor",
      href: "/geospatial-data-editor",
      icon: <FolderIcon className="w-4 h-4" />,
    },
    ...(selectedFeature
      ? [
          {
            label: selectedFeature,
            href: "",
            icon: <FolderIcon className="w-4 h-4" />,
            isActive: true,
          },
        ]
      : []),
  ];

  const handleSidebarToggle = () => {
    setIsSidebarMinimized(!isSidebarMinimized);
  };

  const getButtonClass = (featureName: string) =>
    `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all ${
      selectedFeature === featureName
        ? "bg-blue-100 text-blue-600 font-semibold shadow-lg"
        : "text-gray-700 hover:bg-gray-100 hover:shadow-md"
    }`;

  return (
    <Layout
      menuData={menu}
      onMenuClick={() => router.push("/geospatial-data-editor")}
      selectedMenu="Geospatial Data Editor"
      breadcrumbItems={breadcrumbItems}
    >
      <div className="flex h-screen">
        {/* Sidebar */}
        <div
          className={`${
            isSidebarMinimized ? "w-16" : "w-64"
          } h-full bg-white flex flex-col border-r border-gray-200 shadow transition-all duration-300`}
        >
          {/* Header Section */}
          <div
            className={`flex items-center ${
              isSidebarMinimized ? "justify-center" : "justify-between"
            } p-4 bg-blue-100 border-b border-gray-200`}
          >
            {!isSidebarMinimized && (
              <h1 className="text-lg font-semibold text-blue-600">
                Geospatial Data Editor
              </h1>
            )}
            <button
              onClick={handleSidebarToggle}
              className="bg-white rounded-full p-2 text-blue-500 hover:text-blue-600 hover:bg-gray-100 transition-all"
              title={isSidebarMinimized ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isSidebarMinimized ? <FaChevronRight /> : <FaChevronLeft />}
            </button>
          </div>

          {/* Menu Items */}
          <ul className="flex-1 space-y-2 mt-4 px-2">
            {features.map((feature) => (
              <li key={feature.name}>
                <button
                  className={`${getButtonClass(feature.name)} ${
                    isSidebarMinimized
                      ? "justify-center flex-col h-10 w-10 mx-auto"
                      : "justify-start flex-row w-full"
                  } flex items-center hover:shadow-lg`}
                  onClick={() =>
                    setSelectedFeature(feature.name as keyof typeof subFeatures)
                  }
                  title={isSidebarMinimized ? feature.name : undefined}
                >
                  <feature.icon
                    className={`${
                      isSidebarMinimized ? "w-5 h-5" : "w-6 h-6"
                    } text-blue-500`}
                  />
                  {!isSidebarMinimized && (
                    <span className="ml-3 text-sm">{feature.name}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
          <footer className="text-center p-4 text-gray-500 text-xs">
            Geospatial Data Editor © 2025
          </footer>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-50">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">{selectedFeature}</h1>
          <h2 className="text-lg font-semibold mb-4">Sub-Features:</h2>
          <ul className="list-disc list-inside space-y-2">
            {subFeatures[selectedFeature]?.map((subFeature, index) => (
              <li key={index} className="text-gray-700">
                {subFeature}
              </li>
            ))}
          </ul>
          <button className="mt-6 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
            Explore {selectedFeature}
          </button>
        </main>
      </div>
    </Layout>
  );
};

export default GeospatialDataEditorPage;



// import React, { useState } from "react";
// import {
//   FaMapMarkerAlt,
//   FaDrawPolygon,
//   FaGlobe,
//   FaLayerGroup,
//   FaFileDownload,
//   FaChevronRight,
//   FaChevronLeft,
// } from "react-icons/fa";

// const GeospatialDataEditorPage = () => {
//   const features = [
//     { name: "Map Visualization", icon: FaGlobe },
//     { name: "Geospatial Analysis", icon: FaDrawPolygon },
//     { name: "Layer Management", icon: FaLayerGroup },
//     { name: "Coordinate Tools", icon: FaMapMarkerAlt },
//     { name: "Data Export", icon: FaFileDownload },
//   ];

//   const subFeatures: Record<
//     | "Map Visualization"
//     | "Geospatial Analysis"
//     | "Layer Management"
//     | "Coordinate Tools"
//     | "Data Export",
//     string[]
//   > = {
//     "Map Visualization": [
//       "View Shapefiles",
//       "Overlay Multiple Maps",
//       "Heatmap Generation",
//       "Interactive Map Navigation",
//     ],
//     "Geospatial Analysis": [
//       "Polygon Area Calculation",
//       "Buffer Analysis",
//       "Distance Measurement",
//       "Spatial Joins",
//       "Raster Analysis",
//     ],
//     "Layer Management": [
//       "Add/Remove Layers",
//       "Layer Styling",
//       "Layer Grouping",
//       "Opacity Adjustment",
//       "Toggle Layer Visibility",
//     ],
//     "Coordinate Tools": [
//       "Convert Coordinates",
//       "Add Custom Markers",
//       "Geocode Addresses",
//       "Reverse Geocoding",
//       "Bounding Box Calculation",
//     ],
//     "Data Export": [
//       "Export as GeoJSON",
//       "Export as KML",
//       "Export as Shapefile",
//       "Export as CSV",
//     ],
//   };

//   const [selectedFeature, setSelectedFeature] = useState<keyof typeof subFeatures>(
//     "Map Visualization"
//   );
//   const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

//   const handleSidebarToggle = () => {
//     setIsSidebarMinimized(!isSidebarMinimized);
//   };

//   const getButtonClass = (featureName: string) =>
//     `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all ${
//       selectedFeature === featureName
//         ? "bg-blue-100 text-blue-600 font-semibold shadow-lg"
//         : "text-gray-700 hover:bg-gray-100 hover:shadow-md"
//     }`;

//   return (
//     <div className="flex h-screen w-screen">
//       {/* Sidebar */}
//       <div
//         className={`bg-white ${
//           isSidebarMinimized ? "w-16" : "w-64"
//         } flex flex-col border-r border-gray-200 shadow transition-all duration-300`}
//       >
//         {/* Header Section */}
//         <div
//           className={`flex items-center ${
//             isSidebarMinimized ? "justify-center" : "justify-between"
//           } p-4 bg-blue-100 border-b border-gray-200`}
//         >
//           {!isSidebarMinimized && (
//             <h1 className="text-lg font-semibold text-blue-600">
//               Geospatial Data Editor
//             </h1>
//           )}
//           <button
//             onClick={handleSidebarToggle}
//             className="bg-white rounded-full p-2 text-blue-500 hover:text-blue-600 hover:bg-gray-100 transition-all"
//             title={isSidebarMinimized ? "Expand Sidebar" : "Collapse Sidebar"}
//           >
//             {isSidebarMinimized ? <FaChevronRight /> : <FaChevronLeft />}
//           </button>
//         </div>

//         {/* Menu Items */}
//         <ul className="flex-1 space-y-2 mt-4 px-2">
//           {features.map((feature) => (
//             <li key={feature.name}>
//               <button
//                 className={`${getButtonClass(feature.name)} ${
//                   isSidebarMinimized
//                     ? "justify-center flex-col h-10 w-10 mx-auto"
//                     : "justify-start flex-row w-full"
//                 } flex items-center hover:shadow-lg`}
//                 onClick={() => setSelectedFeature(feature.name as keyof typeof subFeatures)}
//                 title={isSidebarMinimized ? feature.name : undefined}
//               >
//                 <feature.icon
//                   className={`${
//                     isSidebarMinimized ? "w-5 h-5" : "w-6 h-6"
//                   } text-blue-500`}
//                 />
//                 {!isSidebarMinimized && (
//                   <span className="ml-3 text-sm">{feature.name}</span>
//                 )}
//               </button>
//             </li>
//           ))}
//         </ul>
//         <footer className="text-center p-4 text-gray-500 text-xs">
//           Geospatial Data Editor © 2025
//         </footer>
//       </div>

//       {/* Main Content */}
//       <main className="flex-1 p-6 bg-gray-50">
//         <h1 className="text-2xl font-bold mb-6 text-gray-800">{selectedFeature}</h1>
//         <h2 className="text-lg font-semibold mb-4">Sub-Features:</h2>
//         <ul className="list-disc list-inside space-y-2">
//           {subFeatures[selectedFeature]?.map((subFeature, index) => (
//             <li key={index} className="text-gray-700">
//               {subFeature}
//             </li>
//           ))}
//         </ul>
//         <button className="mt-6 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
//           Explore {selectedFeature}
//         </button>
//       </main>
//     </div>
//   );
// };

// export default GeospatialDataEditorPage;
