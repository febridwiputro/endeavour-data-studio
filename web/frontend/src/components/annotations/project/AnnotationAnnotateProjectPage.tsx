import React from "react";

const AnnotationAnnotateProjectPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12H9m4 8H7a2 2 0 01-2-2V7a2 2 0 012-2h5m10 12l-5-5m0 0l-5-5m5 5h-5"
            />
          </svg>
          <span>Annotate</span>
        </h1>
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-md shadow hover:bg-gray-300">
            Roboflow Labeling
          </button>
          <button className="px-4 py-2 bg-[#1a4f9d] text-white text-sm rounded-md shadow hover:bg-[#173e85]">
            + New Version
          </button>
        </div>
      </div>

      {/* Sort By Section */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-600">Sort By:</span>
          <select className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700">
            <option>Newest</option>
            <option>Oldest</option>
          </select>
        </div>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-3 gap-6">
        {/* Unassigned */}
        <div className="bg-white rounded-md shadow p-6 text-center">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">Unassigned</h2>
          <p className="text-sm text-gray-500 mb-4">0 Batches</p>
          <button className="px-4 py-2 text-[#1a4f9d] border border-[#1a4f9d] rounded-md text-sm hover:bg-[#e6f0ff]">
            Upload More Images
          </button>
        </div>

        {/* Annotating */}
        <div className="bg-white rounded-md shadow p-6 text-center">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">Annotating</h2>
          <p className="text-sm text-gray-500 mb-4">0 Jobs</p>
          <p className="text-sm text-gray-400">Upload and assign images to an annotator.</p>
        </div>

        {/* Dataset */}
        <div className="bg-white rounded-md shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">Dataset</h2>
          <p className="text-sm text-gray-500 mb-4">1 Job</p>
          <button className="w-full px-4 py-2 text-[#1a4f9d] border border-[#1a4f9d] rounded-md text-sm hover:bg-[#e6f0ff]">
            See all 100 images
          </button>
          <div className="mt-4 text-left">
            <p className="text-sm text-gray-500">Forked on 12/13/2023</p>
            <p className="text-sm text-gray-500">Labeler: Febri Dwi Putro</p>
            <p className="text-sm text-gray-500">100 Images</p>
            <div className="mt-2 flex space-x-2">
              <button className="p-2 bg-gray-200 rounded-md hover:bg-gray-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h11M9 21v-9"
                  />
                </svg>
              </button>
              <button className="p-2 bg-gray-200 rounded-md hover:bg-gray-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnotationAnnotateProjectPage;
