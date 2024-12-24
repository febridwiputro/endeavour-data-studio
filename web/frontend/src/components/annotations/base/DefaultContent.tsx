import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import {
    fetchAnnotationTypes,
    fetchProjectAnnotationsByType,
} from "@/features/annotations/project/projectAnnotationSlice";
import RenderCard from "./RenderCard";
import DropdownSearch from "./DropdownSearch";

interface DefaultContentProps {
    menuData: any[];
}

const DefaultContent: React.FC<DefaultContentProps> = ({ menuData }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedPage, setSelectedPage] = useState<string>("DefaultContent");
    const [annotationsByType, setAnnotationsByType] = useState<
        Record<string, Array<{ id: number; name: string; project_photo_url?: string }>>
    >({});
    const [loadingTypes, setLoadingTypes] = useState<Record<string, boolean>>({});

    const { annotationTypes, status } = useSelector(
        (state: RootState) => state.projectAnnotations
    );

    const [expandedTypes, setExpandedTypes] = useState<Record<string, boolean>>({});

    useEffect(() => {
        dispatch(fetchAnnotationTypes());
    }, [dispatch]);

    const toggleTypeExpansion = async (codeName: string) => {
        setExpandedTypes((prev) => ({
            ...prev,
            [codeName]: !prev[codeName],
        }));

        if (!annotationsByType[codeName] && !loadingTypes[codeName]) {
            setLoadingTypes((prev) => ({ ...prev, [codeName]: true }));
            try {
                const response = await dispatch(fetchProjectAnnotationsByType(codeName)).unwrap();
                setAnnotationsByType((prev) => ({
                    ...prev,
                    [codeName]: response.data || [],
                }));
            } finally {
                setLoadingTypes((prev) => ({ ...prev, [codeName]: false }));
            }
        }
    };

    const handleCardClick = () => {
        setSelectedPage("AnnotationProjectPage");
    };

    if (status === "loading") {
        return (
            <div className="text-center text-gray-500 dark:text-gray-400">
                Loading annotation types...
            </div>
        );
    }

    if (status === "failed") {
        return (
            <div className="text-center text-red-500 dark:text-red-400">
                Failed to load annotation types. Please try again later.
            </div>
        );
    }

    if (selectedPage === "AnnotationProjectPage") {
        return <div>Annotation Project Page</div>;
    }

    return (
        <section className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 w-full">
            <div className="px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
                {/* Header Section */}
                <div className="mx-auto max-w-full text-center">
                    <h2 className="text-3xl font-bold sm:text-4xl">Begin your process with DS</h2>
                    <p className="mt-4">
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    </p>
                    <DropdownSearch
                        menuData={menuData}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                    />
                </div>

                {/* Render Annotation Types */}
                {annotationTypes.map((type) => {
                    const { code_name: codeName, name: typeName, description, logo_url } = type;
                    const isExpanded = expandedTypes[codeName] || false;
                    const isLoading = loadingTypes[codeName];
                    const annotations = annotationsByType[codeName] || [];

                    return (
                        <div key={codeName} className="mt-8">
                            {/* Type Title with Dropdown Icon */}
                            <div
                                className="flex items-center justify-between cursor-pointer border-b pb-1 pt-2 dark:border-gray-700"
                                onClick={() => toggleTypeExpansion(codeName)}
                            >
                                <div className="flex items-center">
                                    {logo_url && (
                                        <img src={logo_url} alt={typeName} className="h-6 w-6 mr-3" />
                                    )}
                                    <h3 className="text-lg sm:text-2xl font-semibold text-gray-800 dark:text-gray-200">
                                        {typeName}
                                    </h3>
                                </div>
                                <span className="text-gray-500 dark:text-gray-400 text-lg">
                                    {isExpanded ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            className="w-6 h-6"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M6 15l6-6 6 6"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            className="w-6 h-6"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M6 9l6 6 6-6"
                                            />
                                        </svg>
                                    )}
                                </span>
                            </div>

                            {/* Render Cards or Empty Message */}
                            {isExpanded && (
                                <div className="mt-4">
                                    {isLoading ? (
                                        <p className="text-gray-500 dark:text-gray-400">
                                            Loading annotations for {typeName}...
                                        </p>
                                    ) : annotations.length === 0 ? (
                                        <div className="text-center p-6">
                                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                                No Annotations Found
                                            </h3>
                                            <p className="text-gray-500 dark:text-gray-400">
                                                There are no annotations available for "{typeName}".
                                            </p>
                                        </div>
                                    ) : (
                                        <RenderCard annotations={annotations} onClick={handleCardClick} />
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default DefaultContent;




// import React, { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState, AppDispatch } from "@/store/store";
// import { fetchAnnotations } from "@/features/annotations/annotationsSlice";
// import RenderCard from "./RenderCard";
// import RenderCardEditor from "./RenderCardEditor";
// import DropdownSearch from "./DropdownSearch";
// import { Feature } from "@/features/annotations/types";
// import AnnotationsProjectPage from "../project/AnnotationsProjectPage";

// interface DefaultContentProps {
//   menuData: any[];
// }

// const DefaultContent: React.FC<DefaultContentProps> = ({ menuData }) => {
//   const dispatch = useDispatch<AppDispatch>();
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
//   const [selectedPage, setSelectedPage] = useState<string>("DefaultContent");

//   const { annotations, loading, error } = useSelector(
//     (state: RootState) => state.annotations
//   );

//   const [expandedFeatures, setExpandedFeatures] = useState<
//     Record<string, boolean>
//   >({});

//   useEffect(() => {
//     dispatch(fetchAnnotations());
//   }, [dispatch]);

//   const toggleFeatureExpansion = (featureName: string) => {
//     setExpandedFeatures((prev) => ({
//       ...prev,
//       [featureName]: !prev[featureName],
//     }));
//   };

//   const handleCardClick = () => {
//     setSelectedPage("AnnotationProjectPage");
//   };

//   if (selectedPage === "AnnotationProjectPage") {
//     return <AnnotationsProjectPage />;
//   }

//   if (loading) {
//     return (
//       <div className="text-center text-gray-500 dark:text-gray-400">
//         Loading features...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center text-red-500 dark:text-red-400">
//         Error loading features: {error}
//       </div>
//     );
//   }

//   return (
//     <section
//       className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 w-full"
//     >
//       <div className="px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
//         {/* Header Section */}
//         <div className="mx-auto max-w-full text-center">
//           <h2 className="text-3xl font-bold sm:text-4xl">
//             Begin your process with DS
//           </h2>
//           <p className="mt-4">
//             Lorem ipsum, dolor sit amet consectetur adipisicing elit.
//           </p>
//           <DropdownSearch
//             menuData={menuData}
//             searchQuery={searchQuery}
//             setSearchQuery={setSearchQuery}
//             selectedCategory={selectedCategory}
//             setSelectedCategory={setSelectedCategory}
//           />
//         </div>

//         {/* Dynamically Render All Features */}
//         {annotations?.features?.map((feature: Feature) => {
//           const isExpanded = expandedFeatures[feature.name] || false;

//           return (
//             <div key={feature.name} className="mt-8">
//               {/* Feature Title with Dropdown Icon */}
//               <div
//                 className="flex items-center justify-between cursor-pointer border-b pb-1 pt-2 dark:border-gray-700"
//                 onClick={() => toggleFeatureExpansion(feature.name)}
//               >
//                 <h3 className="text-lg sm:text-2xl font-semibold text-gray-800 dark:text-gray-200">
//                   {feature.name}
//                 </h3>
//                 <span className="text-gray-500 dark:text-gray-400 text-lg">
//                   {isExpanded ? (
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       strokeWidth="1.5"
//                       stroke="currentColor"
//                       className="w-6 h-6"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         d="M6 15l6-6 6 6"
//                       />
//                     </svg>
//                   ) : (
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       strokeWidth="1.5"
//                       stroke="currentColor"
//                       className="w-6 h-6"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         d="M6 9l6 6 6-6"
//                       />
//                     </svg>
//                   )}
//                 </span>
//               </div>

//               {/* Always Render 5 Cards */}
//               {isExpanded && (
//                 <>
//                   {/* Card Grid Section */}
//                   <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
//                     {[...Array(5)].map((_, index) => (
//                       <RenderCard key={index} onClick={handleCardClick} />
//                     ))}
//                   </div>

//                   {/* Optional Section for Additional Cards */}
//                   <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
//                     {[...Array(5)].map((_, index) => (
//                       <RenderCardEditor key={index} />
//                     ))}
//                   </div>
//                 </>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </section>
//   );
// };

// export default DefaultContent;