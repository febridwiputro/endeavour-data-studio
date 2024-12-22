interface SubFeature {
    name: string;
    description: string;
    points: string[];
  }
  
  interface MenuItem {
    name: string;
    description: string;
    sub_features: SubFeature[];
  }
  
  interface MenuState {
    menu: MenuItem[];
    loading: boolean;
    error: string | null;
  }
  