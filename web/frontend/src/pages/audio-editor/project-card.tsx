import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  FaEdit,
  FaCopy,
  FaDownload,
  FaLink,
  FaUsers,
  FaFolder,
  FaTrash,
} from "react-icons/fa";

type ProjectCardProps = {
  project: string;
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleProjectClick = () => {
    router.push(`/audio-editor/project?name=${encodeURIComponent(project)}`);
  };

  return (
    <div
      className="relative bg-white border border-gray-200 p-4 rounded-lg hover:border-blue-500 transition shadow-md cursor-pointer"
      onClick={handleProjectClick}
    >
      {/* Project Preview */}
      <div className="bg-gray-100 h-40 rounded mb-2 flex items-center justify-center relative border border-gray-300">
        <span className="text-gray-500">362x200</span>
        <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-xs text-white px-2 py-1 rounded">
          00:00
        </span>
      </div>

      {/* Project Details */}
      <h3 className="text-gray-800 font-semibold">{project}</h3>
      <p className="text-gray-500 text-sm">By You</p>

      {/* Dropdown */}
      <button
        className="absolute bottom-2 right-2 text-gray-600 hover:text-gray-800 transition"
        onClick={(e) => {
          e.stopPropagation();
          toggleDropdown();
        }}
        title="Options"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM18 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 bottom-10 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <ul className="py-2 text-sm text-gray-700">
            {[
              { label: "Rename Project", icon: <FaEdit className="text-blue-500" /> },
              { label: "Duplicate Project", icon: <FaCopy className="text-blue-500" /> },
              { label: "Export mp4", icon: <FaDownload className="text-blue-500" /> },
              { label: "Share as Review Link", icon: <FaLink className="text-blue-500" /> },
              { label: "Share with Team", icon: <FaUsers className="text-blue-500" /> },
              { label: "Move to Folder", icon: <FaFolder className="text-blue-500" /> },
              { label: "Delete Project", icon: <FaTrash className="text-red-500" /> },
            ].map((item) => (
              <li
                key={item.label}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log(item.label);
                }}
              >
                <span>{item.icon}</span>
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;




// import React, { useState } from "react";
// import { FaEdit, FaCopy, FaDownload, FaLink, FaUsers, FaFolder, FaTrash } from "react-icons/fa";

// type ProjectCardProps = {
//   project: string;
// };

// const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   const toggleDropdown = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//   };

//   return (
//     <div className="relative bg-white border border-gray-200 p-4 rounded-lg hover:border-blue-500 transition shadow-md">
//       {/* Project Preview */}
//       <div className="bg-gray-100 h-40 rounded mb-2 flex items-center justify-center relative border border-gray-300">
//         <span className="text-gray-500">362x200</span>
//         <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-xs text-white px-2 py-1 rounded">
//           00:00
//         </span>
//       </div>

//       {/* Project Details */}
//       <h3 className="text-gray-800 font-semibold">{project}</h3>
//       <p className="text-gray-500 text-sm">By</p>

//       {/* Ellipsis Icon */}
//       <button
//         className="absolute bottom-2 right-2 text-gray-600 hover:text-gray-800 transition"
//         onClick={toggleDropdown}
//         title="Options"
//       >
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-5 w-5"
//           viewBox="0 0 20 20"
//           fill="currentColor"
//         >
//           <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM18 10a2 2 0 11-4 0 2 2 0 014 0z" />
//         </svg>
//       </button>

//       {/* Dropdown Menu */}
//       {isDropdownOpen && (
//         <div className="absolute right-0 bottom-10 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
//           <ul className="py-2 text-sm text-gray-700">
//             {[
//               { label: "Rename Project", icon: <FaEdit className="text-blue-500" /> },
//               { label: "Duplicate Project", icon: <FaCopy className="text-blue-500" /> },
//               { label: "Export mp4", icon: <FaDownload className="text-blue-500" /> },
//               { label: "Share as Review Link", icon: <FaLink className="text-blue-500" /> },
//               { label: "Share with Team", icon: <FaUsers className="text-blue-500" /> },
//               { label: "Move Selected to", icon: <FaFolder className="text-blue-500" /> },
//               { label: "Delete Selected", icon: <FaTrash className="text-red-500" /> },
//             ].map((item) => (
//               <li
//                 key={item.label}
//                 className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
//               >
//                 <span>{item.icon}</span>
//                 {item.label}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProjectCard;



// import React, { useState } from "react";
// import { FaEdit, FaCopy, FaDownload, FaLink, FaUsers, FaFolder, FaTrash } from "react-icons/fa";

// type ProjectCardProps = {
//   project: string;
// };

// const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   const toggleDropdown = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//   };

//   return (
//     <div className="relative bg-gray-800 border border-gray-700 p-4 rounded-lg hover:border-gray-500 transition">
//       {/* Project Preview */}
//       <div className="bg-gray-600 h-40 rounded mb-2 flex items-center justify-center relative">
//         <span className="text-gray-400">362x200</span>
//         <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-xs text-white px-2 py-1 rounded">
//           00:00
//         </span>
//       </div>

//       {/* Project Details */}
//       <h3 className="text-gray-300 font-semibold">{project}</h3>
//       <p className="text-gray-500 text-sm">By</p>

//       {/* Ellipsis Icon */}
//       <button
//         className="absolute bottom-2 right-2 text-gray-400 hover:text-white transition"
//         onClick={toggleDropdown}
//         title="Options"
//       >
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-5 w-5"
//           viewBox="0 0 20 20"
//           fill="currentColor"
//         >
//           <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM18 10a2 2 0 11-4 0 2 2 0 014 0z" />
//         </svg>
//       </button>

//       {/* Dropdown Menu */}
//       {isDropdownOpen && (
//         <div className="absolute right-0 bottom-10 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
//           <ul className="py-2 text-sm text-gray-300">
//             {[
//               { label: "Rename Project", icon: <FaEdit /> },
//               { label: "Duplicate Project", icon: <FaCopy /> },
//               { label: "Export mp4", icon: <FaDownload /> },
//               { label: "Share as Review Link", icon: <FaLink /> },
//               { label: "Share with Team", icon: <FaUsers /> },
//               { label: "Move Selected to", icon: <FaFolder /> },
//               { label: "Delete Selected", icon: <FaTrash /> },
//             ].map((item) => (
//               <li
//                 key={item.label}
//                 className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center gap-2"
//               >
//                 <span className="text-gray-400">{item.icon}</span>
//                 {item.label}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProjectCard;



// import React, { useState } from "react";

// type ProjectCardProps = {
//   project: string;
// };

// const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   const toggleDropdown = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//   };

//   return (
//     <div className="relative bg-gray-800 border border-gray-700 p-4 rounded-lg hover:border-gray-500 transition">
//       {/* Project Preview */}
//       <div className="bg-gray-600 h-40 rounded mb-2 flex items-center justify-center relative">
//         <span className="text-gray-400">362x200</span>
//         <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-xs text-white px-2 py-1 rounded">
//           00:00
//         </span>
//       </div>

//       {/* Project Details */}
//       <h3 className="text-gray-300 font-semibold">{project}</h3>
//       <p className="text-gray-500 text-sm">By</p>

//       {/* Ellipsis Icon */}
//       <button
//         className="absolute bottom-2 right-2 text-gray-400 hover:text-white transition"
//         onClick={toggleDropdown}
//         title="Options"
//       >
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-5 w-5"
//           viewBox="0 0 20 20"
//           fill="currentColor"
//         >
//           <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM18 10a2 2 0 11-4 0 2 2 0 014 0z" />
//         </svg>
//       </button>

//       {/* Dropdown Menu */}
//       {isDropdownOpen && (
//         <div className="absolute right-0 bottom-10 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
//           <ul className="py-2 text-sm text-gray-300">
//             <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center gap-2">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-4 w-4"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M15 10l4.553-4.553a1.5 1.5 0 112.122 2.122L17.122 12l4.553 4.553a1.5 1.5 0 01-2.122 2.122L15 14m0 0l-4.553 4.553a1.5 1.5 0 01-2.122-2.122L12.878 12 8.325 7.447a1.5 1.5 0 112.122-2.122L15 10z"
//                 />
//               </svg>
//               Rename Project
//             </li>
//             <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center gap-2">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-4 w-4"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M12 4.75v14.5M4.75 12h14.5"
//                 />
//               </svg>
//               Duplicate Project
//             </li>
//             <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center gap-2">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-4 w-4"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M12 19.25v-14.5"
//                 />
//               </svg>
//               Export mp4
//             </li>
//             <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center gap-2">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-4 w-4"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M17 9l-5-5-5 5m5-5v12"
//                 />
//               </svg>
//               Share as Review Link
//             </li>
//             <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center gap-2">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-4 w-4"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M20 11H7m13 0a1 1 0 00-1-1m0 0a1 1 0 00-1 1m1 0a1 1 0 01-1 1M5 7h8M5 7a1 1 0 00-1 1m0 0a1 1 0 001 1m1 0a1 1 0 011 1m1-1H7"
//                 />
//               </svg>
//               Share with Team
//             </li>
//             <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center gap-2">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-4 w-4"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M4 6h16M4 10h16M4 14h16"
//                 />
//               </svg>
//               Move selected to
//             </li>
//             <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center gap-2">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-4 w-4"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M12 20h9"
//                 />
//               </svg>
//               Delete Selected
//             </li>
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProjectCard;