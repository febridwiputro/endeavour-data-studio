import React, { useState } from "react";

const AnnotationAnnotateProjectV2Page: React.FC = () => {
  const [tasks, setTasks] = useState(Array.from({ length: 10 }, (_, i) => i + 1)); // Sample data
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);

  const handleSelectTask = (taskId: number) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Annotate</h1>
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-md shadow hover:bg-gray-300">
            Import
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-md shadow hover:bg-gray-300">
            Export
          </button>
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
            <button className="px-4 py-2 bg-white text-gray-700 text-sm flex items-center">
              List
            </button>
            <button className="px-4 py-2 bg-[#1a4f9d] text-white text-sm flex items-center">
              Grid
            </button>
          </div>
        </div>
      </div>

      {/* Table Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-md shadow mb-4">
        <div className="flex items-center space-x-2">
          <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
          <span className="text-sm text-gray-700">
            {selectedTasks.length} images selected
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-md shadow hover:bg-gray-300">
            Actions
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-md shadow hover:bg-gray-300">
            Columns
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-md shadow hover:bg-gray-300">
            Filters
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-md shadow hover:bg-gray-300">
            Order
          </button>
          <button className="px-4 py-2 bg-[#1a4f9d] text-white text-sm rounded-md shadow hover:bg-[#173e85]">
            Label All Tasks
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-md shadow">
        <table className="table-auto w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-4 py-2">
                <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
              </th>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Completed</th>
              <th className="px-4 py-2">Annotated by</th>
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((taskId) => (
              <tr key={taskId} className="hover:bg-gray-50">
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-blue-600"
                    checked={selectedTasks.includes(taskId)}
                    onChange={() => handleSelectTask(taskId)}
                  />
                </td>
                <td className="px-4 py-2">{taskId}</td>
                <td className="px-4 py-2">0</td>
                <td className="px-4 py-2">0</td>
                <td className="px-4 py-2">
                  <img
                    src="https://via.placeholder.com/50"
                    alt="Preview"
                    className="w-10 h-10 object-cover rounded-md"
                  />
                </td>
                <td className="px-4 py-2">
                  <button className="px-2 py-1 bg-gray-200 rounded-md text-sm hover:bg-gray-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="h-4 w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 6h16M4 12h16m-7 6h7"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnnotationAnnotateProjectV2Page;


// import React, { useState } from "react";

// const AnnotationAnnotateProjectV2Page: React.FC = () => {
//   const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
//   const [tasks, setTasks] = useState(
//     Array.from({ length: 10 }).map((_, index) => ({
//       id: 2280 + index,
//       completed: 0,
//       annotatedBy: "",
//       image:
//         "https://www.batamnews.co.id/foto_berita/2023/04/2023-04-10-kenapa-mobil-di-batam-tak-boleh-dibawa-keluar-pulau-batam-atau-mudik.jpeg",
//     }))
//   );

//   const toggleTaskSelection = (taskId: number) => {
//     setSelectedTasks((prev) =>
//       prev.includes(taskId)
//         ? prev.filter((id) => id !== taskId)
//         : [...prev, taskId]
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4">
//       {/* Header Section */}
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-semibold text-gray-800">Annotate</h1>
//         <div className="flex items-center space-x-2">
//           <button className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300">
//             Import
//           </button>
//           <button className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300">
//             Export
//           </button>
//           <div className="flex border border-gray-300 rounded-md overflow-hidden">
//             <button className="px-4 py-2 bg-gray-200 text-gray-700 text-sm hover:bg-gray-300">
//               List
//             </button>
//             <button className="px-4 py-2 bg-white text-gray-700 text-sm hover:bg-gray-100">
//               Grid
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Actions Section */}
//       <div className="flex justify-between items-center mb-4">
//         <div className="flex items-center space-x-4">
//           <button className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300">
//             Actions
//           </button>
//           <button className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300">
//             Columns
//           </button>
//           <button className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300">
//             Filters
//           </button>
//           <button className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300">
//             Order
//           </button>
//           <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
//             Label All Tasks
//           </button>
//         </div>
//         <span className="text-sm text-gray-500">
//           Tasks: {tasks.length} / Annotations: 0 / Predictions: 0
//         </span>
//       </div>

//       {/* Table Section */}
//       <div className="overflow-x-auto bg-white rounded-md shadow">
//         <table className="table-auto w-full border-collapse">
//           <thead>
//             <tr className="border-b bg-gray-100 text-left text-sm">
//               <th className="p-3">
//                 <input
//                   type="checkbox"
//                   className="form-checkbox text-blue-600 rounded"
//                   onChange={(e) =>
//                     setSelectedTasks(
//                       e.target.checked ? tasks.map((task) => task.id) : []
//                     )
//                   }
//                   checked={selectedTasks.length === tasks.length}
//                 />
//               </th>
//               <th className="p-3">ID</th>
//               <th className="p-3">Completed</th>
//               <th className="p-3">Annotated By</th>
//               <th className="p-3">Image</th>
//             </tr>
//           </thead>
//           <tbody>
//             {tasks.map((task) => (
//               <tr
//                 key={task.id}
//                 className={`border-b hover:bg-gray-100 ${
//                   selectedTasks.includes(task.id) ? "bg-blue-50" : ""
//                 }`}
//               >
//                 <td className="p-3">
//                   <input
//                     type="checkbox"
//                     className="form-checkbox text-blue-600 rounded"
//                     checked={selectedTasks.includes(task.id)}
//                     onChange={() => toggleTaskSelection(task.id)}
//                   />
//                 </td>
//                 <td className="p-3">{task.id}</td>
//                 <td className="p-3">{task.completed}</td>
//                 <td className="p-3">{task.annotatedBy}</td>
//                 <td className="p-3">
//                   <img
//                     src={task.image}
//                     alt={`Task ${task.id}`}
//                     className="h-12 w-12 object-cover rounded"
//                   />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default AnnotationAnnotateProjectV2Page;
