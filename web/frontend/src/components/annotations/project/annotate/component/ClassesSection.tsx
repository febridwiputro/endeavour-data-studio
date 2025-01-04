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
          className={`${
            selectedColors[cls.name] ? "" : "opacity-50"
          } bg-[${cls.color}] text-xs font-medium px-3 py-1 rounded border cursor-pointer`}
          style={{
            backgroundColor: cls.color,
            color: selectedColors[cls.name] ? "white" : "black",
          }}
        >
          {cls.name}
        </span>
      ))}
    </div>
  </div>
);

export default ClassesSection;


// import React from "react";
// import ClassBadge from "./ClassBadge";

// interface ClassesSectionProps {
//   classes: any[];
//   selectedColors: Record<string, boolean>;
//   toggleColor: (color: string) => void;
// }

// const ClassesSection: React.FC<ClassesSectionProps> = ({ classes, selectedColors, toggleColor }) => (
//   <div className="flex items-center justify-between bg-white py-3 px-2 rounded-md shadow mb-4">
//     <div className="flex space-x-2">
//       {classes.map((cls) => (
//         <ClassBadge
//           key={cls.name}
//           name={cls.name}
//           color={cls.color}
//           isSelected={selectedColors[cls.name]}
//           onClick={() => toggleColor(cls.name)}
//         />
//       ))}
//     </div>
//   </div>
// );

// export default ClassesSection;
