import React, { useState } from "react";
import SidebarLabellingSetup from "./SidebarLabellingSetup";

interface LabelingSetupProps {}

const LabelingSetup: React.FC<LabelingSetupProps> = () => {
  const [selectedFeature, setSelectedFeature] = useState<any[]>([]);

  const handleFeatureSelect = (subFeatures: any[]) => {
    setSelectedFeature(subFeatures);
  };

  return (
    <div className="p-6">
      {/* Sidebar and Cards */}
      <div className="flex">
        {/* Sidebar */}
        <SidebarLabellingSetup onSelectFeature={handleFeatureSelect} />

        {/* Cards */}
        <div className="w-4/5 pl-4">
          <div
            className="grid grid-cols-5 gap-4 overflow-y-auto"
            style={{ maxHeight: "640px" }} // Set height for 4 rows
          >
            {selectedFeature.length > 0 ? (
              selectedFeature.map((subFeature: any, index: number) => (
                <div
                  key={index}
                  className="border rounded-lg shadow hover:shadow-lg transition overflow-hidden"
                  style={{ height: "160px" }} // Height for cards
                >
                  <img
                    src={`https://via.placeholder.com/400x160?text=${encodeURIComponent(
                      subFeature.name
                    )}`}
                    alt={subFeature.name}
                    className="w-full h-24 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-sm font-bold truncate">
                      {subFeature.name}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                      {subFeature.description}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-5 text-center text-gray-500">
                Select a feature to view sub-features.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabelingSetup;

// import React, { useState } from "react";
// import SidebarLabellingSetup from "./SidebarLabellingSetup";
// import { useSelector } from "react-redux";
// import { RootState } from "@/store/store";

// const LabelingSetup: React.FC = () => {
//   const { annotations } = useSelector((state: RootState) => state.annotations);
//   const [selectedFeatureIndex, setSelectedFeatureIndex] = useState(0); // Track selected sidebar item

//   const selectedFeature =
//     annotations.length > 0 ? annotations[selectedFeatureIndex] : null;

//   const subFeatures = selectedFeature?.sub_features_2 || [];

//   return (
//     <div className="p-6">
//       {/* Sidebar and Cards */}
//       <div className="flex">
//         {/* Sidebar */}
//         <SidebarLabellingSetup onSelectFeature={setSelectedFeatureIndex} />

//         {/* Cards */}
//         <div className="w-4/5 grid grid-cols-5 gap-4 pl-4">
//           {subFeatures.map((subFeature: any, index: number) => (
//             <div
//               key={index}
//               className="border rounded-lg shadow hover:shadow-lg transition overflow-hidden"
//               style={{ height: "160px" }}
//             >
//               <img
//                 src={`https://via.placeholder.com/400x160?text=${encodeURIComponent(
//                   subFeature.name
//                 )}`}
//                 alt={subFeature.name}
//                 className="w-full h-24 object-cover"
//               />
//               <div className="p-4">
//                 <h3 className="text-sm font-bold truncate">
//                   {subFeature.name}
//                 </h3>
//                 <p className="text-xs text-gray-500 truncate">
//                   {subFeature.description}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="mt-6 text-center text-sm text-gray-600">
//         See the documentation to{" "}
//         <a href="#" className="text-blue-500 underline">
//           contribute a template
//         </a>
//         .
//       </div>
//     </div>
//   );
// };

// export default LabelingSetup;

// import React from "react";
// import Sidebar from "./Sidebar";
// import SidebarLabellingSetup from "./SideBarLabellingSetup";

// interface LabelingSetupProps {}

// const LabelingSetup: React.FC<LabelingSetupProps> = () => {
//   const templates = [
//     "Semantic Segmentation with Polygons",
//     "Semantic Segmentation with Masks",
//     "Object Detection with Bounding Boxes",
//     "Keypoint Labeling",
//     "Inventory Tracking",
//     "Image Classification",
//     "Optical Character Recognition",
//     "Visual Genome",
//     "Visual Question Answering",
//     "Image Captioning",
//     "Multi-page document annotation",
//   ];

//   return (
//     <div className="p-6">
//       {/* Sidebar and Cards */}
//       <div className="flex">
//         {/* Sidebar */}
//         <SidebarLabellingSetup />

//         {/* Cards */}
//         <div className="w-4/5 grid grid-cols-5 gap-4 pl-4">
//           {" "}
//           {/* Grid untuk 5 kolom */}
//           {templates.map((template, index) => (
//             <div
//               key={index}
//               className="border rounded-lg shadow hover:shadow-lg transition overflow-hidden"
//               style={{ height: "160px" }} // Tinggi card landscape
//             >
//               <img
//                 src={`https://via.placeholder.com/400x160?text=${encodeURIComponent(
//                   template
//                 )}`}
//                 alt={template}
//                 className="w-full h-24 object-cover"
//               />
//               <div className="p-4">
//                 <h3 className="text-sm font-bold truncate">{template}</h3>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="mt-6 text-center text-sm text-gray-600">
//         See the documentation to{" "}
//         <a href="#" className="text-blue-500 underline">
//           contribute a template
//         </a>
//         .
//       </div>
//     </div>
//   );
// };

// export default LabelingSetup;
