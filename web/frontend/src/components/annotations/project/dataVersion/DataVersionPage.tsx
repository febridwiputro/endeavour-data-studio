import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AugmentedVersionPage from "./AugmentedVersionPage";
import RawVersionPage from "./RawVersionPage";
import SidebarDataVersion from "./SidebarDataVersion";
import CreateNewVersionPage from "./CreateNewVersionPage";

const DataVersionPage: React.FC = () => {
  const [selectedVersion, setSelectedVersion] = useState<string>("raw");
  const [isTrainingGraphsExpanded, setIsTrainingGraphsExpanded] =
    useState(false);
  const [isDatasetDetailsExpanded, setIsDatasetDetailsExpanded] =
    useState(false);
  const [currentPage, setCurrentPage] = useState<string>("versions"); // Track the current page

  const router = useRouter();
  const { version } = router.query;

  const toggleTrainingGraphs = () =>
    setIsTrainingGraphsExpanded(!isTrainingGraphsExpanded);
  const toggleDatasetDetails = () =>
    setIsDatasetDetailsExpanded(!isDatasetDetailsExpanded);

  const handleVersionClick = (version: string) => {
    setSelectedVersion(version);
    router.push(`?version=${version}`);
  };

  const renderContent = () => {
    if (currentPage === "create-new-version") {
      return <CreateNewVersionPage />;
    }

    if (!version) {
      return <p>Loading...</p>; // Fallback UI while `router.query` is loading
    }

    if (version === "raw") {
      return (
        <RawVersionPage
          isDatasetDetailsExpanded={isDatasetDetailsExpanded}
          toggleDatasetDetails={toggleDatasetDetails}
          isTrainingGraphsExpanded={isTrainingGraphsExpanded}
          toggleTrainingGraphs={toggleTrainingGraphs}
        />
      );
    } else if (version === "augmented") {
      return <AugmentedVersionPage />;
    }

    return <p>Version not found.</p>; // Handle unsupported versions
  };

  useEffect(() => {
    // Set default version if none is provided
    if (!version) {
      router.push("?version=raw");
    }
  }, [version, router]);

  return (
    <div className="flex min-h-screen bg-gray-100 p-6">
      {/* Sidebar */}
      <div className="w-1/4 bg-white shadow-md rounded-lg p-4">
        <button
          onClick={() => setCurrentPage("create-new-version")}
          style={{
            backgroundColor: "#1a4f9d",
            color: "#fff",
          }}
          className="w-full py-2 px-4 text-sm font-medium rounded-md hover:opacity-90 mb-4"
        >
          + Create New Version
        </button>
        <SidebarDataVersion
          selectedVersion={selectedVersion}
          handleVersionClick={handleVersionClick}
        />
      </div>
      {/* Main Content */}
      {renderContent()}
    </div>
  );
};

export default DataVersionPage;
