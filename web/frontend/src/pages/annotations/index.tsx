// pages/annotations/index.tsx

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { RootState, AppDispatch } from "@/store/store";
import Layout from "@/components/Layout";
import { HomeIcon, FolderIcon } from "@heroicons/react/24/outline";
import { fetchMenu } from "@/features/menu/menuSlice";
import {
  fetchAnnotationFeatures,
  fetchProjectAnnotationsByType,
  setSelectedAnnotation,
} from "@/features/annotations/project/projectAnnotationSlice";
import AnnotationsProjectPage from "@/components/annotations/project/AnnotationsProjectPage";
import DropdownSearch from "@/components/annotations/base/DropdownSearch";
import RenderCard from "@/components/annotations/base/RenderCard";

const AnnotationsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { menu } = useSelector((state: RootState) => state.menu);
  const { annotationFeatures, selectedAnnotation } = useSelector(
    (state: RootState) => state.projectAnnotations
  );

  const [selectedMenu, setSelectedMenu] = useState<string>("Annotations");
  const [annotationsByType, setAnnotationsByType] = useState<
    Record<string, any[]>
  >({});
  const [expandedTypes, setExpandedTypes] = useState<Record<string, boolean>>(
    {}
  );
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchMenu());
    dispatch(fetchAnnotationFeatures());
  }, [dispatch]);

  const handleCategoryClick = (codeName: string) => {
    setExpandedTypes((prev) => ({
      ...prev,
      [codeName]: !prev[codeName],
    }));

    if (!annotationsByType[codeName]) {
      dispatch(fetchProjectAnnotationsByType(codeName))
        .unwrap()
        .then((response) => {
          setAnnotationsByType((prev) => ({
            ...prev,
            [codeName]: response.data || [],
          }));
        });
    }
  };

  const handleAnnotationSelect = (annotation: any) => {
    dispatch(setSelectedAnnotation(annotation));
    localStorage.setItem("selectedAnnotation", JSON.stringify(annotation));
  };

  const breadcrumbItems = [
    { label: "Home", href: "/", icon: <HomeIcon className="w-4 h-4" /> },
    {
      label: "Annotations",
      href: "/annotations",
      icon: <FolderIcon className="w-4 h-4" />,
    },
    ...(selectedAnnotation
      ? [
          {
            label: selectedAnnotation.name,
            href: "",
            icon: <FolderIcon className="w-4 h-4" />,
            isActive: true,
          },
        ]
      : []),
  ];

  return (
    <Layout
      menuData={menu}
      onMenuClick={(menuName) => setSelectedMenu(menuName)}
      selectedMenu={selectedMenu}
      breadcrumbItems={breadcrumbItems}
    >
      {/* Page content */}
      {selectedAnnotation ? (
        <AnnotationsProjectPage selectedAnnotation={selectedAnnotation} />
      ) : (
        <section className="px-6 py-4">
            <div className="px-2 py-2">
              <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg px-6 py-3">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-200">
                  Annotations
                </h1>
              </div>
            </div>

          <DropdownSearch
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={null}
            setSelectedCategory={() => {}}
          />
          <div>
            {annotationFeatures.map((type) => {
              const { code_name: codeName, name: typeName, logo_url } = type;

              const isExpanded = expandedTypes[codeName] || false;
              const annotations = annotationsByType[codeName] || [];

              return (
                <div key={codeName} className="mt-6">
                  <div
                    className="flex items-center justify-between cursor-pointer bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                    onClick={() => handleCategoryClick(codeName)}
                  >
                    <div className="flex items-center">
                      {logo_url && (
                        <img
                          src={logo_url}
                          alt={typeName}
                          className="h-8 w-8 mr-3 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (annotations.length > 0) {
                              handleAnnotationSelect(annotations[0]);
                            }
                          }}
                        />
                      )}
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        {typeName}
                      </h3>
                    </div>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                      {isExpanded ? "Hide" : "Show"}
                    </span>
                  </div>
                  {isExpanded && (
                    <div className="mt-4">
                      <RenderCard
                        annotations={annotations}
                        onClick={(id) =>
                          handleAnnotationSelect(
                            annotations.find((a) => a.id === id)
                          )
                        }
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </Layout>
  );
};

export default AnnotationsPage;