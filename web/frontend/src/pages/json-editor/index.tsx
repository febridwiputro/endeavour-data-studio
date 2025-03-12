import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  FaFileAlt,
  FaCopy,
  FaDownload,
  FaCheck,
  FaFilter,
  FaSearch,
  FaRedo,
  FaExpandArrowsAlt,
  FaCompressArrowsAlt,
} from "react-icons/fa";
import { HomeIcon, FolderIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";

const ReactJson = dynamic(() => import("react-json-view"), { ssr: false });

const JsonEditorPage = () => {
  const { menu } = useSelector((state: RootState) => state.menu);
  const router = useRouter();

  const [selectedFeature, setSelectedFeature] = useState("Text Mode");
  const [jsonData, setJsonData] = useState<string>(
    JSON.stringify({ key: "value" }, null, 2)
  );
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [isValidJson, setIsValidJson] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeButton, setActiveButton] = useState<string | null>(null);

  useEffect(() => {
    try {
      JSON.parse(jsonData);
      setIsValidJson(true);
      setJsonError(null);
    } catch (error: any) {
      setIsValidJson(false);
      setJsonError(error.message);
    }
  }, [jsonData]);

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonData(e.target.value);
  };

  const formatJson = () => {
    try {
      const formatted = JSON.stringify(JSON.parse(jsonData), null, 2);
      setJsonData(formatted);
    } catch (error) {
      setJsonError("Invalid JSON format");
    }
  };

  const copyJson = () => {
    navigator.clipboard.writeText(jsonData);
  };

  const downloadJson = () => {
    const blob = new Blob([jsonData], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "data.json";
    link.click();
  };

  const features = ["Text", "Tree", "Table"];

  const breadcrumbItems = [
    { label: "Home", href: "/", icon: <HomeIcon className="w-4 h-4" /> },
    {
      label: "JSON Editor",
      href: "/json-editor",
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

  return (
    <Layout
      menuData={menu}
      onMenuClick={() => router.push("/json-editor")}
      selectedMenu="JSON Editor"
      breadcrumbItems={breadcrumbItems}
    >
      <div className="flex flex-col h-screen bg-gray-100 p-4">
        {/* Toolbar */}
        <div className="flex items-center bg-white p-3 shadow rounded-lg">
          {features.map((feature) => (
            <button
              key={feature}
              className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                selectedFeature === feature
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setSelectedFeature(feature)}
            >
              {feature}
            </button>
          ))}
          <div className="flex ml-auto space-x-2">
            {[
              { icon: FaFilter, title: "Filter" },
              { icon: FaSearch, title: "Search" },
              { icon: FaRedo, title: "Reload" },
              {
                icon: isExpanded ? FaCompressArrowsAlt : FaExpandArrowsAlt,
                title: isExpanded ? "Collapse" : "Expand",
                action: () => setIsExpanded(!isExpanded),
              },
              { icon: FaFileAlt, title: "Format JSON", action: formatJson },
              { icon: FaCopy, title: "Copy JSON", action: copyJson },
              {
                icon: FaDownload,
                title: "Download JSON",
                action: downloadJson,
              },
            ].map(({ icon: Icon, title, action }, index) => (
              <button
                key={index}
                className={`p-2 rounded-lg transition-all ${activeButton === title ? "bg-blue-600" : "bg-gray-200 hover:bg-blue-600 hover:text-white"}`}
                title={title}
                onClick={() => {
                  if (action) action();
                  setActiveButton(title);
                  setTimeout(() => setActiveButton(null), 500);
                }}
              >
                <Icon className="text-gray-600 hover:text-white" />
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <main
          className={`flex-1 mt-4 transition-all ${isExpanded ? "h-screen" : "h-auto"}`}
        >
          {jsonError && (
            <div className="text-red-500 mb-2 font-medium">{jsonError}</div>
          )}
          {isValidJson && (
            <div className="text-green-600 flex items-center mb-2 font-medium">
              <FaCheck className="mr-1" /> Valid JSON
            </div>
          )}
          <div className="bg-white p-4 rounded-lg shadow border">
            {selectedFeature === "Tree" ? (
              <ReactJson
                src={JSON.parse(jsonData)}
                theme="rjv-default"
                enableClipboard={false}
              />
            ) : selectedFeature === "Table" ? (
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead>
                  <tr className="bg-gray-200 text-left">
                    <th className="border px-4 py-2">Key</th>
                    <th className="border px-4 py-2">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(JSON.parse(jsonData)).map(
                    ([key, value], index) => (
                      <tr key={index} className="border">
                        <td className="border px-4 py-2 font-semibold text-gray-700">
                          {key}
                        </td>
                        <td className="border px-4 py-2 text-gray-600">
                          {JSON.stringify(value)}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            ) : (
              <textarea
                value={jsonData}
                onChange={handleJsonChange}
                className="w-full h-96 p-4 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 font-mono"
              />
            )}
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default JsonEditorPage;





// import React, { useState, useEffect } from "react";
// import Layout from "@/components/Layout";
// import {
//   FaFileAlt,
//   FaListUl,
//   FaTable,
//   FaChevronRight,
//   FaChevronLeft,
// } from "react-icons/fa";
// import { HomeIcon, FolderIcon } from "@heroicons/react/24/outline";
// import { useSelector } from "react-redux";
// import { RootState } from "@/store/store";
// import { useRouter } from "next/router";

// const JsonEditorPage = () => {
//   const { menu } = useSelector((state: RootState) => state.menu);
//   const router = useRouter();

//   const [selectedFeature, setSelectedFeature] = useState("Text Mode");
//   const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
//   const [jsonData, setJsonData] = useState<string>('{ "key": "value" }');
//   const [jsonError, setJsonError] = useState<string | null>(null);

//   useEffect(() => {
//     if (router.pathname === "/json-editor") {
//       setSelectedFeature("Text Mode");
//     }
//   }, [router.pathname]);

//   const breadcrumbItems = [
//     { label: "Home", href: "/", icon: <HomeIcon className="w-4 h-4" /> },
//     { label: "JSON Editor", href: "/json-editor", icon: <FolderIcon className="w-4 h-4" /> },
//     ...(selectedFeature
//       ? [
//           {
//             label: selectedFeature,
//             href: "",
//             icon: <FolderIcon className="w-4 h-4" />,
//             isActive: true,
//           },
//         ]
//       : []),
//   ];

//   const handleSidebarToggle = () => {
//     setIsSidebarMinimized(!isSidebarMinimized);
//   };

//   const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     setJsonData(e.target.value);
//     setJsonError(null);
//     try {
//       JSON.parse(e.target.value);
//     } catch (error: any) {
//       setJsonError(error.message);
//     }
//   };

//   const renderJsonView = () => {
//     try {
//       const parsedData = JSON.parse(jsonData);

//       if (selectedFeature === "Tree Mode") {
//         return (
//           <div className="p-4 bg-white border rounded">
//             <pre className="text-sm">{JSON.stringify(parsedData, null, 2)}</pre>
//           </div>
//         );
//       } else if (selectedFeature === "Table Mode") {
//         const keys = Object.keys(parsedData);
//         const values = Object.values(parsedData);

//         return (
//           <div className="overflow-x-auto bg-white border rounded">
//             <table className="table-auto border-collapse border border-gray-300 w-full">
//               <thead className="bg-gray-200">
//                 <tr>
//                   <th className="border border-gray-300 px-4 py-2 text-left">Key</th>
//                   <th className="border border-gray-300 px-4 py-2 text-left">Value</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {keys.map((key, index) => (
//                   <tr key={index}>
//                     <td className="border border-gray-300 px-4 py-2">{key}</td>
//                     <td className="border border-gray-300 px-4 py-2">{String(values[index])}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         );
//       } else {
//         return (
//           <textarea
//             value={jsonData}
//             onChange={handleJsonChange}
//             className="w-full h-96 p-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         );
//       }
//     } catch (error) {
//       return (
//         <div className="text-red-500">
//           Invalid JSON. Please correct the errors in the Text Mode.
//         </div>
//       );
//     }
//   };

//   const features = [
//     { name: "Text Mode", icon: FaFileAlt },
//     { name: "Tree Mode", icon: FaListUl },
//     { name: "Table Mode", icon: FaTable },
//   ];

//   const getButtonClass = (featureName: string) =>
//     `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all ${
//       selectedFeature === featureName
//         ? "bg-blue-100 text-blue-600 font-semibold shadow-lg"
//         : "text-gray-700 hover:bg-gray-100 hover:shadow-md"
//     }`;

//   return (
//     <Layout
//       menuData={menu}
//       onMenuClick={() => router.push("/json-editor")}
//       selectedMenu="JSON Editor"
//       breadcrumbItems={breadcrumbItems}
//     >
//       <div className="flex h-screen">
//         {/* Sidebar Features */}
//         <div
//           className={`${
//             isSidebarMinimized ? "w-16" : "w-64"
//           } h-full bg-white flex flex-col border-r border-gray-200 shadow transition-all duration-300`}
//         >
//           {/* Header Section */}
//           <div
//             className={`flex items-center ${
//               isSidebarMinimized ? "justify-center" : "justify-between"
//             } p-4 bg-blue-100 border-b border-gray-200`}
//           >
//             {!isSidebarMinimized && (
//               <h1 className="text-lg font-semibold text-blue-600">JSON Editor</h1>
//             )}
//             <button
//               onClick={handleSidebarToggle}
//               className="bg-white rounded-full p-2 text-blue-500 hover:text-blue-600 hover:bg-gray-100 transition-all"
//               title={isSidebarMinimized ? "Expand Sidebar" : "Collapse Sidebar"}
//             >
//               {isSidebarMinimized ? <FaChevronRight /> : <FaChevronLeft />}
//             </button>
//           </div>

//           {/* Feature List */}
//           <ul className="flex-1 space-y-2 mt-4 px-2">
//             {features.map((feature) => (
//               <li key={feature.name}>
//                 <button
//                   className={`${getButtonClass(feature.name)} ${
//                     isSidebarMinimized
//                       ? "justify-center flex-col h-10 w-10 mx-auto"
//                       : "justify-start flex-row w-full"
//                   } flex items-center hover:shadow-lg`}
//                   onClick={() => setSelectedFeature(feature.name)}
//                   title={isSidebarMinimized ? feature.name : undefined}
//                 >
//                   <feature.icon
//                     className={`${
//                       isSidebarMinimized ? "w-5 h-5" : "w-6 h-6"
//                     } text-blue-500`}
//                   />
//                   {!isSidebarMinimized && (
//                     <span className="ml-3 text-sm">{feature.name}</span>
//                   )}
//                 </button>
//               </li>
//             ))}
//           </ul>
//           <footer className="text-center p-4 text-gray-500 text-xs">
//             JsonEditor © 2025
//           </footer>
//         </div>

//         {/* Main Content */}
//         <main className="flex-1 p-6 bg-gray-50">
//           <h1 className="text-2xl font-bold mb-6 text-gray-800">{selectedFeature}</h1>
//           {jsonError && <div className="text-red-500 mb-4">{jsonError}</div>}
//           {renderJsonView()}
//         </main>
//       </div>
//     </Layout>
//   );
// };

// export default JsonEditorPage;

// import React, { useState } from "react";
// import {
//   FaFileAlt,
//   FaListUl,
//   FaTable,
//   FaChevronRight,
//   FaChevronLeft,
// } from "react-icons/fa";

// const JsonEditorPage = () => {
//   const [selectedFeature, setSelectedFeature] = useState("Text Mode");
//   const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
//   const [jsonData, setJsonData] = useState<string>('{ "key": "value" }');
//   const [jsonError, setJsonError] = useState<string | null>(null);

//   const handleSidebarToggle = () => {
//     setIsSidebarMinimized(!isSidebarMinimized);
//   };

//   const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     setJsonData(e.target.value);
//     setJsonError(null);
//     try {
//       JSON.parse(e.target.value);
//     } catch (error: any) {
//       setJsonError(error.message);
//     }
//   };

//   const renderJsonView = () => {
//     try {
//       const parsedData = JSON.parse(jsonData);

//       if (selectedFeature === "Tree Mode") {
//         return (
//           <div className="p-4 bg-white border rounded">
//             <pre className="text-sm">{JSON.stringify(parsedData, null, 2)}</pre>
//           </div>
//         );
//       } else if (selectedFeature === "Table Mode") {
//         const keys = Object.keys(parsedData);
//         const values = Object.values(parsedData);

//         return (
//           <div className="overflow-x-auto bg-white border rounded">
//             <table className="table-auto border-collapse border border-gray-300 w-full">
//               <thead className="bg-gray-200">
//                 <tr>
//                   <th className="border border-gray-300 px-4 py-2 text-left">Key</th>
//                   <th className="border border-gray-300 px-4 py-2 text-left">Value</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {keys.map((key, index) => (
//                   <tr key={index}>
//                     <td className="border border-gray-300 px-4 py-2">{key}</td>
//                     <td className="border border-gray-300 px-4 py-2">{String(values[index])}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         );
//       } else {
//         return (
//           <textarea
//             value={jsonData}
//             onChange={handleJsonChange}
//             className="w-full h-96 p-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         );
//       }
//     } catch (error) {
//       return (
//         <div className="text-red-500">
//           Invalid JSON. Please correct the errors in the Text Mode.
//         </div>
//       );
//     }
//   };

//   const features = [
//     { name: "Text Mode", icon: FaFileAlt },
//     { name: "Tree Mode", icon: FaListUl },
//     { name: "Table Mode", icon: FaTable },
//   ];

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
//             <h1 className="text-lg font-semibold text-blue-600">JSON Editor</h1>
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
//           JsonEditor © 2025
//         </footer>
//       </div>

//       {/* Main Content */}
//       <main className="flex-1 p-6 bg-gray-50">
//         <h1 className="text-2xl font-bold mb-6 text-gray-800">{selectedFeature}</h1>
//         {jsonError && <div className="text-red-500 mb-4">{jsonError}</div>}
//         {renderJsonView()}
//       </main>
//     </div>
//   );
// };

// export default JsonEditorPage;
