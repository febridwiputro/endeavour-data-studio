// src/services/annotationsApi.ts
import { api } from "@/services/apiConfig";

// types.ts
export interface BoundingBox {
    id: string; // Unique identifier for the bounding box
    x1: number; // Top-left X coordinate
    y1: number; // Top-left Y coordinate
    x2: number; // Bottom-right X coordinate
    y2: number; // Bottom-right Y coordinate
    w: number; // Width of the bounding box
    h: number; // Height of the bounding box
    label: string; // Annotation label
    color: string; // Color for visualization
  }
  

export const saveAnnotations = async (
  taskId: number,
  boundingBoxes: BoundingBox[],
  accessToken: string
) => {
  try {
    const annotationPayload = {
      data_id: taskId,
      annotation_results: boundingBoxes.map((box) => ({
        x1: box.x1,
        y1: box.y1,
        x2: box.x2,
        y2: box.y2,
        label: box.label,
        confidence_score: 1.0, // Default confidence
      })),
    };

    const response = await api.post("/annotations/annotate", annotationPayload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 201) {
      return { success: true, message: "Annotations saved successfully" };
    } else {
      return { success: false, message: "Failed to save annotations" };
    }
  } catch (error: any) {
    console.error("Error saving annotations:", error);
    return {
      success: false,
      message: error.response?.data?.message || "An error occurred",
    };
  }
};
