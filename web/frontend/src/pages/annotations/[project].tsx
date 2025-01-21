import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import AnnotationsProjectPage from "@/components/annotations/project/AnnotationsProjectPage";

const AnnotationsProject = () => {
  const router = useRouter();
  const { menu } = useSelector((state: RootState) => state.menu);

  const projectName = router.query.project;
  const selectedAnnotation = menu.find(
    (m) => m.name.toLowerCase().replace(/\s+/g, "-") === projectName
  );

  if (!selectedAnnotation) {
    return <p className="text-center mt-10 text-red-500">Project not found</p>;
  }

  return <AnnotationsProjectPage selectedAnnotation={selectedAnnotation} />;
};

export default AnnotationsProject;



// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/router";
// import SidebarAnnotationProject from "@/components/annotations/project/SidebarAnnotationProject";
// import AnnotationUploadDataProjectPage from "@/components/annotations/project/uploadData/AnnotationUploadDataProjectPage";
// import AnnotationAnnotateProjectLabelingPage from "@/components/annotations/project/annotate/AnnotationAnnotateProjectLabelingPage";
// import AnnotationDatasetProjectPage from "@/components/annotations/project/dataset/AnnotationDatasetProjectPage";
// import ExternalModelPage from "@/components/annotations/project/externalModel/ExternalModelPage";
// import AnnotationVisualize from "@/components/annotations/project/AnnotationVisualize";
// import DataVersionPage from "@/components/annotations/project/dataVersion/DataVersionPage";
// import ClassesAndTagsPage from "@/components/annotations/project/classesAndTags/ClassesAndTagsPage";
// import DataAnalyticsPage from "@/components/annotations/project/dataAnalytics/DataAnalyticsPage";
// import ModelsPage from "@/components/annotations/project/models/ModelsPage";
// import MonitoringPage from "@/components/annotations/project/monitoring/MonitoringPage";
// import ConfigEditor from "@/components/anomalib/Config";

// interface AnnotationsProjectPageProps {
//   selectedAnnotation: {
//     name: string;
//     project_photo_url?: string;
//     annotation_type?: string;
//   };
// }

// const AnnotationsProjectPage: React.FC<AnnotationsProjectPageProps> = ({ selectedAnnotation }) => {
//   const [activePage, setActivePage] = useState("Upload Data");
//   const router = useRouter();

//   // Ensure URL updates properly only if necessary
//   useEffect(() => {
//     if (selectedAnnotation) {
//       const formattedName = selectedAnnotation.name.toLowerCase().replace(/\s+/g, "-");
//       if (router.query.project !== formattedName) {
//         router.replace(`/annotations/${formattedName}`, undefined, { shallow: true });
//       }
//     }
//   }, [selectedAnnotation, router]);

//   // Function to render the correct page based on the active tab
//   const renderContent = () => {
//     switch (activePage) {
//       case "Annotate":
//         return <AnnotationAnnotateProjectLabelingPage />;
//       case "Dataset":
//         return <AnnotationDatasetProjectPage />;
//       case "External Models":
//         return <ExternalModelPage />;
//       case "Visualize":
//         return <AnnotationVisualize />;
//       case "Versions":
//         return <DataVersionPage />;
//       case "Analytics (EDA)":
//         return <DataAnalyticsPage />;
//       case "Classes & Tags":
//         return <ClassesAndTagsPage />;
//       case "Models":
//         return <ModelsPage />;
//       case "Monitoring":
//         return <MonitoringPage />;
//       case "Deployments":
//         return <ConfigEditor />;
//       case "Upload Data":
//       default:
//         return <AnnotationUploadDataProjectPage />;
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
//       {/* Sidebar for Navigation */}
//       <SidebarAnnotationProject activePage={activePage} setActivePage={setActivePage} selectedAnnotation={selectedAnnotation} />

//       {/* Main Content Section */}
//       <div className="flex-1 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-colors">
//         {renderContent()}
//       </div>
//     </div>
//   );
// };

// export default AnnotationsProjectPage;
