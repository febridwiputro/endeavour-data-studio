import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchAnnotations } from "@/features/annotations/annotationsSlice";
import SidebarLabellingSetup from "./SidebarLabellingSetup";
import { AppDispatch } from "@/store/store"; // Import AppDispatch

const LabelingSetup: React.FC = () => {
  const dispatch: AppDispatch = useDispatch(); // Type dispatch correctly
  const [selectedFeature, setSelectedFeature] = useState<any[]>([]);

  useEffect(() => {
    dispatch(fetchAnnotations());
  }, [dispatch]);

  const handleFeatureSelect = (subFeatures: any[]) => {
    setSelectedFeature(subFeatures);
  };

  return (
    <div className="p-6">
      <div className="flex">
        <SidebarLabellingSetup onSelectFeature={handleFeatureSelect} />
        <div className="w-4/5 pl-4">
          <div
            className="grid grid-cols-5 gap-4 overflow-y-auto"
            style={{ maxHeight: "640px" }}
          >
            {selectedFeature.length > 0 ? (
              selectedFeature.map((subFeature: any, index: number) => (
                <div
                  key={index}
                  className="border rounded-lg shadow hover:shadow-lg transition overflow-hidden"
                  style={{ height: "160px" }}
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