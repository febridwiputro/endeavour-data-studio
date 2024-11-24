// types.ts
export interface SubFeature3 {
  name: string;
  description: string;
}

export interface SubFeature2 {
  name: string;
  description: string;
  sub_features_3?: SubFeature3[];
}

export interface SubFeature1 {
  name: string;
  description: string;
  sub_features_2?: SubFeature2[];
}

export interface Feature {
  name: string;
  description: string;
  sub_features_1: SubFeature1[];
}

export interface AnnotationData {
  name: string;
  description: string;
  features: Feature[];
}
