// import React, { useState } from "react";
// import Image from "next/image";
// import { FaEyeDropper } from "react-icons/fa";
// import Layout from "@/components/Layout";
// import { useRouter } from "next/router";

// const PickColorFromImage = () => {
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);
//   const [pickedColor, setPickedColor] = useState<string | null>(null);
//   const router = useRouter();

//   // Handle Image Upload
//   const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = () => setSelectedImage(reader.result as string);
//       reader.readAsDataURL(file);
//     }
//   };

//   // Handle Color Picking (Extract Pixel Color)
//   const handleColorPick = (event: React.MouseEvent<HTMLCanvasElement>) => {
//     const canvas = event.currentTarget;
//     const ctx = canvas.getContext("2d");

//     if (ctx && selectedImage) {
//       const rect = canvas.getBoundingClientRect();
//       const x = event.clientX - rect.left;
//       const y = event.clientY - rect.top;
//       const imageData = ctx.getImageData(x, y, 1, 1).data;

//       const hexColor = `#${(
//         (1 << 24) +
//         (imageData[0] << 16) +
//         (imageData[1] << 8) +
//         imageData[2]
//       )
//         .toString(16)
//         .slice(1)
//         .toUpperCase()}`;

//       setPickedColor(hexColor);
//     }
//   };

//   return (
//     <Layout selectedMenu="Pick Color from Image">
//       <div className="p-6 bg-gray-50 min-h-screen">
//         <h1 className="text-2xl font-bold text-gray-800 mb-4">
//           Pick Color from Image
//         </h1>

//         {/* Image Upload Section */}
//         <div className="flex flex-col items-center gap-4 bg-white p-6 rounded-lg shadow-lg">
//           <label className="text-lg font-medium text-gray-700">
//             Upload an Image
//           </label>
//           <input
//             type="file"
//             accept="image/*"
//             className="p-2 border rounded-md"
//             onChange={handleImageUpload}
//           />

//           {/* Display Image */}
//           {selectedImage && (
//             <div className="relative w-full max-w-lg">
//               <canvas
//                 id="color-picker-canvas"
//                 className="w-full rounded-lg cursor-crosshair"
//                 onClick={handleColorPick}
//               />
//               <Image
//                 src={selectedImage}
//                 alt="Selected Image"
//                 className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
//                 width={500}
//                 height={500}
//                 priority
//               />
//             </div>
//           )}

//           {/* Picked Color */}
//           {pickedColor && (
//             <div className="flex items-center gap-4 mt-4">
//               <FaEyeDropper className="text-xl text-gray-700" />
//               <p className="text-lg font-medium text-gray-800">
//                 Picked Color: <span style={{ color: pickedColor }}>{pickedColor}</span>
//               </p>
//               <div
//                 className="w-8 h-8 rounded-full border"
//                 style={{ backgroundColor: pickedColor }}
//               />
//             </div>
//           )}

//           {/* Back Button */}
//           <button
//             className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
//             onClick={() => router.push("/image-color-picker")}
//           >
//             Back to Color Picker
//           </button>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default PickColorFromImage;