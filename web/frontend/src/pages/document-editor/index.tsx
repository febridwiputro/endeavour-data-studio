import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import {
  HiDocumentText,
  HiAdjustments,
  HiOutlineScissors,
  HiOutlineSearch,
  HiOutlineDocumentDuplicate,
  HiOutlineDocumentAdd,
  HiOutlineShieldCheck,
} from "react-icons/hi";
import { HomeIcon, FolderIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/router";

const DocumentEditorPage = () => {
  type FeatureKeys =
    | "Document Processing"
    | "Spreadsheet Processing"
    | "Presentation Processing"
    | "PDF Processing"
    | "Ebook Processing"
    | "Additional Features";

  const features = [
    { name: "Document Processing", icon: HiDocumentText },
    { name: "Spreadsheet Processing", icon: HiAdjustments },
    { name: "Presentation Processing", icon: HiOutlineDocumentDuplicate },
    { name: "PDF Processing", icon: HiOutlineDocumentAdd },
    { name: "Ebook Processing", icon: HiOutlineShieldCheck },
    { name: "Additional Features", icon: HiOutlineSearch },
  ];

  const subFeatures: Record<
    FeatureKeys,
    { name: string; icon: React.ReactNode }[]
  > = {
    "Document Processing": [
      { name: "Document Conversion", icon: <HiAdjustments /> },
      { name: "Document Merging", icon: <HiOutlineDocumentDuplicate /> },
      { name: "Document Splitting", icon: <HiOutlineScissors /> },
      { name: "Document Watermarking", icon: <HiOutlineSearch /> },
      { name: "Password Protection", icon: <HiOutlineShieldCheck /> },
    ],
    "Spreadsheet Processing": [
      { name: "Spreadsheet Conversion", icon: <HiAdjustments /> },
      { name: "Data Cleaning", icon: <HiOutlineSearch /> },
      { name: "Chart Extraction", icon: <HiOutlineDocumentDuplicate /> },
    ],
    "Presentation Processing": [
      { name: "Presentation Conversion", icon: <HiOutlineSearch /> },
      { name: "Slide Extraction", icon: <HiOutlineScissors /> },
      { name: "Add Speaker Notes", icon: <HiDocumentText /> },
    ],
    "PDF Processing": [
      { name: "Compress PDF", icon: <HiAdjustments /> },
      { name: "Merge PDF", icon: <HiOutlineDocumentDuplicate /> },
      { name: "Convert PDF to Images", icon: <HiOutlineDocumentAdd /> },
      { name: "PDF OCR", icon: <HiOutlineSearch /> },
      { name: "Add Watermark to PDF", icon: <HiOutlineShieldCheck /> },
    ],
    "Ebook Processing": [
      { name: "Merge Ebooks", icon: <HiOutlineDocumentDuplicate /> },
      { name: "Ebook Conversion", icon: <HiAdjustments /> },
    ],
    "Additional Features": [
      { name: "Digital Signature", icon: <HiOutlineShieldCheck /> },
      { name: "Document Comparison", icon: <HiOutlineSearch /> },
    ],
  };

  const { menu } = useSelector((state: RootState) => state.menu);
  const router = useRouter();

  const [selectedFeature, setSelectedFeature] = useState<FeatureKeys>(
    "Document Processing"
  );
  const [selectedSubFeature, setSelectedSubFeature] = useState<string | null>(
    null
  );
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

  useEffect(() => {
    if (router.pathname === "/document-editor") {
      setSelectedFeature("Document Processing");
    }
  }, [router.pathname]);

  const breadcrumbItems = [
    { label: "Home", href: "/", icon: <HomeIcon className="w-4 h-4" /> },
    {
      label: "Document Editor",
      href: "/document-editor",
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

  const renderSubFeatureMenuBar = () => {
    const subFeatureList = subFeatures[selectedFeature] || [];

    if (subFeatureList.length === 0) return null;

    return (
      <div className="bg-white p-4 rounded shadow flex gap-4 items-center mb-6 overflow-x-auto">
        {subFeatureList.map((subFeature) => (
          <button
            key={subFeature.name}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition ${
              selectedSubFeature === subFeature.name
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-gray-100 text-gray-700"
            }`}
            onClick={() => setSelectedSubFeature(subFeature.name)}
          >
            <span className="text-blue-500">{subFeature.icon}</span>
            <span>{subFeature.name}</span>
          </button>
        ))}
      </div>
    );
  };

  const renderFeatureUI = () => {
    switch (selectedSubFeature) {
      case "Compress PDF":
        return (
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Compress PDF
            </h2>
            <p className="text-gray-600">
              Upload a PDF to reduce its file size.
            </p>
            <input
              type="file"
              accept=".pdf"
              className="mt-4 mb-6 border border-gray-300 p-2 rounded w-full"
            />
            <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
              Compress PDF
            </button>
          </div>
        );
      case "Merge PDF":
        return (
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Merge PDF
            </h2>
            <p className="text-gray-600">
              Upload multiple PDFs to merge them into one file.
            </p>
            <input
              type="file"
              accept=".pdf"
              multiple
              className="mt-4 mb-6 border border-gray-300 p-2 rounded w-full"
            />
            <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
              Merge PDFs
            </button>
          </div>
        );
      case "Convert PDF to Images":
        return (
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Convert PDF to Images
            </h2>
            <p className="text-gray-600">
              Upload a PDF to extract its pages as images.
            </p>
            <input
              type="file"
              accept=".pdf"
              className="mt-4 mb-6 border border-gray-300 p-2 rounded w-full"
            />
            <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
              Convert PDF
            </button>
          </div>
        );
      case "Add Watermark to PDF":
        return (
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Add Watermark
            </h2>
            <p className="text-gray-600">
              Upload a PDF and enter a watermark to apply it.
            </p>
            <input
              type="file"
              accept=".pdf"
              className="mt-4 mb-4 border border-gray-300 p-2 rounded w-full"
            />
            <input
              type="text"
              placeholder="Enter watermark text"
              className="border border-gray-300 p-2 rounded w-full mb-6"
            />
            <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
              Add Watermark
            </button>
          </div>
        );
      default:
        return (
          <p className="text-gray-600">
            Select a sub-feature to view its details.
          </p>
        );
    }
  };

  return (
    <Layout
      menuData={menu}
      onMenuClick={() => router.push("/document-editor")}
      selectedMenu="Document Editor"
      breadcrumbItems={breadcrumbItems}
    >
      <div className="flex h-screen">
        {/* Sidebar */}
        <div
          className={`${
            isSidebarMinimized ? "w-16" : "w-64"
          } h-full bg-white flex flex-col border-r border-gray-200 shadow transition-all duration-300`}
        >
          <div
            className={`flex items-center ${
              isSidebarMinimized ? "justify-center" : "justify-between"
            } p-4 bg-blue-100 border-b border-gray-200`}
          >
            {!isSidebarMinimized && (
              <h1 className="text-lg font-semibold text-blue-600">
                Document Editor
              </h1>
            )}
            <button
              onClick={handleSidebarToggle}
              className="bg-white rounded-full p-2 text-blue-500 hover:text-blue-600 hover:bg-gray-100 transition-all"
              title={isSidebarMinimized ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              <HiOutlineDocumentAdd className="w-5 h-5" />
            </button>
          </div>

          <ul className="flex-1 space-y-2 mt-4 px-2">
            {features.map((feature) => (
              <li key={feature.name}>
                <button
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                    selectedFeature === feature.name
                      ? "bg-blue-100 text-blue-600 font-semibold shadow-lg"
                      : "text-gray-700 hover:bg-gray-100 hover:shadow-md"
                  } ${
                    isSidebarMinimized
                      ? "justify-center flex-col h-10 w-10 mx-auto"
                      : "justify-start flex-row w-full"
                  }`}
                  onClick={() => {
                    setSelectedFeature(feature.name as FeatureKeys);
                    setSelectedSubFeature(null); // Reset sub-feature when feature is changed
                  }}
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
            DocumentEditor © 2025
          </footer>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-50">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">
            {selectedFeature}
          </h1>
          {renderSubFeatureMenuBar()}
          <div>{renderFeatureUI()}</div>
        </main>
      </div>
    </Layout>
  );
};

export default DocumentEditorPage;

// import React, { useState, useEffect } from "react";
// import Layout from "@/components/Layout";
// import {
//   FaFileAlt,
//   FaCompress,
//   FaWater,
//   FaLock,
//   FaEdit,
//   FaChevronRight,
//   FaChevronLeft,
// } from "react-icons/fa";
// import { HomeIcon, FolderIcon } from "@heroicons/react/24/outline";
// import { useSelector } from "react-redux";
// import { RootState } from "@/store/store";
// import { useRouter } from "next/router";

// const DocumentEditorPage = () => {
//   // Feature keys
//   type FeatureKeys =
//     | "Document Processing"
//     | "Spreadsheet Processing"
//     | "Presentation Processing"
//     | "PDF Processing"
//     | "Ebook Processing"
//     | "Additional Features";

//   const features = [
//     { name: "Document Processing", icon: FaFileAlt },
//     { name: "Spreadsheet Processing", icon: FaCompress },
//     { name: "Presentation Processing", icon: FaEdit },
//     { name: "PDF Processing", icon: FaFileAlt },
//     { name: "Ebook Processing", icon: FaWater },
//     { name: "Additional Features", icon: FaLock },
//   ];

//   const subFeatures: Record<FeatureKeys, string[]> = {
//     "Document Processing": [
//       "Document Conversion",
//       "Document Merging",
//       "Document Splitting",
//       "Document Watermarking",
//       "Document Password Protection",
//       "Document Version Control",
//     ],
//     "Spreadsheet Processing": [
//       "Spreadsheet Conversion",
//       "Spreadsheet Merging",
//       "Data Cleaning",
//       "Spreadsheet Data Validation",
//       "Formula Retention",
//       "Chart Extraction",
//     ],
//     "Presentation Processing": [
//       "Presentation Conversion",
//       "Slide Extraction",
//       "Presentation Compression",
//       "Slide Reordering",
//       "Add Speaker Notes",
//     ],
//     "PDF Processing": [
//       "Compress PDF",
//       "Merge PDF",
//       "Convert PDF to Images",
//       "PDF OCR",
//       "Add Watermark to PDF",
//     ],
//     "Ebook Processing": [
//       "Merge Ebooks",
//       "Ebook Conversion",
//       "Ebook Metadata Management",
//       "Ebook Split",
//     ],
//     "Additional Features": [
//       "Search and Extract from Documents",
//       "Document Comparison",
//       "Document Encryption and Decryption",
//       "Batch Document Search",
//       "Digital Signature",
//     ],
//   };

//   const { menu } = useSelector((state: RootState) => state.menu);
//   const router = useRouter();

//   const [selectedFeature, setSelectedFeature] = useState<FeatureKeys>("Document Processing");
//   const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

//   useEffect(() => {
//     if (router.pathname === "/document-editor") {
//       setSelectedFeature("Document Processing");
//     }
//   }, [router.pathname]);

//   const breadcrumbItems = [
//     { label: "Home", href: "/", icon: <HomeIcon className="w-4 h-4" /> },
//     { label: "Document Editor", href: "/document-editor", icon: <FolderIcon className="w-4 h-4" /> },
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

//   const getButtonClass = (featureName: string) =>
//     `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all ${
//       selectedFeature === featureName
//         ? "bg-blue-100 text-blue-600 font-semibold shadow-lg"
//         : "text-gray-700 hover:bg-gray-100 hover:shadow-md"
//     }`;

//   return (
//     <Layout
//       menuData={menu}
//       onMenuClick={() => router.push("/document-editor")}
//       selectedMenu="Document Editor"
//       breadcrumbItems={breadcrumbItems}
//     >
//       <div className="flex h-screen">
//         {/* Sidebar */}
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
//               <h1 className="text-lg font-semibold text-blue-600">
//                 Document Editor
//               </h1>
//             )}
//             <button
//               onClick={handleSidebarToggle}
//               className="bg-white rounded-full p-2 text-blue-500 hover:text-blue-600 hover:bg-gray-100 transition-all"
//               title={isSidebarMinimized ? "Expand Sidebar" : "Collapse Sidebar"}
//             >
//               {isSidebarMinimized ? <FaChevronRight /> : <FaChevronLeft />}
//             </button>
//           </div>

//           {/* Menu Items */}
//           <ul className="flex-1 space-y-2 mt-4 px-2">
//             {features.map((feature) => (
//               <li key={feature.name}>
//                 <button
//                   className={`${getButtonClass(feature.name)} ${
//                     isSidebarMinimized
//                       ? "justify-center flex-col h-10 w-10 mx-auto"
//                       : "justify-start flex-row w-full"
//                   } flex items-center hover:shadow-lg`}
//                   onClick={() => setSelectedFeature(feature.name as FeatureKeys)}
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
//             DocumentEditor © 2025
//           </footer>
//         </div>

//         {/* Main Content */}
//         <main className="flex-1 p-6 bg-gray-50">
//           <h1 className="text-2xl font-bold mb-6 text-gray-800">{selectedFeature}</h1>
//           <h2 className="text-lg font-semibold mb-4">Sub-Features:</h2>
//           <ul className="list-disc list-inside space-y-2">
//             {subFeatures[selectedFeature]?.map((subFeature) => (
//               <li key={subFeature} className="text-gray-700">
//                 {subFeature}
//               </li>
//             ))}
//           </ul>
//           <button className="mt-6 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
//             Learn More
//           </button>
//         </main>
//       </div>
//     </Layout>
//   );
// };

// export default DocumentEditorPage;
