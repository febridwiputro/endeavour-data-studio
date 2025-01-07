// types.ts

export interface Task {
  id: number;
  image: string;
  completed: boolean;
  annotatedBy: string;
}

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
