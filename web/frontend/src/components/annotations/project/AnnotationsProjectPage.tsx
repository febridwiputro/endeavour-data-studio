import React, { useState } from "react";
import SidebarAnnotationProject from "./SidebarAnnotationProject";
import AnnotationUploadDataProjectPage from "./AnnotationUploadDataProjectPage";
import AnnotationAnnotateProjectPage from "./AnnotationAnnotateProjectPage";
import AnnotationAnnotateProjectV2Page from "./AnnotationAnnotateProjectV2Page";
import AnnotationAnnotateProjectLabelingPage from "./labeling/AnnotationAnnotateProjectLabelingPage";
import AnnotationDatasetProjectPage from "./AnnotationDatasetProjectPage";

const AnnotationsProjectPage: React.FC = () => {
  const [activePage, setActivePage] = useState("Upload Data"); // Default page

  const renderContent = () => {
    switch (activePage) {
      case "Annotate":
        return <AnnotationAnnotateProjectLabelingPage />;
      case "Dataset":
        return <AnnotationDatasetProjectPage />
      case "Upload Data":
      default:
        return <AnnotationUploadDataProjectPage />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <SidebarAnnotationProject activePage={activePage} setActivePage={setActivePage} />

      {/* Main Content */}
      <div className="flex-1 p-6">{renderContent()}</div>
    </div>
  );
};

export default AnnotationsProjectPage;


// import React, { useState } from "react";
// import SidebarAnnotationProject from "./SidebarAnnotationProject";
// import AnnotationUploadDataProjectPage from "./AnnotationUploadDataProjectPage";

// const AnnotationsProjectPage: React.FC = () => {
//   const [batchName, setBatchName] = useState(
//     `Uploaded on ${new Date().toLocaleString()}`
//   );
//   const [tags, setTags] = useState("");

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Sidebar */}
//       <SidebarAnnotationProject />
//       <AnnotationUploadDataProjectPage/>
//     </div>
//   );
// };

// export default AnnotationsProjectPage;
