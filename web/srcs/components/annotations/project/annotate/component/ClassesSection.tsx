import React from "react";

interface ClassesSectionProps {
  classes: any[];
  selectedColors: Record<string, boolean>;
  toggleColor: (color: string) => void;
  activeClass: string | null;
  setActiveClass: React.Dispatch<React.SetStateAction<string | null>>;
}

const ClassesSection: React.FC<ClassesSectionProps> = ({
  classes,
  selectedColors,
  toggleColor,
  activeClass,
  setActiveClass,
}) => (
  <div className="flex items-center justify-between bg-white py-3 px-2 rounded-md shadow mb-4">
    <div className="flex space-x-2">
      {classes.map((cls) => (
        <span
          key={cls.name}
          onClick={() => {
            if (activeClass === cls.name) {
              // Deactivate the class if already active
              setActiveClass(null);
              toggleColor(cls.name); // Reset the selected state
            } else {
              // Activate the class
              setActiveClass(cls.name);
              toggleColor(cls.name);
            }
          }}
          className={`cursor-pointer text-xs font-medium px-3 py-1 rounded border transition-opacity duration-150 ${
            selectedColors[cls.name]
              ? "opacity-100"
              : "opacity-50 cursor-not-allowed"
          }`}
          style={{
            backgroundColor: cls.color,
            color: selectedColors[cls.name] ? "white" : "rgba(255, 255, 255, 0.8)",
            borderColor: activeClass === cls.name ? "#4A90E2" : "transparent", // Highlight active class
          }}
        >
          {cls.name}
        </span>
      ))}
    </div>
  </div>
);

export default ClassesSection;