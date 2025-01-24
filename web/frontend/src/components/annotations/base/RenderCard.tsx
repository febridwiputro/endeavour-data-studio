import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { api } from "@/services/apiConfig";
import { useQueries } from "@tanstack/react-query";
import { setSelectedProjectId } from "@/features/annotations/project/projectSlice";

import {
  CheckCircleIcon,
  XCircleIcon,
  FolderIcon,
  ClockIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";

interface RenderCardProps {
  annotations: Array<{
    id: number;
    name: string;
    project_photo_url?: string;
    annotation_type?: string;
    code_name?: string;
  }>;
  onClick: (id: number) => void;
}

const fetchAnnotationStats = async (annotationId: number, token: string) => {
  if (!token) throw new Error("No access token available");
  const response = await api.get(
    `/annotations/image-annotations/annotation-status/`,
    {
      headers: { Authorization: `Bearer ${token}` },
      params: { project_id: annotationId },
    }
  );
  return response.data.data;
};

const RenderCard: React.FC<RenderCardProps> = ({ annotations, onClick }) => {
  const dispatch = useDispatch();
  const selectedProjectId = useSelector(
    (state: RootState) => state.project.selectedProjectId
  );
  const accessToken =
    useSelector((state: RootState) => state.auth.accessToken) || "";
  const [imageError, setImageError] = useState<Record<number, boolean>>({});

  // Fetch data for each annotation
  const annotationQueries = useQueries({
    queries: annotations.map((annotation) => ({
      queryKey: ["annotationStats", annotation.id],
      queryFn: () => fetchAnnotationStats(annotation.id, accessToken),
      enabled: !!accessToken,
    })),
  });

  const formatDateTime = (dateString: string | null): string => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date
      .toLocaleString("en-CA", {
        timeZone: "Asia/Jakarta",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .replace(",", "");
  };

  if (annotations.length === 0) {
    return <p>No annotations available for this type.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {annotations.map((annotation, index) => {
        const query = annotationQueries[index];

        if (query.isLoading) {
          return (
            <div
              key={annotation.id}
              className="relative block rounded-lg overflow-hidden shadow-md transition-shadow animate-pulse bg-gray-200 h-36 w-full"
            ></div>
          );
        }

        if (query.isError) {
          return (
            <div key={annotation.id} className="text-red-500">
              Failed to load annotation stats.
            </div>
          );
        }

        const stats = query.data;

        return (
          <div
            key={annotation.id}
            className={`relative block rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow ${
              selectedProjectId === annotation.id ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() => dispatch(setSelectedProjectId(annotation.id))}
          >
            <div
              className="block cursor-pointer"
              onClick={(e) => {
                e.preventDefault(); // Mencegah halaman berpindah
                onClick(annotation.id);
              }}
            >
              {/* ✅ Project Image atau Fallback Icon */}
              <div className="relative h-36 w-full">
                {annotation.project_photo_url && !imageError[annotation.id] ? (
                  <img
                    alt={annotation.name}
                    src={annotation.project_photo_url}
                    className="absolute inset-0 h-full w-full object-cover rounded-t-lg"
                    onError={() =>
                      setImageError((prev) => ({
                        ...prev,
                        [annotation.id]: true,
                      }))
                    }
                  />
                ) : (
                  <div className="absolute inset-0 h-full w-full bg-gray-200 flex items-center justify-center rounded-t-lg">
                    <PhotoIcon className="h-12 w-12 text-gray-500" />
                  </div>
                )}
              </div>
            </div>

            {/* Card Content */}
            <div className="p-3 bg-white rounded-b-lg">
              <dl>
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-4 h-4 text-gray-500" />
                  <span className="text-xs text-gray-500">
                    {formatDateTime(stats?.last_update || null)}
                  </span>
                </div>

                <div>
                  <dt className="sr-only">Feature</dt>
                  <dd className="font-medium text-sm text-gray-800">
                    {annotation.annotation_type}
                  </dd>
                  <dd className="font-medium text-sm text-gray-900">
                    {annotation.name}
                  </dd>
                </div>
              </dl>

              {/* Statistik Anotasi dengan Hint */}
              {stats && (
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-700">
                  {/* Annotated Data */}
                  <div className="relative group flex items-center gap-1">
                    <CheckCircleIcon className="w-5 h-5 text-green-700 cursor-pointer" />
                    <span>{stats.annotated_data}</span>
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gray-900 text-white text-xs rounded px-3 py-1 flex items-center gap-2">
                      <CheckCircleIcon className="w-4 h-4 text-white" />
                      Annotated: {stats.annotated_data}
                    </div>
                  </div>

                  {/* Non-Annotated Data */}
                  <div className="relative group flex items-center gap-1">
                    <XCircleIcon className="w-5 h-5 text-red-700 cursor-pointer" />
                    <span>{stats.non_annotated_data}</span>
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gray-900 text-white text-xs rounded px-3 py-1 flex items-center gap-2">
                      <XCircleIcon className="w-4 h-4 text-white" />
                      Unannotated: {stats.non_annotated_data}
                    </div>
                  </div>

                  {/* Total Data */}
                  <div className="relative group flex items-center gap-1">
                    <FolderIcon className="w-5 h-5 text-blue-700 cursor-pointer" />
                    <span>{stats.total_data}</span>
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gray-900 text-white text-xs rounded px-3 py-1 flex items-center gap-2">
                      <FolderIcon className="w-4 h-4 text-white" />
                      Total: {stats.total_data}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RenderCard;
