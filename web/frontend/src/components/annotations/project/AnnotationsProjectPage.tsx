import React, { useState } from "react";
import SidebarAnnotationProject from "./SidebarAnnotationProject";
import AnnotationUploadDataProjectPage from "./AnnotationUploadDataProjectPage";
import AnnotationAnnotateProjectLabelingPage from "./labeling/AnnotationAnnotateProjectLabelingPage";
import AnnotationDatasetProjectPage from "./AnnotationDatasetProjectPage";
import ExternalModelPage from "./externalModel/ExternalModelPage";
import AnnotationVisualize from "./AnnotationVisualize";
import DataVersionPage from "./dataVersion/DataVersionPage";
import ClassesAndTagsPage from "./classesAndTags/ClassesAndTagsPage";
import DataAnalyticsPage from "./dataAnalytics/DataAnalyticsPage";
import ModelsPage from "./models/ModelsPage";

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
      case "Versions":
        return <DataVersionPage/>
      case "Analytics":
        return <DataAnalyticsPage/>
      case "Classes & Tags":
        return <ClassesAndTagsPage/>
      case "Models":
        return <ModelsPage/>
      case "Upload Data":
      default:
        return <AnnotationUploadDataProjectPage />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Sidebar */}
      <SidebarAnnotationProject
        activePage={activePage}
        setActivePage={setActivePage}
      />

      {/* Main Content */}
      <div className="flex-1 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-colors">
        {renderContent()}
      </div>
    </div>
  );
};

export default AnnotationsProjectPage;
