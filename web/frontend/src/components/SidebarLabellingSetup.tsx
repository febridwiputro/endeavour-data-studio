import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface SidebarLabellingSetupProps {
  onSelectFeature: (subFeatures: any[]) => void;
}

const SidebarLabellingSetup: React.FC<SidebarLabellingSetupProps> = ({
  onSelectFeature,
}) => {
  const { annotations } = useSelector((state: RootState) => state.annotations);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleFeatureClick = (feature: any) => {
    // If `sub_features_2` doesn't exist, directly use `sub_features_1` as cards
    if (!feature.sub_features_1.some((sub: any) => sub.sub_features_2)) {
      onSelectFeature(feature.sub_features_1);
      setExpandedSection(null); // Collapse all
    } else {
      // Otherwise, allow expansion
      setExpandedSection((prev) =>
        prev === feature.name ? null : feature.name
      );
    }
  };

  return (
    <div className="w-1/5 pr-4 border-r border-gray-300">
      <ul className="space-y-2 text-gray-700 text-sm">
        {annotations?.features?.map((feature: any, index: number) => (
          <li key={index}>
            <div
              onClick={() => handleFeatureClick(feature)}
              className="cursor-pointer font-bold text-black hover:text-blue-500"
            >
              {feature.name}
            </div>
            {expandedSection === feature.name && feature.sub_features_1 && (
              <ul className="pl-4 space-y-2 mt-2">
                {feature.sub_features_1.map(
                  (subFeature: any, subIndex: number) => (
                    <li
                      key={subIndex}
                      onClick={() =>
                        onSelectFeature(subFeature.sub_features_2 || [])
                      }
                      className="cursor-pointer text-gray-700 hover:text-blue-500"
                    >
                      {subFeature.name}
                    </li>
                  )
                )}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SidebarLabellingSetup;

// import React from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchAnnotations } from "@/features/annotations/annotationsSlice";
// import { RootState, AppDispatch } from "@/store/store";

// interface SidebarLabellingSetupProps {
//   onSelectFeature: (featureIndex: number) => void; // Callback to notify selected feature
// }

// const SidebarLabellingSetup: React.FC<SidebarLabellingSetupProps> = ({
//   onSelectFeature,
// }) => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { annotations, loading, error } = useSelector(
//     (state: RootState) => state.annotations
//   );

//   React.useEffect(() => {
//     dispatch(fetchAnnotations());
//   }, [dispatch]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   return (
//     <div className="w-1/5 pr-4 border-r border-gray-300">
//       <ul className="space-y-2 text-gray-700 text-sm">
//         {annotations.map((annotation: any, index: number) => (
//           <li
//             key={index}
//             onClick={() => onSelectFeature(index)} // Notify parent component
//             className={`cursor-pointer ${
//               index === 0 ? "font-bold text-black" : "text-gray-700"
//             } hover:text-blue-500`}
//           >
//             {annotation.name}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default SidebarLabellingSetup;

// import React from "react";

// interface SidebarLabellingSetupProps {}

// const SidebarLabellingSetup: React.FC<SidebarLabellingSetupProps> = () => {
//   return (
//     <div className="w-1/5 pr-4 border-r border-gray-300">
//       {" "}
//       {/* Garis pembatas */}
//       <ul className="space-y-2 text-gray-700 text-sm">
//         <li className="font-bold text-black">Computer Vision</li>
//         <li>Natural Language Processing</li>
//         <li>Audio/Speech Processing</li>
//         <li>Conversational AI</li>
//         <li>Ranking & Scoring</li>
//         <li>Structured Data Parsing</li>
//         <li>Time Series Analysis</li>
//         <li>Videos</li>
//         <li>Generative AI</li>
//         <li className="text-blue-500 cursor-pointer">Custom template</li>
//       </ul>
//     </div>
//   );
// };

// export default SidebarLabellingSetup;
