// types.ts

export interface Task {
  id: number;
  file_url: string;
  // description: string | null;
  data_type: string;
  drafts: string | null;
  completed: boolean;
  avg_confidence_score: number;
  // created_at: string;
  updated_at: string;
  metadata: {
    image_metadata?: {
      width: number;
      height: number;
    };
  };
}

// export interface Task {
//   id: number;
//   image: string;
//   completed: boolean;
//   annotatedBy: string;
// }

export interface Annotation {
  id: number;
  type: string;
  color: string;
}

export interface BoundingBox {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  w: number;
  h: number;
  color: string;
  label: string;
  confidence?: number;
  isSelected?: boolean;
}
