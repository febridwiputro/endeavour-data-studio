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
  