import React, { useState } from "react";
import { FaBolt } from "react-icons/fa";

interface AddInternalModelProps {
  onAddModel: (model: {
    id: number;
    name: string;
    mAP: string;
    precision: string;
    recall: string;
    type: string;
    datasetVersion: string;
  }) => void;
}

const AddInternalModel: React.FC<AddInternalModelProps> = ({ onAddModel }) => {
  const [modelName, setModelName] = useState("");
  const [mAP, setMAP] = useState("0%");
  const [precision, setPrecision] = useState("0%");
  const [recall, setRecall] = useState("0%");
  const [datasetVersion, setDatasetVersion] = useState("raw");

  const handleAddModel = () => {
    if (!modelName.trim()) return;

    const newModel = {
      id: Date.now(),
      name: modelName,
      mAP,
      precision,
      recall,
      type: "Roboflow 3.0 Object Detection (Fast)",
      datasetVersion,
    };

    onAddModel(newModel);
    setModelName("");
    setMAP("0%");
    setPrecision("0%");
    setRecall("0%");
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <input
        type="text"
        className="border px-4 py-2 rounded-md text-sm"
        placeholder="Enter Model Name"
        value={modelName}
        onChange={(e) => setModelName(e.target.value)}
      />
      <button
        onClick={handleAddModel}
        className="px-4 py-2 text-sm text-white bg-[#7b6cff] rounded-md hover:bg-[#5f52cc] flex items-center"
      >
        <FaBolt className="mr-2" />
        Add Internal Model
      </button>
    </div>
  );
};

export default AddInternalModel;
