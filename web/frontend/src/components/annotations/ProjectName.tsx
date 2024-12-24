import React from "react";

interface ProjectNameProps {}

const ProjectName: React.FC<ProjectNameProps> = () => {
  return (
    <div className="h-full p-6 flex flex-col justify-between">
      <form className="flex-grow">
        {/* Project Name Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Project Name
          </label>
          <input
            type="text"
            placeholder="New Project Name"
            className="mt-1 block w-full rounded-lg px-4 py-3 border border-gray-300 shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Project Photo URL Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Project Photo URL
          </label>
          <input
            type="text"
            placeholder="Add a URL for the project photo"
            className="mt-1 block w-full rounded-lg px-4 py-3 border border-gray-300 shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Description Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            placeholder="Optional description of your project"
            className="mt-1 block w-full rounded-lg px-4 py-3 border border-gray-300 shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={6} // Add additional rows for height
          ></textarea>
        </div>

        {/* Workspace Selection Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Workspace
          </label>
          <select className="mt-1 block w-full rounded-lg px-4 py-3 border border-gray-300 shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option>Select an option</option>
            <option>Workspace 1</option>
            <option>Workspace 2</option>
          </select>
        </div>
      </form>

      {/* Tip Section */}
      <div className="mt-4 p-4 bg-gray-50 border rounded-lg flex items-center space-x-4">
        <img
          src="https://via.placeholder.com/50"
          alt="Tip"
          className="w-12 h-12"
        />
        <div>
          <p className="text-sm font-medium">
            Did you know? You can use or modify dozens of templates to configure
            your project easily.{" "}
            <a href="#" className="text-blue-500 hover:underline">
              Learn more
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectName;


// import React from "react";

// interface ProjectNameProps {}

// const ProjectName: React.FC<ProjectNameProps> = () => {
//   return (
//     <div className="h-full p-6 flex flex-col justify-between">
//       <form className="flex-grow">
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">
//             Project Name
//           </label>
//           <input
//             type="text"
//             placeholder="New Project Name"
//             className="mt-1 block w-full rounded-lg px-4 py-3 border border-gray-300 shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">
//             Description
//           </label>
//           <textarea
//             placeholder="Optional description of your project"
//             className="mt-1 block w-full rounded-lg px-4 py-3 border border-gray-300 shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             rows={6} // Menambah jumlah baris untuk tinggi textarea
//           ></textarea>
//         </div>
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">
//             Workspace
//           </label>
//           <select className="mt-1 block w-full rounded-lg px-4 py-3 border border-gray-300 shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
//             <option>Select an option</option>
//             <option>Workspace 1</option>
//             <option>Workspace 2</option>
//           </select>
//         </div>
//       </form>
//       <div className="mt-4 p-4 bg-gray-50 border rounded-lg flex items-center space-x-4">
//         <img
//           src="https://via.placeholder.com/50"
//           alt="Tip"
//           className="w-12 h-12"
//         />
//         <div>
//           <p className="text-sm font-medium">
//             Did you know? You can use or modify dozens of templates to configure
//             your project easily.{" "}
//             <a href="#" className="text-blue-500 hover:underline">
//               Learn more
//             </a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProjectName;
