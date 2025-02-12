import React, { useState } from "react";
import { Dialog } from "@headlessui/react";

interface EditInternalModelProps {
  model: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedModel: any) => void;
}

const EditInternalModel: React.FC<EditInternalModelProps> = ({ model, isOpen, onClose, onSave }) => {
  const [modelName, setModelName] = useState(model.name);
  const [mAP, setMAP] = useState(model.mAP);
  const [precision, setPrecision] = useState(model.precision);
  const [recall, setRecall] = useState(model.recall);
  const [datasetVersion, setDatasetVersion] = useState(model.datasetVersion);

  const handleSave = () => {
    onSave({
      ...model,
      name: modelName,
      mAP,
      precision,
      recall,
      datasetVersion,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 flex items-center justify-center p-4 bg-gray-800 bg-opacity-50">
      <Dialog.Panel className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <Dialog.Title className="text-xl font-semibold">Edit Model Configuration</Dialog.Title>

        <input
          type="text"
          className="border px-4 py-2 rounded-md w-full mt-4"
          placeholder="Model Name"
          value={modelName}
          onChange={(e) => setModelName(e.target.value)}
        />
        <input
          type="text"
          className="border px-4 py-2 rounded-md w-full mt-2"
          placeholder="Dataset Version"
          value={datasetVersion}
          onChange={(e) => setDatasetVersion(e.target.value)}
        />

        <div className="mt-4 flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 text-white bg-[#7b6cff] rounded-md hover:bg-[#5f52cc]">Save</button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
};

export default EditInternalModel;
