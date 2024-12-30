import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import {
  fetchAnnotationFeatures,
  fetchProjectAnnotationsByType,
} from "@/features/annotations/project/projectAnnotationSlice";
import RenderCard from "./RenderCard";
import DropdownSearch from "./DropdownSearch";
import AnnotationsProjectPage from "../project/AnnotationsProjectPage";

interface DefaultContentProps {
  menuData: any[];
}

const DefaultContent: React.FC<DefaultContentProps> = ({ menuData }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPage, setSelectedPage] = useState<string>("DefaultContent");
  const [selectedAnnotation, setSelectedAnnotation] = useState<{
    name: string;
    project_photo_url?: string;
    annotation_type?: string;
  } | null>(null);
  const [annotationsByType, setAnnotationsByType] = useState<
    Record<
      string,
      Array<{
        id: number;
        name: string;
        project_photo_url?: string;
        annotation_type?: string;
      }>
    >
  >({});
  const [loadingTypes, setLoadingTypes] = useState<Record<string, boolean>>({});
  const [errorTypes, setErrorTypes] = useState<Record<string, boolean>>({});
  const { annotationFeatures, status } = useSelector(
    (state: RootState) => state.projectAnnotations
  );
  const [expandedTypes, setExpandedTypes] = useState<Record<string, boolean>>(
    {}
  );

  useEffect(() => {
    dispatch(fetchAnnotationFeatures());
  }, [dispatch]);

  const toggleTypeExpansion = async (codeName: string) => {
    setExpandedTypes((prev) => ({
      ...prev,
      [codeName]: !prev[codeName],
    }));

    if (!annotationsByType[codeName] && !loadingTypes[codeName]) {
      setLoadingTypes((prev) => ({ ...prev, [codeName]: true }));
      setErrorTypes((prev) => ({ ...prev, [codeName]: false }));

      try {
        const response = await dispatch(
          fetchProjectAnnotationsByType(codeName)
        ).unwrap();
        setAnnotationsByType((prev) => ({
          ...prev,
          [codeName]: response.data || [],
        }));
      } catch (error) {
        console.error(`Failed to fetch annotations for ${codeName}:`, error);
        setErrorTypes((prev) => ({ ...prev, [codeName]: true }));
      } finally {
        setLoadingTypes((prev) => ({ ...prev, [codeName]: false }));
      }
    }
  };

  const handleCardClick = (annotation: {
    id: number;
    name: string;
    project_photo_url?: string;
    annotation_type?: string;
  }) => {
    setSelectedAnnotation(annotation);
    setSelectedPage("AnnotationsProjectPage");
  };

  if (status === "loading") {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400">
        Loading annotation types...
      </div>
    );
  }

  if (selectedPage === "AnnotationsProjectPage" && selectedAnnotation) {
    return (
      <AnnotationsProjectPage
        selectedAnnotation={selectedAnnotation} // Meneruskan anotasi yang dipilih
      />
    );
  }

  return (
    <section className="flex-1 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 w-full">
      <div className="h-screen overflow-hidden flex">
        {/* Sidebar and Header */}

        {/* Main Content with Scroll */}
        <div className="flex-1 overflow-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          <DropdownSearch
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />

          {annotationFeatures.map((type) => {
            const {
              code_name: codeName,
              name: typeName,
              description,
              logo_url,
            } = type;
            const isExpanded = expandedTypes[codeName] || false;
            const isLoading = loadingTypes[codeName];
            const hasError = errorTypes[codeName];
            const annotations = annotationsByType[codeName] || [];

            return (
              <div key={codeName} className="mt-8">
                <div
                  className="flex items-center justify-between cursor-pointer border-b pb-1 pt-2 dark:border-gray-700"
                  onClick={() => toggleTypeExpansion(codeName)}
                >
                  <div className="flex items-center">
                    {logo_url && (
                      <img
                        src={logo_url}
                        alt={typeName}
                        className="h-6 w-6 mr-3"
                      />
                    )}
                    <h3 className="text-lg sm:text-2xl font-semibold text-gray-800 dark:text-gray-200">
                      {typeName}
                    </h3>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4">
                    {isLoading ? (
                      <p className="text-gray-500 dark:text-gray-400">
                        Loading annotations for {typeName}...
                      </p>
                    ) : hasError ? (
                      <div className="text-center p-6">
                        <h3 className="text-lg font-semibold text-red-600">
                          Data Not Found
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                          Unable to fetch annotations for "{typeName}". Please
                          try again later.
                        </p>
                      </div>
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
                      <RenderCard
                        annotations={annotations}
                        onClick={(id) => {
                          const annotation = annotations.find(
                            (a) => a.id === id
                          );
                          if (annotation) handleCardClick(annotation);
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DefaultContent;