import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { ArrowsPointingOutIcon, ArrowsPointingInIcon } from "@heroicons/react/24/outline";
import { FaPalette, FaEyeDropper, FaBrush, FaSave, FaCircle } from "react-icons/fa";
import { HomeIcon, FolderIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/router";

const ImageColorPickerPage = () => {
  const features = [
    { name: "Pick Color from Image", icon: FaEyeDropper },
    { name: "Color Picker", icon: FaPalette },
    { name: "Pinned Colors", icon: FaSave },
    { name: "Color Format", icon: FaCircle },
    { name: "Color Components", icon: FaBrush },
  ];

  const subFeatures: {
    [key in typeof features[number]["name"]]: { name: string; description: string }[];
  } = {
    "Pick Color from Image": [
      {
        name: "Dominant Color",
        description: "Identify the dominant color present in the image.",
      },
      {
        name: "Palette Color",
        description: "Generate a color palette based on the colors found in the image.",
      },
    ],
    "Color Picker": [
      {
        name: "Pick Color",
        description: "Choose a color from different sources displayed on the color picker canvas.",
      },
      {
        name: "Pixel Color",
        description: "Click on the canvas to select a color, showing the pixel color in HEX format.",
      },
      {
        name: "Pixel Color Coordinates",
        description: "Displays the coordinates of the selected pixel.",
      },
      {
        name: "Edit and Convert Color Code",
        description:
          "Set or get the current color in various formats such as HEX, RGB, or HTML/CSS.",
      },
    ],
    "Pinned Colors": [
      {
        name: "Pin or Unpin Current Color",
        description: "Mark a color as favorite to persist it across sessions.",
      },
      {
        name: "Clear All Pinned Colors",
        description: "Remove all pinned colors.",
      },
      {
        name: "Load Colors from a File",
        description: "Import pinned colors from an external file.",
      },
      {
        name: "Save Pinned Colors to a File",
        description: "Export pinned colors to an external file.",
      },
    ],
    "Color Format": [
      {
        name: "Select Format",
        description: "Choose a format for color editing or conversion, such as HEX or RGB.",
      },
    ],
    "Color Components": [
      {
        name: "Red",
        description: "Set the red component value (0-255).",
      },
      {
        name: "Green",
        description: "Set the green component value (0-255).",
      },
      {
        name: "Blue",
        description: "Set the blue component value (0-255).",
      },
      {
        name: "Opacity",
        description: "Set the opacity value (0-100%).",
      },
    ],
  };

  const { menu } = useSelector((state: RootState) => state.menu);
  const router = useRouter();

  const [selectedFeature, setSelectedFeature] = useState<keyof typeof subFeatures>(
    "Pick Color from Image"
  );
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

  useEffect(() => {
    if (router.pathname === "/image-color-picker") {
      setSelectedFeature("Pick Color from Image");
    }
  }, [router.pathname]);

  const breadcrumbItems = [
    { label: "Home", href: "/", icon: <HomeIcon className="w-4 h-4" /> },
    { label: "Image Color Picker", href: "/image-color-picker", icon: <FolderIcon className="w-4 h-4" /> },
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
      onMenuClick={() => router.push("/image-color-picker")}
      selectedMenu="Image Color Picker"
      breadcrumbItems={breadcrumbItems}
    >
      <div className="flex h-screen">
        {/* Sidebar Features */}
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
                Image Color Picker
              </h1>
            )}
            <button
              onClick={handleSidebarToggle}
              className="bg-white rounded-full p-2 text-blue-500 hover:text-blue-600 hover:bg-gray-100 transition-all"
              title={isSidebarMinimized ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isSidebarMinimized ? (
                <ArrowsPointingOutIcon className="h-5 w-5" />
              ) : (
                <ArrowsPointingInIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Feature List */}
          <ul className="flex-1 space-y-2 mt-4 px-2">
            {features.map((feature) => (
              <li key={feature.name}>
                <button
                  className={`${getButtonClass(feature.name)} ${
                    isSidebarMinimized
                      ? "justify-center flex-col h-10 w-10 mx-auto"
                      : "justify-start flex-row w-full"
                  } flex items-center hover:shadow-lg`}
                  onClick={() => setSelectedFeature(feature.name as keyof typeof subFeatures)}
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
            ImageColorPicker © 2025
          </footer>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-50">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">{selectedFeature}</h1>
          <h2 className="text-lg font-semibold mb-4">Sub-Features:</h2>
          <ul className="list-disc list-inside space-y-4">
            {subFeatures[selectedFeature].map((subFeature) => (
              <li key={subFeature.name}>
                <h3 className="text-gray-800 font-medium">{subFeature.name}</h3>
                <p className="text-gray-600 text-sm">{subFeature.description}</p>
              </li>
            ))}
          </ul>
        </main>
      </div>
    </Layout>
  );
};

export default ImageColorPickerPage;




// import React, { useState } from "react";
// import {
//   FaPalette,
//   FaEyeDropper,
//   FaBrush,
//   FaSave,
//   FaCircle,
//   FaExpand,
// } from "react-icons/fa";

// const ImageColorPickerPage = () => {
//   const features = [
//     { name: "Pick Color from Image", icon: FaEyeDropper },
//     { name: "Color Picker", icon: FaPalette },
//     { name: "Pinned Colors", icon: FaSave },
//     { name: "Color Format", icon: FaCircle },
//     { name: "Color Components", icon: FaBrush },
//   ];

//   // Type for the `subFeatures` object
//   const subFeatures: {
//     [key in typeof features[number]["name"]]: { name: string; description: string }[];
//   } = {
//     "Pick Color from Image": [
//       {
//         name: "Dominant Color",
//         description: "Identify the dominant color present in the image.",
//       },
//       {
//         name: "Palette Color",
//         description: "Generate a color palette based on the colors found in the image.",
//       },
//     ],
//     "Color Picker": [
//       {
//         name: "Pick Color",
//         description: "Choose a color from different sources displayed on the color picker canvas.",
//       },
//       {
//         name: "Pixel Color",
//         description: "Click on the canvas to select a color, showing the pixel color in HEX format.",
//       },
//       {
//         name: "Pixel Color Coordinates",
//         description: "Displays the coordinates of the selected pixel.",
//       },
//       {
//         name: "Edit and Convert Color Code",
//         description:
//           "Set or get the current color in various formats such as HEX, RGB, or HTML/CSS.",
//       },
//     ],
//     "Pinned Colors": [
//       {
//         name: "Pin or Unpin Current Color",
//         description: "Mark a color as favorite to persist it across sessions.",
//       },
//       {
//         name: "Clear All Pinned Colors",
//         description: "Remove all pinned colors.",
//       },
//       {
//         name: "Load Colors from a File",
//         description: "Import pinned colors from an external file.",
//       },
//       {
//         name: "Save Pinned Colors to a File",
//         description: "Export pinned colors to an external file.",
//       },
//     ],
//     "Color Format": [
//       {
//         name: "Select Format",
//         description: "Choose a format for color editing or conversion, such as HEX or RGB.",
//       },
//     ],
//     "Color Components": [
//       {
//         name: "Red",
//         description: "Set the red component value (0-255).",
//       },
//       {
//         name: "Green",
//         description: "Set the green component value (0-255).",
//       },
//       {
//         name: "Blue",
//         description: "Set the blue component value (0-255).",
//       },
//       {
//         name: "Opacity",
//         description: "Set the opacity value (0-100%).",
//       },
//     ],
//   };

//   // Set the initial state of `selectedFeature`
//   const [selectedFeature, setSelectedFeature] = useState<keyof typeof subFeatures>(
//     "Pick Color from Image"
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
//               Image Color Picker
//             </h1>
//           )}
//           <button
//             onClick={handleSidebarToggle}
//             className="bg-white rounded-full p-2 text-blue-500 hover:text-blue-600 hover:bg-gray-100 transition-all"
//             title={isSidebarMinimized ? "Expand Sidebar" : "Collapse Sidebar"}
//           >
//             {isSidebarMinimized ? <FaExpand /> : <FaExpand />}
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
//           ImageColorPicker © 2025
//         </footer>
//       </div>

//       {/* Main Content */}
//       <main className="flex-1 p-6 bg-gray-50">
//         <h1 className="text-2xl font-bold mb-6 text-gray-800">{selectedFeature}</h1>
//         <h2 className="text-lg font-semibold mb-4">Sub-Features:</h2>
//         <ul className="list-disc list-inside space-y-4">
//           {subFeatures[selectedFeature].map((subFeature) => (
//             <li key={subFeature.name}>
//               <h3 className="text-gray-800 font-medium">{subFeature.name}</h3>
//               <p className="text-gray-600 text-sm">{subFeature.description}</p>
//             </li>
//           ))}
//         </ul>
//         <button className="mt-6 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
//           Learn More
//         </button>
//       </main>
//     </div>
//   );
// };

// export default ImageColorPickerPage;
