import React, { useState } from "react";
import { FaCloudUploadAlt, FaVideo, FaMobileAlt, FaKeyboard } from "react-icons/fa";
import { FiLink, FiFolder, FiImage, FiMoreHorizontal } from "react-icons/fi";

const AddMediaPage = ({ onClose }: { onClose: () => void }) => {
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  const handleOpenQrModal = () => {
    setIsQrModalOpen(true);
  };

  const handleCloseQrModal = () => {
    setIsQrModalOpen(false);
  };

  return (
    <div className="bg-gray-50 rounded-lg w-3/4 max-w-4xl p-6 relative shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Add media to your library</h2>
        <button
          className="text-gray-500 hover:text-gray-800 transition text-xl"
          onClick={onClose}
        >
          ✕
        </button>
      </div>

      {/* Upload Section */}
      <div className="bg-white p-6 rounded-lg text-center border border-dashed border-gray-300 mb-8">
        <div className="flex flex-col items-center">
          <FaCloudUploadAlt className="text-5xl text-gray-400 mb-4" />
          <p className="text-gray-800 text-lg font-medium">Click to upload</p>
          <p className="text-gray-500">or drag & drop files here</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <button className="flex items-center gap-3 bg-gray-200 p-4 rounded-lg hover:bg-gray-300 transition text-gray-700 text-sm font-medium">
          <FaVideo className="text-lg text-blue-500" />
          Record screen, voice or video
        </button>
        <button
          onClick={handleOpenQrModal}
          className="flex items-center gap-3 bg-gray-200 p-4 rounded-lg hover:bg-gray-300 transition text-gray-700 text-sm font-medium"
        >
          <FaMobileAlt className="text-lg text-blue-500" />
          Import from smartphone
        </button>
        <button className="flex items-center gap-3 bg-gray-200 p-4 rounded-lg hover:bg-gray-300 transition text-gray-700 text-sm font-medium">
          <FaKeyboard className="text-lg text-blue-500" />
          Text to Speech
        </button>
      </div>

      {/* Divider with Text */}
      <div className="relative my-6">
        <div className="border-t border-gray-300"></div>
        <span className="absolute left-1/2 transform -translate-x-1/2 -top-2 bg-gray-50 px-2 text-gray-500 text-sm">
          Or import a file from
        </span>
      </div>

      {/* Import Options */}
      <div className="grid grid-cols-5 gap-4">
        <button className="flex flex-col items-center gap-2 bg-gray-200 p-4 rounded-lg hover:bg-gray-300 transition text-gray-700 text-sm">
          <FiLink className="text-2xl text-blue-500" />
          <span>External Link</span>
        </button>
        <button className="flex flex-col items-center gap-2 bg-gray-200 p-4 rounded-lg hover:bg-gray-300 transition text-gray-700 text-sm">
          <FiFolder className="text-2xl text-blue-500" />
          <span>Google Drive</span>
        </button>
        <button className="flex flex-col items-center gap-2 bg-gray-200 p-4 rounded-lg hover:bg-gray-300 transition text-gray-700 text-sm">
          <FiImage className="text-2xl text-blue-500" />
          <span>Dropbox</span>
        </button>
        <button className="flex flex-col items-center gap-2 bg-gray-200 p-4 rounded-lg hover:bg-gray-300 transition text-gray-700 text-sm">
          <FiImage className="text-2xl text-blue-500" />
          <span>Google Photos</span>
        </button>
        <button className="flex flex-col items-center gap-2 bg-gray-200 p-4 rounded-lg hover:bg-gray-300 transition text-gray-700 text-sm">
          <FiMoreHorizontal className="text-2xl text-blue-500" />
          <span>See More</span>
        </button>
      </div>

      {/* QR Code Modal */}
      {isQrModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl relative">
            {/* Back Button */}
            <button
              onClick={handleCloseQrModal}
              className="absolute top-4 left-4 text-gray-500 hover:text-gray-800 transition"
            >
              ←
            </button>

            {/* Modal Title */}
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
              Import from smartphone
            </h2>

            {/* Instructions */}
            <p className="text-gray-500 text-center mb-8">
              Use your smartphone's camera to scan the QR code below and select media.
            </p>

            {/* QR Code Section */}
            <div className="flex justify-center items-center bg-gray-200 border border-dashed border-gray-300 p-8 rounded-lg">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=DummyQRCode"
                alt="QR Code"
                className="w-64 h-64"
              />
            </div>

            {/* Footer */}
            <p className="text-gray-500 text-center mt-8">
              Can't scan the code?{" "}
              <button
                onClick={() => console.log("Reload QR Code")}
                className="text-blue-500 hover:underline"
              >
                Reload
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddMediaPage;



// import React, { useState } from "react";
// import { FaCloudUploadAlt, FaVideo, FaMobileAlt, FaKeyboard } from "react-icons/fa";
// import { FiLink, FiFolder, FiImage, FiMoreHorizontal } from "react-icons/fi";

// const AddMediaPage = ({ onClose }: { onClose: () => void }) => {
//   const [isQrModalOpen, setIsQrModalOpen] = useState(false);

//   const handleOpenQrModal = () => {
//     setIsQrModalOpen(true);
//   };

//   const handleCloseQrModal = () => {
//     setIsQrModalOpen(false);
//   };

//   return (
//     <div className="bg-gray-900 rounded-lg w-3/4 max-w-4xl p-6 relative shadow-lg">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-xl font-bold text-white">Add media to your library</h2>
//         <button
//           className="text-gray-400 hover:text-white transition text-xl"
//           onClick={onClose}
//         >
//           ✕
//         </button>
//       </div>

//       {/* Upload Section */}
//       <div className="bg-gray-800 p-6 rounded-lg text-center border border-dashed border-gray-600 mb-8">
//         <div className="flex flex-col items-center">
//           <FaCloudUploadAlt className="text-5xl text-gray-400 mb-4" />
//           <p className="text-white text-lg font-medium">Click to upload</p>
//           <p className="text-gray-400">or drag & drop files here</p>
//         </div>
//       </div>

//       {/* Action Buttons */}
//       <div className="grid grid-cols-3 gap-4 mb-6">
//         <button className="flex items-center gap-3 bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition text-white text-sm font-medium">
//           <FaVideo className="text-lg" />
//           Record screen, voice or video
//         </button>
//         <button
//           onClick={handleOpenQrModal}
//           className="flex items-center gap-3 bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition text-white text-sm font-medium"
//         >
//           <FaMobileAlt className="text-lg" />
//           Import from smartphone
//         </button>
//         <button className="flex items-center gap-3 bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition text-white text-sm font-medium">
//           <FaKeyboard className="text-lg" />
//           Text to Speech
//         </button>
//       </div>

//       {/* Divider with Text */}
//       <div className="relative my-6">
//         <div className="border-t border-gray-700"></div>
//         <span className="absolute left-1/2 transform -translate-x-1/2 -top-2 bg-gray-900 px-2 text-gray-400 text-sm">
//           Or import a file from
//         </span>
//       </div>

//       {/* Import Options */}
//       <div className="grid grid-cols-5 gap-4">
//         <button className="flex flex-col items-center gap-2 bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition text-white text-sm">
//           <FiLink className="text-2xl" />
//           <span>External Link</span>
//         </button>
//         <button className="flex flex-col items-center gap-2 bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition text-white text-sm">
//           <FiFolder className="text-2xl" />
//           <span>Google Drive</span>
//         </button>
//         <button className="flex flex-col items-center gap-2 bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition text-white text-sm">
//           <FiImage className="text-2xl" />
//           <span>Dropbox</span>
//         </button>
//         <button className="flex flex-col items-center gap-2 bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition text-white text-sm">
//           <FiImage className="text-2xl" />
//           <span>Google Photos</span>
//         </button>
//         <button className="flex flex-col items-center gap-2 bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition text-white text-sm">
//           <FiMoreHorizontal className="text-2xl" />
//           <span>See More</span>
//         </button>
//       </div>

//       {/* QR Code Modal */}
//       {isQrModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-2xl relative">
//             {/* Back Button */}
//             <button
//               onClick={handleCloseQrModal}
//               className="absolute top-4 left-4 text-gray-400 hover:text-white transition"
//             >
//               ←
//             </button>

//             {/* Modal Title */}
//             <h2 className="text-2xl font-bold text-white text-center mb-6">
//               Import from smartphone
//             </h2>

//             {/* Instructions */}
//             <p className="text-gray-400 text-center mb-8">
//               Use your smartphone's camera to scan the QR code below and select media.
//             </p>

//             {/* QR Code Section */}
//             <div className="flex justify-center items-center bg-gray-800 border border-dashed border-gray-600 p-8 rounded-lg">
//               <img
//                 src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=DummyQRCode"
//                 alt="QR Code"
//                 className="w-64 h-64"
//               />
//             </div>

//             {/* Footer */}
//             <p className="text-gray-400 text-center mt-8">
//               Can't scan the code?{" "}
//               <button
//                 onClick={() => console.log("Reload QR Code")}
//                 className="text-blue-500 hover:underline"
//               >
//                 Reload
//               </button>
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AddMediaPage;




// import React from "react";

// const AddMediaPage = () => {
//   const handleClose = () => {
//     console.log("Modal closed");
//     // Implement navigation logic or modal closing functionality here
//   };

//   return (
//     <div className="h-screen bg-gray-900 text-white flex items-center justify-center">
//       <div className="bg-gray-800 rounded-lg w-3/4 max-w-4xl p-6">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-2xl font-bold text-white">
//             Add media to your library
//           </h2>
//           <button
//             className="text-gray-400 hover:text-white transition"
//             onClick={handleClose}
//           >
//             ✕
//           </button>
//         </div>

//         {/* Upload Section */}
//         <div className="bg-gray-700 p-6 rounded-lg text-center border border-dashed border-gray-500 mb-6">
//           <div className="text-5xl text-gray-400 mb-2">⬆</div>
//           <p className="text-white">Click to upload</p>
//           <p className="text-gray-400">or drag & drop files here</p>
//         </div>

//         {/* Options Section */}
//         <div className="grid grid-cols-3 gap-4 mb-6">
//           <button className="bg-gray-700 p-4 rounded-lg text-white hover:bg-gray-600 transition">
//             Record screen, voice or video
//           </button>
//           <button className="bg-gray-700 p-4 rounded-lg text-white hover:bg-gray-600 transition">
//             Import from smartphone
//           </button>
//           <button className="bg-gray-700 p-4 rounded-lg text-white hover:bg-gray-600 transition">
//             Text to Speech
//           </button>
//         </div>

//         {/* Divider */}
//         <div className="border-t border-gray-600 my-6"></div>

//         {/* External Import Options */}
//         <div className="grid grid-cols-5 gap-4">
//           {["External Link", "Google Drive", "Dropbox", "Google Photos", "See More"].map(
//             (option) => (
//               <button
//                 key={option}
//                 className="bg-gray-700 p-4 rounded-lg text-white hover:bg-gray-600 transition"
//               >
//                 {option}
//               </button>
//             )
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddMediaPage;
