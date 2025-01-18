import React, { useState } from "react";
import { FaBolt, FaArrowRight } from "react-icons/fa";

const ModelsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Fine-tuned");

  const tabs = [
    { name: "Fine-tuned", count: 1 },
    { name: "Uploaded", count: 0 },
    { name: "Universe", count: 0 },
  ];

  const models = [
    {
      status: "Trained",
      modelName: "hard-hat-sample-j7lv9/1",
      mAP: "63.4%",
      precision: "95.3%",
      recall: "57.0%",
      type: "Roboflow 3.0 Object Detection (Fast)",
      datasetVersion: "raw",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Models</h1>
        <div className="flex space-x-4">
          <button className="px-4 py-2 text-sm text-[#1a4f9d] border border-[#1a4f9d] rounded-md hover:bg-[#e6f0ff]">
            + Generate Version
          </button>
          <button className="px-4 py-2 text-sm text-white bg-[#7b6cff] rounded-md hover:bg-[#5f52cc] flex items-center">
            <FaBolt className="mr-2" />
            Quick Train
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === tab.name
                ? "text-[#7b6cff] border-b-2 border-[#7b6cff]"
                : "text-gray-500 hover:text-[#7b6cff]"
            }`}
          >
            {tab.name} <span className="ml-1 text-gray-400">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Models Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-sm font-medium text-gray-500">
                STATUS
              </th>
              <th className="px-6 py-3 text-sm font-medium text-gray-500">
                MODEL NAME
              </th>
              <th className="px-6 py-3 text-sm font-medium text-gray-500">
                METRICS
              </th>
              <th className="px-6 py-3 text-sm font-medium text-gray-500">
                TYPE
              </th>
              <th className="px-6 py-3 text-sm font-medium text-gray-500">
                DATASET VERSION
              </th>
            </tr>
          </thead>
          <tbody>
            {models.map((model, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 border-b last:border-none"
              >
                <td className="px-6 py-4">
                  <span className="px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full">
                    ✓ {model.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-800">
                  {model.modelName}
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-6 items-center text-sm">
                    <div className="flex items-center space-x-1">
                      <span>mAP</span>
                      <div
                        className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden"
                        title="mAP"
                      >
                        <div
                          className="h-full bg-[#7b6cff]"
                          style={{ width: "63.4%" }}
                        ></div>
                      </div>
                      <span>{model.mAP}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>Precision</span>
                      <div
                        className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden"
                        title="Precision"
                      >
                        <div
                          className="h-full bg-[#00aaff]"
                          style={{ width: "95.3%" }}
                        ></div>
                      </div>
                      <span>{model.precision}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>Recall</span>
                      <div
                        className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden"
                        title="Recall"
                      >
                        <div
                          className="h-full bg-[#ffaa00]"
                          style={{ width: "57.0%" }}
                        ></div>
                      </div>
                      <span>{model.recall}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {model.type}
                </td>
                <td className="px-6 py-4">
                  <a
                    href="#"
                    className="text-[#7b6cff] hover:underline flex items-center"
                  >
                    {model.datasetVersion} <FaArrowRight className="ml-1" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ModelsPage;
