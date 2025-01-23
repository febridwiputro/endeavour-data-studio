import React, { useState } from "react";
import SidebarAnnotationProject from "./SidebarAnnotationProject";
import AnnotationUploadDataProjectPage from "./uploadData/AnnotationUploadDataProjectPage";
import AnnotationAnnotateProjectLabelingPage from "./annotate/AnnotationAnnotateProjectLabelingPage";
import AnnotationDatasetProjectPage from "./dataset/AnnotationDatasetProjectPage";
import ExternalModelPage from "./externalModel/ExternalModelPage";
import AnnotationVisualize from "./AnnotationVisualize";
import DataVersionPage from "./dataVersion/DataVersionPage";
import ClassesAndTagsPage from "./classesAndTags/ClassesAndTagsPage";
import DataAnalyticsPage from "./dataAnalytics/DataAnalyticsPage";
import ModelsPage from "./models/ModelsPage";
import MonitoringPage from "./monitoring/MonitoringPage";
import ConfigEditor from "@/components/anomalib/Config";
import {
  ArrowUpTrayIcon,
  PencilIcon,
  TableCellsIcon,
  Squares2X2Icon,
  CubeIcon,
  EyeIcon,
  ServerStackIcon,
  AcademicCapIcon,
  ChartBarSquareIcon,
  TagIcon,
} from "@heroicons/react/24/outline";

interface AnnotationsProjectPageProps {
  selectedAnnotation: {
    name: string;
    project_photo_url?: string;
    annotation_type?: string;
    code_name?: string;
  };
}

const AnnotationsProjectPage: React.FC<AnnotationsProjectPageProps> = ({
  selectedAnnotation,
}) => {
  const [activePage, setActivePage] = useState("Upload Data");

  // ✅ Mapping Icon Berdasarkan activePage
  const pageIcons: { [key: string]: React.ElementType } = {
    "Upload Data": ArrowUpTrayIcon,
    Annotate: PencilIcon,
    Dataset: TableCellsIcon,
    Versions: Squares2X2Icon,
    "Analytics (EDA)": ChartBarSquareIcon,
    "Classes & Tags": TagIcon,
    Models: CubeIcon,
    "External Models": CubeIcon,
    Visualize: EyeIcon,
    Monitoring: ServerStackIcon,
    Deployments: ServerStackIcon,
    "Active Learning": AcademicCapIcon,
  };

  const IconComponent = pageIcons[activePage] || CubeIcon;

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
        return <DataVersionPage />;
      case "Analytics (EDA)":
        return <DataAnalyticsPage />;
      case "Classes & Tags":
        return <ClassesAndTagsPage />;
      case "Models":
        return <ModelsPage />;
      case "Monitoring":
        return <MonitoringPage />;
      case "Deployments":
        return <ConfigEditor />;
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
        selectedAnnotation={selectedAnnotation}
      />

      {/* Main Content */}
      <div className="flex-1 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-colors pl-3 pr-6 py-0">
        {/* ✅ Kurangi padding kiri (pl-3 instead of px-6) */}

        {/* Dynamic Title with Icon */}
        <div className="mb-2"> {/* ✅ Flex untuk icon + title */}
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg px-6 py-4 flex items-center space-x-3">
            <IconComponent className="w-6 h-6 text-gray-500 dark:text-gray-400" /> {/* ✅ Tambahkan Icon */}
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-200">
              {activePage}
            </h1>
          </div>
        </div>

        {/* Render Content with Margin */}
        <div className="mt-2">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AnnotationsProjectPage;
