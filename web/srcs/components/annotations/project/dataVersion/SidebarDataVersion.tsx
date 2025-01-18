import React from "react";
import { FaCheckCircle, FaChevronRight } from "react-icons/fa";

interface SidebarDataVersionProps {
  selectedVersion: string;
  handleVersionClick: (version: string) => void;
}

const SidebarDataVersion: React.FC<SidebarDataVersionProps> = ({
  selectedVersion,
  handleVersionClick,
}) => {
  return (
    <div>
      <h2 className="text-sm font-bold text-black mb-4">VERSIONS</h2>
      {/* Raw Card */}
      <div
        className={`border rounded-md p-4 cursor-pointer transition ${
          selectedVersion === "raw"
            ? "border-[#1a4f9d] bg-[#e7effa]"
            : "hover:shadow-md"
        }`}
        onClick={() => handleVersionClick("raw")}
      >
        <h3 className="text-sm font-medium flex items-center">
          <FaCheckCircle
            className={`mr-2 ${
              selectedVersion === "raw" ? "text-[#1a4f9d]" : "text-gray-400"
            }`}
          />
          raw
        </h3>
        <p className="text-xs text-gray-500">v1 • a year ago</p>
        <div className="text-xs mt-2 flex items-center space-x-2">
          <span className="flex items-center space-x-1">
            <img
              src="https://via.placeholder.com/15"
              alt="Icon"
              className="w-3 h-3"
            />
            <span>100</span>
          </span>
          <span
            className={`text-xs py-1 px-2 rounded-md ${
              selectedVersion === "raw"
                ? "bg-[#d1e4f8] text-[#1a4f9d]"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            Fast
          </span>
          <span>COCO</span>
        </div>
      </div>
      {/* Augmented Card */}
      <div
        className={`border rounded-md p-4 cursor-pointer transition ${
          selectedVersion === "augmented"
            ? "border-[#1a4f9d] bg-[#e7effa]"
            : "hover:shadow-md"
        }`}
        onClick={() => handleVersionClick("augmented")}
      >
        <h3 className="text-sm font-medium flex items-center">
          <FaChevronRight
            className={`mr-2 ${
              selectedVersion === "augmented"
                ? "text-[#1a4f9d]"
                : "text-gray-400"
            }`}
          />
          augmented-416×416
        </h3>
        <p className="text-xs text-gray-500">v2 • a year ago</p>
        <div className="text-xs mt-2 flex items-center space-x-2">
          <span className="flex items-center space-x-1">
            <img
              src="https://via.placeholder.com/15"
              alt="Icon"
              className="w-3 h-3"
            />
            <span>240</span>
          </span>
          <span
            className={`text-xs py-1 px-2 rounded-md ${
              selectedVersion === "augmented"
                ? "bg-[#d1e4f8] text-[#1a4f9d]"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            416×416
          </span>
          <span>Stretch to</span>
        </div>
      </div>
    </div>
  );
};

export default SidebarDataVersion;
