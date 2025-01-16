import React from "react";

interface HeaderSectionProps {
  batchName: string;
  setBatchName: (value: string) => void;
  tags: string;
  setTags: (value: string) => void;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({
  batchName,
  setBatchName,
  tags,
  setTags,
}) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Upload</h1>
      <div className="flex space-x-4 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Batch Name:
          </label>
          <input
            type="text"
            value={batchName}
            onChange={(e) => setBatchName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-[#1a4f9d] focus:border-[#1a4f9d]"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags:
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-[#1a4f9d] focus:border-[#1a4f9d]"
            placeholder="Search or add tags for images..."
          />
        </div>
      </div>
    </div>
  );
};

export default HeaderSection;
