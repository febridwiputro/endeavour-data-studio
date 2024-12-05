import React, { useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import CreateButton from "@/components/annotations/base/CreateButton";
import DefaultContent from "@/components/annotations/base/DefaultContent";
import CreateProjectModal from "@/components/annotations/CreateProjectModal";
import ProjectSettingsModal from "@/components/annotations/project/settings/ProjectSettingsModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faFolder } from "@fortawesome/free-solid-svg-icons";

const AnnotationsPage: React.FC = () => {
  const breadcrumbItems = [
    { label: "Home", href: "/", icon: <FontAwesomeIcon icon={faHome} /> },
    {
      label: "Annotations",
      href: "/annotations",
      icon: <FontAwesomeIcon icon={faFolder} />,
    },
    { label: "Details" }, // No icon
  ];

  const [showModal, setShowModal] = useState(false);
  const menuData = [{ name: "Category 1" }, { name: "Category 2" }];

  const [selectedPage, setSelectedPage] = useState("AnnotationProjectPage");

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <Breadcrumb items={breadcrumbItems} />

        {/* Buttons Section */}
        <div className="flex items-center space-x-4">
          {/* Docs Button */}
          <a
            href="#docs"
            className="flex items-center space-x-1 px-4 py-2 text-sm font-medium text-white bg-[#1a4f9d] rounded-[8px] hover:opacity-90 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
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

          {/* Dynamic Button */}
          {selectedPage === "AnnotationProjectPage" ? (
            <CreateButton onClick={handleOpenModal} label="Create Settings" />
          ) : (
            <CreateButton onClick={handleOpenModal} label="Create" />
          )}
        </div>
      </div>

      {showModal && <CreateProjectModal onClose={() => setShowModal(false)} />}
      <DefaultContent menuData={menuData} />
    </div>
  );
};

export default AnnotationsPage;




// import React, { useState } from "react";
// import Breadcrumb from "@/components/annotations/base/Breadcrumb";
// import CreateButton from "@/components/annotations/base/CreateButton";
// import DefaultContent from "@/components/annotations/base/DefaultContent";
// import CreateProjectModal from "@/components/annotations/CreateProjectModal";

// const AnnotationsPage: React.FC = () => {
//   const [showModal, setShowModal] = useState(false);
//   const menuData = [{ name: "Category 1" }, { name: "Category 2" }];

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-4">
//         <Breadcrumb />
//         <CreateButton onClick={() => setShowModal(true)} />
//       </div>
//       {showModal && <CreateProjectModal onClose={() => setShowModal(false)} />}
//       <DefaultContent menuData={menuData} />
//     </div>
//   );
// };

// export default AnnotationsPage;

// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchMenu } from "../features/menu/menuSlice";
// import { RootState, AppDispatch } from "../store/store";
// import Sidebar from "../components/Sidebar";
// import VideoToImage from "../components/video/VideoToImage";
// import ConcatenateVideo from "../components/video/ConcatenateVideo";
// import ImageGrid from "../components/ImageGrid";
// import ProgressModal from "../components/video/ProgressModal";
// import Modal from "../components/video/Modal";
// import { resetProgress } from "../features/video/videoSlice";
// import Header from "../components/Header";
// import CompressImagesInFolder from "../components/images/CompressImagesInFolder";
// import ImageSizeAdjustment from "@/components/images/ImageSizeAdjusment";
// import CreateProjectModal from "@/components/annotations/CreateProjectModal";

// const AnnotationsPage = () => {
//   const dispatch = useDispatch<AppDispatch>();

//   const { menu = [] } = useSelector((state: RootState) => state.menu);
//   const {
//     loading,
//     progress,
//     images = [],
//     error,
//   } = useSelector((state: RootState) => state.video);

//   const [selectedMenu, setSelectedMenu] = useState(""); // Default state for no menu selected
//   const [showProgressModal, setShowProgressModal] = useState(false);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [showErrorModal, setShowErrorModal] = useState(false);
// const [currentDateTime, setCurrentDateTime] = useState("");
// const [searchQuery, setSearchQuery] = useState(""); // State to store search query
// const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // State to store selected category
// const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to control dropdown visibility
// const [showModal, setShowModal] = useState(false);

// interface DropdownProps {
//   menuData: any[];
//   onMenuClick: (menuName: string) => void;
// }

// useEffect(() => {
//   const updateDateTime = () => {
//     const date = new Date();
//     const jakartaTime = date.toLocaleString("en-CA", {
//       timeZone: "Asia/Jakarta",
//       year: "numeric",
//       month: "2-digit",
//       day: "2-digit",
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: true,
//     });
//     setCurrentDateTime(jakartaTime.replace(",", "")); // Remove the comma between date and time
//   };

//   updateDateTime();
//   const interval = setInterval(updateDateTime, 1000); // Update every second

//   return () => clearInterval(interval); // Cleanup interval on component unmount
// }, []);

//   useEffect(() => {
//     dispatch(fetchMenu());
//   }, [dispatch]);

//   useEffect(() => {
//     if (loading) {
//       setShowProgressModal(true);
//     }

//     if (!loading && progress === 100) {
//       setShowProgressModal(false);

//       if (images.length > 0) {
//         setShowSuccessModal(true);
//       } else if (error) {
//         setShowErrorModal(true);
//       }

//       dispatch(resetProgress());
//     }

//     if (error && !loading) {
//       setShowProgressModal(false);
//       setShowErrorModal(true);
//     }
//   }, [loading, progress, images, error, dispatch]);

//   const handleMenuClick = (menuName: string) => {
//     setSelectedMenu(menuName);
//   };

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchQuery(e.target.value);
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     // Implement search logic here
//   };

//   const handleDropdownToggle = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//   };

//   const handleCategoryClick = (categoryName: string) => {
//     setSelectedCategory(categoryName);
//     setIsDropdownOpen(false);
//     // onMenuClick(categoryName);
//   };

//   const renderBreadcrumb = () => (
//     <nav aria-label="Breadcrumb" className="flex">
//       <ol className="flex overflow-hidden rounded-lg border border-gray-200 text-gray-600">
//         <li className="flex items-center">
//           <a
//             href="#"
//             className="flex h-10 items-center gap-1.5 bg-gray-100 px-4 transition hover:text-gray-900"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="size-4"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
//               />
//             </svg>
//             <span className="ms-1.5 text-xs font-medium"> Home </span>
//           </a>
//         </li>

//         <li className="relative flex items-center">
//           <span className="absolute inset-y-0 -start-px h-10 w-4 bg-gray-100 [clip-path:_polygon(0_0,_0%_100%,_100%_50%)]"></span>

//           <a
//             href="#"
//             className="flex h-10 items-center bg-white pe-4 ps-8 text-xs font-medium transition hover:text-gray-900"
//           >
//             Annotations
//           </a>
//         </li>
//       </ol>
//     </nav>
//   );

//   // Card design from your example
// const renderCard = () => (
//   <a href="#" className="block rounded-lg p-4 shadow-sm shadow-indigo-100">
//     <img
//       alt=""
//       src="https://www.batamnews.co.id/foto_berita/2023/04/2023-04-10-kenapa-mobil-di-batam-tak-boleh-dibawa-keluar-pulau-batam-atau-mudik.jpeg"
//       className="h-56 w-full rounded-md object-cover"
//     />

//     <div className="mt-2">
//       <dl>
//         <div>
//           <dt className="sr-only">DateTime</dt>
//           <dd className="text-sm text-gray-500">{currentDateTime}</dd>
//         </div>

//         <div>
//           <dt className="sr-only">Address</dt>
//           <dd className="font-medium">Automatic License Plate Recognition</dd>
//         </div>
//       </dl>

//       <div className="mt-6 flex items-center gap-8 text-xs">
//         <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
//           <svg
//             className="size-4 text-indigo-700"
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
//             />
//           </svg>

//           <div className="mt-1.5 sm:mt-0">
//             <p className="text-gray-500">Parking</p>
//             <p className="font-medium">2 spaces</p>
//           </div>
//         </div>

//         <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
//           <svg
//             className="size-4 text-indigo-700"
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
//             />
//           </svg>

//           <div className="mt-1.5 sm:mt-0">
//             <p className="text-gray-500">Bathroom</p>
//             <p className="font-medium">2 rooms</p>
//           </div>
//         </div>

//         <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
//           <svg
//             className="size-4 text-indigo-700"
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
//             />
//           </svg>

//           <div className="mt-1.5 sm:mt-0">
//             <p className="text-gray-500">Bedroom</p>
//             <p className="font-medium">4 rooms</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   </a>
// );

//   const renderCardEditor = () => (
//     <article className="flex bg-white transition hover:shadow-xl">
//       <div className="rotate-180 p-1 [writing-mode:_vertical-lr]">
//         <time
//           dateTime="2022-10-10"
//           className="flex items-center justify-between gap-2 text-xs font-bold uppercase text-gray-900"
//         >
//           <span>2022</span>
//           <span className="w-px flex-1 bg-gray-900/10"></span>
//           <span>Oct 10</span>
//         </time>
//       </div>

//       <div className="hidden sm:block sm:basis-40">
//         <img
//           alt=""
//           src="https://images.unsplash.com/photo-1609557927087-f9cf8e88de18?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
//           className="h-40 w-full object-cover"
//         />
//       </div>

//       <div className="flex flex-1 items-center border-s border-gray-900/10 p-2 sm:border-l-transparent sm:p-4">
//         <div>
//           <a href="#">
//             <h3 className="font-bold uppercase text-gray-900 text-sm">
//               Finding the right guitar for your style - 5 tips
//             </h3>
//           </a>

//           <p className="mt-1 line-clamp-2 text-xs/relaxed text-gray-700">
//             Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae
//             dolores, possimus pariatur animi temporibus nesciunt praesentium
//             dolore sed nulla ipsum eveniet corporis.
//           </p>
//         </div>
//       </div>

//       <div className="sm:flex sm:items-end sm:justify-end">
//         <a
//           href="#"
//           className="block bg-yellow-300 px-4 py-2 text-center text-xs font-bold uppercase text-gray-900 transition hover:bg-yellow-400"
//         >
//           Read Blog
//         </a>
//       </div>
//     </article>
//   );

// const renderDefaultContent = (menuData: any[]) => (
//   <section
//     style={{ color: "var(--default-blue)" }}
//     className="bg-white w-full"
//   >
//     <div className="px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
//       <div className="mx-auto max-w-full text-center">
//         <h2
//           style={{ color: "var(--default-blue)" }}
//           className="text-3xl font-bold sm:text-4xl"
//         >
//           Begin your process with DS
//         </h2>
//         <p style={{ color: "var(--default-blue)" }} className="mt-4">
//           Lorem ipsum, dolor sit amet consectetur adipisicing elit.
//           Consequuntur aliquam doloribus nesciunt eos fugiat. Vitae aperiam
//           fugit consequuntur saepe laborum.
//         </p>
//         <form
//           className="w-[600px] mx-auto bg-white p-4 shadow-md rounded-lg"
//           onSubmit={handleSubmit}
//         >
//           <div className="flex">
//             <label
//               htmlFor="search-dropdown"
//               className="mb-2 text-sm font-medium text-gray-900 sr-only"
//             >
//               Search
//             </label>

//             {/* Dropdown Button */}
//             <div className="relative flex-shrink-0">
//               <button
//                 id="dropdown-button"
//                 onClick={handleDropdownToggle}
//                 className="inline-flex h-full items-center py-2.5 px-4 text-sm font-medium text-center bg-white border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100"
//                 type="button"
//                 style={{ color: "var(--default-blue)" }}
//               >
//                 {selectedCategory || "All categories"}
//                 <svg
//                   className="w-2.5 h-2.5 ms-2.5"
//                   aria-hidden="true"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 10 6"
//                 >
//                   <path
//                     stroke="currentColor"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="m1 1 4 4 4-4"
//                   />
//                 </svg>
//               </button>

//               {/* Dropdown List */}
//               {isDropdownOpen && (
//                 <div className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 mt-2">
//                   <ul
//                     className="py-2 text-sm"
//                     style={{ color: "var(--default-blue)" }}
//                   >
//                     {menuData.map((menuItem, index) => (
//                       <li key={index}>
//                         <button
//                           onClick={() => handleCategoryClick(menuItem.name)}
//                           className="block w-full px-4 py-2 text-left hover:bg-gray-100"
//                         >
//                           {menuItem.name}
//                         </button>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//             </div>

//             {/* Search Input */}
//             <div className="relative w-full">
//               <input
//                 type="search"
//                 id="search-dropdown"
//                 value={searchQuery}
//                 onChange={handleSearchChange}
//                 className="block h-full p-2.5 w-full z-20 bg-white border border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-e-lg"
//                 style={{ color: "var(--default-blue)" }}
//                 placeholder="Search Mockups, Logos, Design Templates..."
//                 required
//               />

//               {/* Search Button */}
//               <button
//                 type="submit"
//                 className="absolute top-0 right-0 p-2.5 text-sm font-medium h-full text-white rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
//                 style={{ backgroundColor: "var(--default-blue)" }}
//               >
//                 <svg
//                   className="w-4 h-4"
//                   aria-hidden="true"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 20 20"
//                 >
//                   <path
//                     stroke="currentColor"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
//                   />
//                 </svg>
//                 <span className="sr-only">Search</span>
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>

//         {/* 4 cards in each row (total 8 cards) */}
//         <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
//           {[...Array(4)].map((_, index) => (
//             <div key={index}>
//               {" "}
//               {/* Add key here */}
//               {renderCard()}
//             </div>
//           ))}
//         </div>

//         <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
//           {[...Array(4)].map((_, index) => (
//             <div key={index}>
//               {" "}
//               {/* Add key here */}
//               {renderCard()}
//             </div>
//           ))}
//         </div>

//         <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
//           {[...Array(4)].map((_, index) => (
//             <div key={index}>
//               {" "}
//               {/* Add key here */}
//               {renderCardEditor()}
//             </div>
//           ))}
//         </div>
//         <div className="mt-12 text-center">
//           <a
//             href="#"
//             className="inline-block rounded px-12 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition"
//           >
//             Get Started Today
//           </a>
//         </div>
//       </div>
//     </section>
//   );

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-4">
//         {/* Breadcrumb */}
//         <nav aria-label="Breadcrumb" className="flex">
//           <ol className="flex overflow-hidden rounded-lg border border-gray-200 text-gray-600">
//             <li className="flex items-center">
//               <a
//                 href="#"
//                 className="flex h-10 items-center gap-1.5 bg-gray-100 px-4 transition hover:text-gray-900"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="size-4"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
//                   />
//                 </svg>
//                 <span className="ms-1.5 text-xs font-medium"> Home </span>
//               </a>
//             </li>

//             <li className="relative flex items-center">
//               <span className="absolute inset-y-0 -start-px h-10 w-4 bg-gray-100 [clip-path:_polygon(0_0,_0%_100%,_100%_50%)]"></span>

//               <a
//                 href="#"
//                 className="flex h-10 items-center bg-white pe-4 ps-8 text-xs font-medium transition hover:text-gray-900"
//               >
//                 Annotations
//               </a>
//             </li>
//           </ol>
//         </nav>

//         {/* Create Button */}
//         <button
//           className="px-4 py-2 text-sm font-medium text-white bg-[#1a4e9d] rounded-[8px] hover:bg-[#173e85] transition"
//           onClick={() => setShowModal(true)}
//         >
//           Create
//         </button>
//       </div>

//       {/* Modal */}
//       {showModal && <CreateProjectModal onClose={() => setShowModal(false)} />}
//       {!selectedMenu && renderDefaultContent(menu)}
//     </div>
//   );
// };

// export default AnnotationsPage;
