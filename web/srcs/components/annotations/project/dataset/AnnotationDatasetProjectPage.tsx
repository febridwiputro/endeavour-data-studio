import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { api } from "@/services/apiConfig";
import Pagination from "./Pagination";
import Header from "./Header";
import SearchBar from "./SearchBar";
import Filters from "./Filters";
import GridView from "./GridView";
import ViewModeSelector from "./ViewModeSelector";

const AnnotationDatasetProjectPage = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState<"grid" | "list">("grid");
  const [selectedImages, setSelectedImages] = useState<number[]>([]);

  const { accessToken } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchData = async () => {
      if (!accessToken) {
        console.error("Access token is missing. Please log in.");
        return;
      }

      setLoading(true);
      try {
        const response = await api.get(`/annotations/upload-data/1`, {
          params: { page, per_page: perPage },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const { data: files, pagination } = response.data;
        setData(files);
        setTotalPages(pagination.total_pages);
        setTotalItems(pagination.total_items);
      } catch (error: any) {
        console.error(
          "Error fetching paginated data:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, perPage, accessToken]);

  if (loading) return <p>Loading...</p>;
  if (!data.length) return <p>No data available.</p>;

  const handleImageSelect = (index: number) => {
    setSelectedImages((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="ml-4"> {/* Add margin-left here */}
      <Header />
      <SearchBar />
      <Filters perPage={perPage} setPerPage={setPerPage} />
      {/* Selected Images and View Mode Section */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-gray-600">
          {selectedImages.length} images selected
        </div>
        <ViewModeSelector activeView={activeView} setActiveView={setActiveView} />
      </div>
      <GridView
        data={data}
        activeView={activeView}
        selectedImages={selectedImages}
        handleImageSelect={handleImageSelect}
      />
      <Pagination
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        totalItems={totalItems}
        perPage={perPage}
      />
    </div>
  );
};

export default AnnotationDatasetProjectPage;


// import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import { RootState } from "@/store/store";
// import { api } from "@/services/apiConfig";
// import Pagination from "./Pagination";
// import Header from "./Header";
// import SearchBar from "./SearchBar";
// import Filters from "./Filters";
// import GridView from "./GridView";
// import ViewModeSelector from "./ViewModeSelector";

// const AnnotationDatasetProjectPage = () => {
//   const [page, setPage] = useState(1);
//   const [perPage, setPerPage] = useState(10);
//   const [data, setData] = useState([]);
//   const [totalPages, setTotalPages] = useState(0);
//   const [totalItems, setTotalItems] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [activeView, setActiveView] = useState<"grid" | "list">("grid");
//   const [selectedImages, setSelectedImages] = useState<number[]>([]);

//   const { accessToken } = useSelector((state: RootState) => state.auth);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!accessToken) {
//         console.error("Access token is missing. Please log in.");
//         return;
//       }

//       setLoading(true);
//       try {
//         const response = await api.get(`/annotations/upload-data/1`, {
//           params: { page, per_page: perPage },
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         });

//         const { data: files, pagination } = response.data;
//         setData(files);
//         setTotalPages(pagination.total_pages);
//         setTotalItems(pagination.total_items);
//       } catch (error: any) {
//         console.error(
//           "Error fetching paginated data:",
//           error.response?.data || error.message
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [page, perPage, accessToken]);

//   if (loading) return <p>Loading...</p>;
//   if (!data.length) return <p>No data available.</p>;

//   const handleImageSelect = (index: number) => {
//     setSelectedImages((prev) =>
//       prev.includes(index)
//         ? prev.filter((i) => i !== index)
//         : [...prev, index]
//     );
//   };

//   return (
//     <div>
//       <Header />
//       <SearchBar />
//       <Filters perPage={perPage} setPerPage={setPerPage} />
//       {/* Selected Images and View Mode Section */}
//       <div className="flex justify-between items-center mb-6">
//         <div className="text-sm text-gray-600">
//           {selectedImages.length} images selected
//         </div>
//         <ViewModeSelector activeView={activeView} setActiveView={setActiveView} />
//       </div>
//       <GridView
//         data={data}
//         activeView={activeView}
//         selectedImages={selectedImages}
//         handleImageSelect={handleImageSelect}
//       />
//       <Pagination
//         page={page}
//         setPage={setPage}
//         totalPages={totalPages}
//         totalItems={totalItems}
//         perPage={perPage}
//       />
//     </div>
//   );
// };

// export default AnnotationDatasetProjectPage;







// import React, { useState, useEffect } from "react";
// import { usePagination, PaginationResponse } from "@/utils/usePagination";
// import { useSelector } from "react-redux";
// import { RootState } from "@/store/store"; // Ensure you have this set up
// import { api } from "@/services/apiConfig"; // Import the API instance
// import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

// interface UploadFile {
//   upload_id: number;
//   file_name: string;
//   img_url: string;
//   uploaded_at: string;
// }

// const AnnotationDatasetProjectPage: React.FC = () => {
//   const { page, perPage, setPage, setPerPage, formatResponse } =
//     usePagination();
//   const [data, setData] = useState<PaginationResponse<UploadFile> | null>(null);
//   const [loading, setLoading] = useState(false);

//   // Manage view mode (grid or list)
//   const [activeView, setActiveView] = useState<"grid" | "list">("grid");

//   // Retrieve the access token from the Redux store
//   const { accessToken } = useSelector((state: RootState) => state.auth);

//   const [isSplitDropdownOpen, setIsSplitDropdownOpen] = useState(false);
//   const [splitOption, setSplitOption] = useState("Split");

//   const [imagesSelected, setImagesSelected] = useState(0);

//   const sortByOptions = ["Newest", "Updated", "Filename", "Oldest"];
//   const [selectedSortBy, setSelectedSortBy] = useState("Newest");
//   const [isSortByDropdownOpen, setIsSortByDropdownOpen] = useState(false);
//   const [fullScreenImage, setFullScreenImage] = useState<number | null>(null);
//   const [selectedImages, setSelectedImages] = useState<number[]>([]);

//   const handleImageSelect = (index: number) => {
//     setSelectedImages((prev) => {
//       const updatedSelection = prev.includes(index)
//         ? prev.filter((i) => i !== index)
//         : [...prev, index];
//       setImagesSelected(updatedSelection.length);
//       return updatedSelection;
//     });
//   };

//   const handleSplitOptionSelect = (option: string) => {
//     setSplitOption(option);
//     setIsSplitDropdownOpen(false);
//   };

//   const handleSortByOptionSelect = (option: string) => {
//     setSelectedSortBy(option);
//     setIsSortByDropdownOpen(false);
//   };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (!accessToken) {
  //       console.error("Access token is missing. Please log in.");
  //       return;
  //     }

  //     setLoading(true);
  //     try {
  //       const response = await api.get(`/annotations/upload-data/1`, {
  //         params: { page, per_page: perPage },
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       });
  //       const { data: files, pagination } = response.data;

  //       setData(
  //         formatResponse(
  //           files,
  //           pagination.total_items,
  //           pagination.total_pages,
  //           pagination.next_page
  //             ? parseInt(pagination.next_page.split("=")[1])
  //             : null,
  //           pagination.previous_page
  //             ? parseInt(pagination.previous_page.split("=")[1])
  //             : null
  //         )
  //       );
  //     } catch (error: any) {
  //       console.error(
  //         "Error fetching paginated data:",
  //         error.response?.data || error.message
  //       );
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [page, perPage, accessToken]);

  // if (loading) return <p>Loading...</p>;

  // if (!data) return <p>No data available.</p>;

//   const generatePageNumbers = () => {
//     const { total_pages } = data.pagination;
//     const maxPagesToShow = 5; // Limit the number of pages to 5
//     let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
//     let endPage = Math.min(total_pages, startPage + maxPagesToShow - 1);

//     if (endPage - startPage + 1 < maxPagesToShow) {
//       startPage = Math.max(1, endPage - maxPagesToShow + 1);
//     }

//     return Array.from(
//       { length: endPage - startPage + 1 },
//       (_, idx) => startPage + idx
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       {/* Header Section */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-semibold text-gray-800 flex items-center space-x-2">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-6 w-6"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M15 12H9m4 8H7a2 2 0 01-2-2V7a2 2 0 012-2h5m10 12l-5-5m0 0l-5-5m5 5h-5"
//             />
//           </svg>
//           <span>Dataset</span>
//         </h1>
//         <div className="flex items-center space-x-4">
//           <button className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-md shadow hover:bg-gray-300">
//             + Generate Version
//           </button>
//           <button className="px-4 py-2 bg-[#1a4f9d] text-white text-sm rounded-md shadow hover:bg-[#173e85]">
//             Quick Train
//           </button>
//         </div>
//       </div>

//       {/* Search Bar Section */}
//       <div className="flex items-center space-x-4 mb-1">
//         {" "}
//         {/* Ubah mb-6 menjadi mb-3 */}
//         <div className="flex items-center border border-gray-300 rounded-md overflow-hidden w-full focus-within:border-blue-500 transition-colors">
//           <input
//             type="text"
//             placeholder="Search images"
//             className="px-4 py-2 text-sm flex-grow bg-white text-gray-700 focus:outline-none"
//           />
//           <div className="h-full w-px bg-gray-300"></div> {/* Separator line */}
//           <button className="px-4 py-2 bg-white text-gray-700 text-sm flex items-center space-x-2 hover:bg-gray-100">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M10 10l6 6m-6-6a6 6 0 1112 0 6 6 0 01-12 0z"
//               />
//             </svg>
//             <span>Search</span>
//           </button>
//         </div>
//       </div>

//       {/* Search and Filters Section */}
//       <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
//         <div className="flex items-center space-x-4 flex-grow">
//           <input
//             type="text"
//             placeholder="Filter by filename"
//             className="px-4 py-2 border border-gray-300 rounded-md text-sm flex-grow"
//           />
//           {/* Split Dropdown */}
//           <div className="relative">
//             <button
//               className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-md shadow hover:bg-gray-300 flex items-center"
//               onClick={() => setIsSplitDropdownOpen(!isSplitDropdownOpen)}
//             >
//               {splitOption}
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="ml-2 h-4 w-4"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M19 9l-7 7-7-7"
//                 />
//               </svg>
//             </button>
//             {isSplitDropdownOpen && (
//               <div className="absolute mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-lg z-10">
//                 <ul className="py-1">
//                   {["All", "Train", "Valid", "Test"].map((option) => (
//                     <li
//                       key={option}
//                       className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700 text-sm"
//                       onClick={() => handleSplitOptionSelect(option)}
//                     >
//                       {option}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </div>
//           <button className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-md shadow hover:bg-gray-300">
//             Classes
//           </button>
//         </div>
//         <div className="flex items-center space-x-4">
//           {/* Sort By Dropdown */}
//           <div className="relative">
//             <button
//               className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-md shadow hover:bg-gray-300 flex items-center"
//               onClick={() => setIsSortByDropdownOpen(!isSortByDropdownOpen)}
//             >
//               Sort By: {selectedSortBy}
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="ml-2 h-4 w-4"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M19 9l-7 7-7-7"
//                 />
//               </svg>
//             </button>
//             {isSortByDropdownOpen && (
//               <div className="absolute mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-lg z-10">
//                 <ul className="py-1">
//                   {sortByOptions.map((option) => (
//                     <li
//                       key={option}
//                       className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700 text-sm"
//                       onClick={() => handleSortByOptionSelect(option)}
//                     >
//                       {option}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </div>
//           <button className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-md shadow hover:bg-gray-300 flex items-center space-x-2">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M4 16L10 10M10 10l4 4m0 0l6-6M4 16h16"
//               />
//               <circle cx="9" cy="7" r="3" strokeWidth={2} />
//             </svg>
//             <span>Search by Image</span>
//           </button>
//           <select
//             value={perPage}
//             onChange={(e) => setPerPage(Number(e.target.value))}
//             className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-md shadow hover:bg-gray-300 flex items-center space-x-2"
//           >
//             <option value={10}>10</option>
//             <option value={20}>20</option>
//             <option value={50}>50</option>
//           </select>
//         </div>
//       </div>

//       {/* Selected Images and View Mode */}
//       <div className="flex justify-between items-center mb-6">
//         <div className="text-sm text-gray-600">
//           {imagesSelected} images selected
//         </div>
//         <div className="flex space-x-2">
//           <button
//             onClick={() => setActiveView("list")}
//             className={`px-3 py-2 border rounded-l-md ${
//               activeView === "list"
//                 ? "bg-[#e6f0ff] border-[#1a4f9d] text-[#1a4f9d]"
//                 : "bg-white border-gray-300 text-gray-700"
//             } hover:bg-gray-100`}
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M4 6h16M4 12h16m-7 6h7"
//               />
//             </svg>
//           </button>
//           <button
//             onClick={() => setActiveView("grid")}
//             className={`px-3 py-2 border rounded-r-md ${
//               activeView === "grid"
//                 ? "bg-[#e6f0ff] border-[#1a4f9d] text-[#1a4f9d]"
//                 : "bg-white border-gray-300 text-gray-700"
//             } hover:bg-gray-100`}
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M4 6h4m-4 6h4m-4 6h4M10 6h10M10 12h10M10 18h10"
//               />
//             </svg>
//           </button>
//         </div>
//       </div>

      // {/* Grid Section */}
      // <div
      //   className={`grid gap-6 ${
      //     activeView === "grid"
      //       ? "grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
      //       : "grid-cols-1"
      //   }`}
      // >
      //   {data.data.map((file, index) => {
      //     const isSelected = selectedImages.includes(index);
      //     const isImageFullScreen = fullScreenImage === index; // Track if this image is in full-screen

      //     return (
      //       <div
      //         key={file.upload_id}
      //         className="relative border border-gray-200 rounded-md overflow-hidden shadow-sm group"
      //         style={{
      //           width: activeView === "grid" ? "200px" : "100%",
      //           height: activeView === "grid" ? "200px" : "auto",
      //         }}
      //       >
      //         {/* Use img_url for displaying images */}
      //         <img
      //           src={file.img_url}
      //           alt={file.file_name}
      //           className="object-cover w-full h-full"
      //         />
      //         {/* Image Label */}
      //         <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-sm px-2 py-1">
      //           {file.file_name}
      //         </div>
      //         {/* Annotated Label */}
      //         <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-bl-md">
      //           Annotated
      //         </div>
      //         {/* Checkbox for Selection */}
      //         <div
      //           className={`absolute top-0 left-0 ${
      //             isSelected ? "opacity-100" : "opacity-0"
      //           } group-hover:opacity-100 transition`}
      //         >
      //           <input
      //             type="checkbox"
      //             checked={isSelected}
      //             onChange={() => handleImageSelect(index)}
      //             className="form-checkbox h-5 w-5 text-[#1a4f9d] rounded-full border-gray-300 focus:ring-[#1a4f9d]"
      //             style={{ margin: "4px" }}
      //           />
      //         </div>
      //         {/* Show Full Image Icon */}
      //         <div
      //           className="absolute top-8 left-0 opacity-0 group-hover:opacity-100 transition"
      //           onClick={() => setFullScreenImage(index)}
      //         >
      //           <button className="bg-gray-800 bg-opacity-70 p-2 rounded-full text-white">
      //             <svg
      //               xmlns="http://www.w3.org/2000/svg"
      //               className="h-5 w-5"
      //               fill="none"
      //               viewBox="0 0 24 24"
      //               stroke="currentColor"
      //             >
      //               <path
      //                 strokeLinecap="round"
      //                 strokeLinejoin="round"
      //                 strokeWidth={2}
      //                 d="M4 8h16M4 16h16"
      //               />
      //             </svg>
      //           </button>
      //         </div>
      //         {/* Full-Screen Image Modal */}
      //         {isImageFullScreen && (
      //           <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      //             <div className="relative w-full max-w-4xl">
      //               <button
      //                 className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-full"
      //                 onClick={() => setFullScreenImage(null)}
      //               >
      //                 <svg
      //                   xmlns="http://www.w3.org/2000/svg"
      //                   className="h-6 w-6"
      //                   fill="none"
      //                   viewBox="0 0 24 24"
      //                   stroke="currentColor"
      //                 >
      //                   <path
      //                     strokeLinecap="round"
      //                     strokeLinejoin="round"
      //                     strokeWidth={2}
      //                     d="M6 18L18 6M6 6l12 12"
      //                   />
      //                 </svg>
      //               </button>
      //               <img
      //                 src={file.img_url}
      //                 alt={file.file_name}
      //                 className="object-contain w-full h-full"
      //               />
      //             </div>
      //           </div>
      //         )}
      //       </div>
      //     );
      //   })}
      // </div>

          
    //           {/* Pagination */}
    //   <div className="mt-6 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
    //     <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
    //       <div>
    //         <p className="text-sm text-gray-700">
    //           Showing{" "}
    //           <span className="font-medium">{(page - 1) * perPage + 1}</span> to{" "}
    //           <span className="font-medium">
    //             {Math.min(page * perPage, data.pagination.total_items)}
    //           </span>{" "}
    //           of{" "}
    //           <span className="font-medium">{data.pagination.total_items}</span>{" "}
    //           results
    //         </p>
    //       </div>
    //       <div>
    //         Page {page} of {data.pagination.total_pages}
    //       </div>
    //       <div>
    //         <nav
    //           aria-label="Pagination"
    //           className="isolate inline-flex -space-x-px rounded-md shadow-sm"
    //         >
    //           <button
    //             onClick={() => setPage(page - 1)}
    //             disabled={!data.pagination.previous_page}
    //             className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
    //           >
    //             <span className="sr-only">Previous</span>
    //             <ChevronLeftIcon className="h-5 w-5" />
    //           </button>
    //           {generatePageNumbers().map((pageNumber) => (
    //             <button
    //               key={pageNumber}
    //               onClick={() => setPage(pageNumber)}
    //               className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
    //                 pageNumber === page
    //                   ? "z-10 bg-indigo-600 text-white focus:z-20"
    //                   : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
    //               }`}
    //             >
    //               {pageNumber}
    //             </button>
    //           ))}
    //           <button
    //             onClick={() => setPage(page + 1)}
    //             disabled={!data.pagination.next_page}
    //             className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
    //           >
    //             <span className="sr-only">Next</span>
    //             <ChevronRightIcon className="h-5 w-5" />
    //           </button>
    //         </nav>
    //       </div>
    //     </div>
    //   </div>
    // </div>
//   );
// };

// export default AnnotationDatasetProjectPage;