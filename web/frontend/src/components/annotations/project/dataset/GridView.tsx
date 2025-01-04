// import React, { useState } from "react";

// interface GridViewProps {
//   data: any[];
//   activeView: "grid" | "list";
//   selectedImages: number[];
//   handleImageSelect: (index: number) => void;
// }

// const GridView: React.FC<GridViewProps> = ({
//   data,
//   activeView,
//   selectedImages,
//   handleImageSelect,
// }) => {
//   const [fullScreenImage, setFullScreenImage] = useState<number | null>(null);

//   return (
//     <div
//       className={`grid gap-6 ${
//         activeView === "grid"
//           ? "grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
//           : "grid-cols-1"
//       }`}
//     >
//       {data.map((file, index) => {
//         const isSelected = selectedImages.includes(index);

//         return (
//           <div
//             key={file.upload_id}
//             className="relative border border-gray-200 rounded-md overflow-hidden shadow-sm group"
//             style={{
//               width: activeView === "grid" ? "200px" : "100%",
//               height: activeView === "grid" ? "200px" : "auto",
//             }}
//           >
//             <img
//               src={file.img_url}
//               alt={file.file_name}
//               className="object-cover w-full h-full"
//             />
//             <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-sm px-2 py-1">
//               {file.file_name}
//             </div>
//             <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-bl-md">
//               Annotated
//             </div>
//             <div
//               className={`absolute top-0 left-0 ${
//                 isSelected ? "opacity-100" : "opacity-0"
//               } group-hover:opacity-100 transition`}
//             >
//               <input
//                 type="checkbox"
//                 checked={isSelected}
//                 onChange={() => handleImageSelect(index)}
//                 className="form-checkbox h-5 w-5 text-[#1a4f9d] rounded-full border-gray-300 focus:ring-[#1a4f9d]"
//                 style={{ margin: "4px" }}
//               />
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default GridView;



import React, { useState } from "react";

interface GridViewProps {
  data: any[];
  activeView: "grid" | "list";
  selectedImages: number[]; // Add this to props
  handleImageSelect: (index: number) => void;
}

const GridView: React.FC<GridViewProps> = ({
  data,
  activeView,
  selectedImages, // Use the selectedImages prop
  handleImageSelect,
}) => {
  const [fullScreenImage, setFullScreenImage] = useState<number | null>(null);

  return (
    <div
      className={`grid gap-6 ${
        activeView === "grid"
          ? "grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
          : "grid-cols-1"
      }`}
    >
      {data.map((file, index) => {
        const isSelected = selectedImages.includes(index); // Use the prop here
        const isImageFullScreen = fullScreenImage === index;

        return (
          <div
            key={file.upload_id}
            className="relative border border-gray-200 rounded-md overflow-hidden shadow-sm group"
            style={{
              width: activeView === "grid" ? "200px" : "100%",
              height: activeView === "grid" ? "200px" : "auto",
            }}
          >
            <img
              src={file.img_url}
              alt={file.file_name}
              className="object-cover w-full h-full"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-sm px-2 py-1">
              {file.file_name}
            </div>
            <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-bl-md">
              Annotated
            </div>
            <div
              className={`absolute top-0 left-0 ${
                isSelected ? "opacity-100" : "opacity-0"
              } group-hover:opacity-100 transition`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleImageSelect(index)} // Call the parent handler
                className="form-checkbox h-5 w-5 text-[#1a4f9d] rounded-full border-gray-300 focus:ring-[#1a4f9d]"
                style={{ margin: "4px" }}
              />
            </div>
            <div
              className="absolute top-8 left-0 opacity-0 group-hover:opacity-100 transition"
              onClick={() => setFullScreenImage(index)}
            >
              <button className="bg-gray-800 bg-opacity-70 p-2 rounded-full text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 8h16M4 16h16"
                  />
                </svg>
              </button>
            </div>
            {isImageFullScreen && (
              <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
                <div className="relative w-full max-w-4xl">
                  <button
                    className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-full"
                    onClick={() => setFullScreenImage(null)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  <img
                    src={file.img_url}
                    alt={file.file_name}
                    className="object-contain w-full h-full"
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default GridView;




// import React, { useState } from "react";

// interface GridViewProps {
//   data: any[];
//   activeView: "grid" | "list";
//   handleImageSelect: (index: number) => void;
// }

// const GridView: React.FC<GridViewProps> = ({
//   data,
//   activeView,
//   handleImageSelect,
// }) => {
//   const [fullScreenImage, setFullScreenImage] = useState<number | null>(null);
//   const [selectedImages, setSelectedImages] = useState<number[]>([]);

//   const toggleSelection = (index: number) => {
//     setSelectedImages((prev) =>
//       prev.includes(index)
//         ? prev.filter((i) => i !== index)
//         : [...prev, index]
//     );
//     handleImageSelect(index);
//   };

//   return (
//     <div
//       className={`grid gap-6 ${
//         activeView === "grid"
//           ? "grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
//           : "grid-cols-1"
//       }`}
//     >
//       {data.map((file, index) => {
//         const isSelected = selectedImages.includes(index);
//         const isImageFullScreen = fullScreenImage === index;

//         return (
//           <div
//             key={file.upload_id}
//             className="relative border border-gray-200 rounded-md overflow-hidden shadow-sm group"
//             style={{
//               width: activeView === "grid" ? "200px" : "100%",
//               height: activeView === "grid" ? "200px" : "auto",
//             }}
//           >
//             <img
//               src={file.img_url}
//               alt={file.file_name}
//               className="object-cover w-full h-full"
//             />
//             <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-sm px-2 py-1">
//               {file.file_name}
//             </div>
//             <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-bl-md">
//               Annotated
//             </div>
//             <div
//               className={`absolute top-0 left-0 ${
//                 isSelected ? "opacity-100" : "opacity-0"
//               } group-hover:opacity-100 transition`}
//             >
//               <input
//                 type="checkbox"
//                 checked={isSelected}
//                 onChange={() => toggleSelection(index)}
//                 className="form-checkbox h-5 w-5 text-[#1a4f9d] rounded-full border-gray-300 focus:ring-[#1a4f9d]"
//                 style={{ margin: "4px" }}
//               />
//             </div>
//             <div
//               className="absolute top-8 left-0 opacity-0 group-hover:opacity-100 transition"
//               onClick={() => setFullScreenImage(index)}
//             >
//               <button className="bg-gray-800 bg-opacity-70 p-2 rounded-full text-white">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M4 8h16M4 16h16"
//                   />
//                 </svg>
//               </button>
//             </div>
//             {isImageFullScreen && (
//               <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
//                 <div className="relative w-full max-w-4xl">
//                   <button
//                     className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-full"
//                     onClick={() => setFullScreenImage(null)}
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-6 w-6"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M6 18L18 6M6 6l12 12"
//                       />
//                     </svg>
//                   </button>
//                   <img
//                     src={file.img_url}
//                     alt={file.file_name}
//                     className="object-contain w-full h-full"
//                   />
//                 </div>
//               </div>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default GridView;
