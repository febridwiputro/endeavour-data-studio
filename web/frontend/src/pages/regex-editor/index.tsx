import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import {
  FaCode,
  FaPlay,
  FaSave,
  FaFolderOpen,
  FaBook,
  FaRegEdit,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";
import { HomeIcon, FolderIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const RegexEditorPage = () => {
  const router = useRouter();
  const { menu } = useSelector((state: RootState) => state.menu);

  const [selectedFeature, setSelectedFeature] = useState("Regex Builder");
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [regexPattern, setRegexPattern] = useState("");
  const [testString, setTestString] = useState("");

  type FlagKey = "i" | "m" | "g" | "s" | "u";
  const [flags, setFlags] = useState<Record<FlagKey, boolean>>({
    i: false,
    m: false,
    g: false,
    s: false,
    u: false,
  });

  useEffect(() => {
    if (router.pathname === "/regex-editor") {
      setSelectedFeature("Regex Builder");
    }
  }, [router.pathname]);

  const features = [
    { name: "Regex Builder", icon: FaRegEdit },
    { name: "Regex Patterns", icon: FaCode },
    { name: "Test & Validate", icon: FaPlay },
    { name: "Save & Load Patterns", icon: FaSave },
    { name: "Documentation & Examples", icon: FaBook },
  ];

  const subFeatures: Record<string, string[]> = {
    "Regex Builder": ["Pattern Input", "Test String", "Flags"],
    "Regex Patterns": [
      "Character Classes",
      "Anchors",
      "Escaped Characters",
      "Groups & Lookaround",
      "Quantifiers & Alternation",
    ],
    "Test & Validate": ["Match Results", "Match Highlighting", "Error Feedback"],
    "Save & Load Patterns": ["Save Pattern", "Load Pattern", "Pattern Library"],
    "Documentation & Examples": [
      "Regex Syntax Guide",
      "Examples",
      "Interactive Tutorials",
    ],
  };

  const breadcrumbItems = [
    { label: "Home", href: "/", icon: <HomeIcon className="w-4 h-4" /> },
    { label: "Regex Editor", href: "/regex-editor", icon: <FolderIcon className="w-4 h-4" /> },
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

  const handleFlagToggle = (flag: FlagKey) => {
    setFlags((prevFlags) => ({ ...prevFlags, [flag]: !prevFlags[flag] }));
  };

  const getRegex = () => {
    try {
      const activeFlags = Object.keys(flags)
        .filter((key) => flags[key as FlagKey])
        .join("");

      const finalFlags = activeFlags.includes("g") ? activeFlags : `${activeFlags}g`;

      return new RegExp(regexPattern, finalFlags);
    } catch (error) {
      return null;
    }
  };

  const matchResults = () => {
    const regex = getRegex();
    if (!regex) return [];
    return [...testString.matchAll(regex)];
  };

  return (
    <Layout
      menuData={menu}
      onMenuClick={() => router.push("/regex-editor")}
      selectedMenu="Regex Editor"
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
              <h1 className="text-lg font-semibold text-blue-600">Regex Editor</h1>
            )}
            <button
              onClick={handleSidebarToggle}
              className="bg-white rounded-full p-2 text-blue-500 hover:text-blue-600 hover:bg-gray-100 transition-all"
              title={isSidebarMinimized ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isSidebarMinimized ? <FaChevronRight /> : <FaChevronLeft />}
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
                  onClick={() => setSelectedFeature(feature.name)}
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
            RegexEditor © 2025
          </footer>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-50">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">{selectedFeature}</h1>
          <h2 className="text-lg font-semibold mb-4">Sub-Features:</h2>
          <ul className="list-disc list-inside space-y-2">
            {subFeatures[selectedFeature]?.map((subFeature) => (
              <li key={subFeature} className="text-gray-700">
                {subFeature}
              </li>
            ))}
          </ul>

          {selectedFeature === "Regex Builder" && (
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-gray-700 font-medium">Regex Pattern</label>
                <input
                  type="text"
                  value={regexPattern}
                  onChange={(e) => setRegexPattern(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Enter regex pattern"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">Test String</label>
                <textarea
                  value={testString}
                  onChange={(e) => setTestString(e.target.value)}
                  className="w-full p-2 border rounded"
                  rows={4}
                  placeholder="Enter a test string to match against the regex"
                ></textarea>
              </div>
              <div>
                <label className="block text-gray-700 font-medium">Flags</label>
                <div className="flex space-x-4">
                  {Object.entries(flags).map(([flag, isActive]) => (
                    <button
                      key={flag}
                      onClick={() => handleFlagToggle(flag as FlagKey)}
                      className={`px-4 py-2 rounded ${
                        isActive
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {flag}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-medium">Matches</label>
                <ul className="list-disc list-inside">
                  {matchResults().map((match, index) => (
                    <li key={index} className="text-gray-700">
                      {match[0]}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </main>
      </div>
    </Layout>
  );
};

export default RegexEditorPage;



// import React, { useState } from "react";
// import {
//   FaCode,
//   FaPlay,
//   FaSave,
//   FaFolderOpen,
//   FaBook,
//   FaRegEdit,
//   FaChevronRight,
//   FaChevronLeft,
// } from "react-icons/fa";

// const RegexEditorPage = () => {
//   const [selectedFeature, setSelectedFeature] = useState("Regex Builder");
//   const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
//   const [regexPattern, setRegexPattern] = useState("");
//   const [testString, setTestString] = useState("");

//   // Define the valid keys for flags
//   type FlagKey = "i" | "m" | "g" | "s" | "u";
//   const [flags, setFlags] = useState<Record<FlagKey, boolean>>({
//     i: false,
//     m: false,
//     g: false,
//     s: false,
//     u: false,
//   });

//   const handleSidebarToggle = () => {
//     setIsSidebarMinimized(!isSidebarMinimized);
//   };

//   const features = [
//     { name: "Regex Builder", icon: FaRegEdit },
//     { name: "Regex Patterns", icon: FaCode },
//     { name: "Test & Validate", icon: FaPlay },
//     { name: "Save & Load Patterns", icon: FaSave },
//     { name: "Documentation & Examples", icon: FaBook },
//   ];

//   const subFeatures: Record<string, string[]> = {
//     "Regex Builder": ["Pattern Input", "Test String", "Flags"],
//     "Regex Patterns": [
//       "Character Classes",
//       "Anchors",
//       "Escaped Characters",
//       "Groups & Lookaround",
//       "Quantifiers & Alternation",
//     ],
//     "Test & Validate": ["Match Results", "Match Highlighting", "Error Feedback"],
//     "Save & Load Patterns": ["Save Pattern", "Load Pattern", "Pattern Library"],
//     "Documentation & Examples": [
//       "Regex Syntax Guide",
//       "Examples",
//       "Interactive Tutorials",
//     ],
//   };

//   const getButtonClass = (featureName: string) =>
//     `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all ${
//       selectedFeature === featureName
//         ? "bg-blue-100 text-blue-600 font-semibold shadow-lg"
//         : "text-gray-700 hover:bg-gray-100 hover:shadow-md"
//     }`;

//   const handleFlagToggle = (flag: FlagKey) => {
//     setFlags((prevFlags) => ({ ...prevFlags, [flag]: !prevFlags[flag] }));
//   };

//   const getRegex = () => {
//     try {
//       // Always include 'g' (global) flag for matchAll
//       const activeFlags = Object.keys(flags)
//         .filter((key) => flags[key as FlagKey])
//         .join("");
  
//       const finalFlags = activeFlags.includes("g") ? activeFlags : `${activeFlags}g`;
  
//       return new RegExp(regexPattern, finalFlags);
//     } catch (error) {
//       return null; // Return null if the regex is invalid
//     }
//   };
  
//   const matchResults = () => {
//     const regex = getRegex();
//     if (!regex) return []; // Return an empty array if the regex is invalid
//     return [...testString.matchAll(regex)];
//   };
  

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
//             <h1 className="text-lg font-semibold text-blue-600">Regex Editor</h1>
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
//                 onClick={() => setSelectedFeature(feature.name)}
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
//           RegexEditor © 2025
//         </footer>
//       </div>

//       {/* Main Content */}
//       <main className="flex-1 p-6 bg-gray-50">
//         <h1 className="text-2xl font-bold mb-6 text-gray-800">{selectedFeature}</h1>
//         <h2 className="text-lg font-semibold mb-4">Sub-Features:</h2>
//         <ul className="list-disc list-inside space-y-2">
//           {subFeatures[selectedFeature]?.map((subFeature) => (
//             <li key={subFeature} className="text-gray-700">
//               {subFeature}
//             </li>
//           ))}
//         </ul>

//         {/* Regex Builder Feature */}
//         {selectedFeature === "Regex Builder" && (
//           <div className="mt-6 space-y-4">
//             <div>
//               <label className="block text-gray-700 font-medium">Regex Pattern</label>
//               <input
//                 type="text"
//                 value={regexPattern}
//                 onChange={(e) => setRegexPattern(e.target.value)}
//                 className="w-full p-2 border rounded"
//                 placeholder="Enter regex pattern"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-700 font-medium">Test String</label>
//               <textarea
//                 value={testString}
//                 onChange={(e) => setTestString(e.target.value)}
//                 className="w-full p-2 border rounded"
//                 rows={4}
//                 placeholder="Enter a test string to match against the regex"
//               ></textarea>
//             </div>
//             <div>
//               <label className="block text-gray-700 font-medium">Flags</label>
//               <div className="flex space-x-4">
//                 {Object.entries(flags).map(([flag, isActive]) => (
//                   <button
//                     key={flag}
//                     onClick={() => handleFlagToggle(flag as FlagKey)}
//                     className={`px-4 py-2 rounded ${
//                       isActive
//                         ? "bg-blue-500 text-white"
//                         : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                     }`}
//                   >
//                     {flag}
//                   </button>
//                 ))}
//               </div>
//             </div>
//             <div>
//               <label className="block text-gray-700 font-medium">Matches</label>
//               <ul className="list-disc list-inside">
//                 {matchResults().map((match, index) => (
//                   <li key={index} className="text-gray-700">
//                     {match[0]}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default RegexEditorPage;
