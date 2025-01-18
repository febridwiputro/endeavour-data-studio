import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Feature, SubFeature2, SubFeature3 } from "@/features/annotations/types";

interface SidebarLabellingSetupProps {
  onSelectFeature: (subFeatures: SubFeature2[] | SubFeature3[]) => void;
}

const SidebarLabellingSetup: React.FC<SidebarLabellingSetupProps> = ({
  onSelectFeature,
}) => {
  const { annotations, loading, error } = useSelector(
    (state: RootState) => state.annotations
  );

  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  useEffect(() => {
    console.log("Annotations:", annotations);
  }, [annotations]);

  if (loading) return <div className="p-4 text-gray-500">Loading features...</div>;
  if (error) return <div className="p-4 text-red-500">Error loading data.</div>;
  if (!annotations?.features) {
    return <div className="p-4 text-gray-500">No features available.</div>;
  }

  const handleFeatureClick = (feature: Feature) => {
    if (!feature.sub_features_1?.some((sub) => sub.sub_features_2)) {
      onSelectFeature(feature.sub_features_1 || []);
      setExpandedSection(null);
    } else {
      setExpandedSection((prev) => (prev === feature.name ? null : feature.name));
    }
  };

  return (
    <div className="w-1/5 pr-4 border-r border-gray-300">
      {/* Scrollable container */}
      <div className="h-full max-h-[calc(100vh-4rem)] overflow-y-auto">
        <ul className="space-y-2 text-gray-700 text-sm">
          {annotations.features.map((feature, index) => (
            <li key={index}>
              <div
                onClick={() => handleFeatureClick(feature)}
                className="cursor-pointer font-bold text-black hover:text-blue-500"
              >
                {feature.name}
              </div>
              {expandedSection === feature.name && feature.sub_features_1 && (
                <ul className="pl-4 space-y-2 mt-2">
                  {feature.sub_features_1.map((subFeature, subIndex) => (
                    <li
                      key={subIndex}
                      onClick={() =>
                        onSelectFeature(subFeature.sub_features_2 || [])
                      }
                      className="cursor-pointer text-gray-700 hover:text-blue-500"
                    >
                      {subFeature.name}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SidebarLabellingSetup;
