import React, { useState } from "react";
import SidebarAnnotationProject from "./SidebarAnnotationProject";
import AnnotationUploadDataProjectPage from "./AnnotationUploadDataProjectPage";
import AnnotationAnnotateProjectLabelingPage from "./labeling/AnnotationAnnotateProjectLabelingPage";
import AnnotationDatasetProjectPage from "./AnnotationDatasetProjectPage";
import ExternalModelPage from "./externalModel/ExternalModelPage";
import AnnotationVisualize from "./AnnotationVisualize";

const AnnotationsProjectPage: React.FC = () => {
  const [activePage, setActivePage] = useState("Upload Data");

  const renderContent = () => {
    switch (activePage) {
      case "Annotate":
        return <AnnotationAnnotateProjectLabelingPage />;
      case "Dataset":
        return <AnnotationDatasetProjectPage />;
      case "External Models":
        return <ExternalModelPage />;
      case "Visualize":
        return <AnnotationVisualize />;
      case "Upload Data":
      default:
        return <AnnotationUploadDataProjectPage />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <SidebarAnnotationProject
        activePage={activePage}
        setActivePage={setActivePage}
      />

      {/* Main Content */}
      <div className="flex-1">
        {renderContent()}
      </div>
    </div>
  );
};

export default AnnotationsProjectPage;