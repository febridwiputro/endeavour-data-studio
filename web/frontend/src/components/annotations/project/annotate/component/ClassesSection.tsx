import React from "react";

interface ClassesSectionProps {
  classes: any[];
  selectedColors: Record<string, boolean>;
  toggleColor: (color: string) => void;
}

const ClassesSection: React.FC<ClassesSectionProps> = ({
  classes,
  selectedColors,
  toggleColor,
}) => (
  <div className="flex items-center justify-between bg-white py-3 px-2 rounded-md shadow mb-4">
    <div className="flex space-x-2">
      {classes.map((cls) => (
        <span
          key={cls.name}
          onClick={() => toggleColor(cls.name)}
          className={`cursor-pointer text-xs font-medium px-3 py-1 rounded border transition-opacity duration-150 ${
            selectedColors[cls.name] ? "opacity-100" : "opacity-50"
          }`}
          style={{
            backgroundColor: cls.color,
            color: selectedColors[cls.name] ? "white" : "rgba(255, 255, 255, 0.8)",
          }}
        >
          {cls.name}
        </span>
      ))}
    </div>
  </div>
);

export default ClassesSection;