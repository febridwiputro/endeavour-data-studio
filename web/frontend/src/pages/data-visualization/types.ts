interface Template {
  id: number;
  category: string;
  type: string[];
  purpose: string[];
  title: string;
  description: string;
  icon: React.ReactNode;
  image_url: string;
  inputDataType: string[];
  numFields: number;
  fieldTypes: string[];
  outputType: string[];
}