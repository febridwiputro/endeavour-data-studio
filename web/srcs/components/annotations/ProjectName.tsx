import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import {
  fetchAnnotationFeatures,
  fetchSubFeatures1ByFeature,
  fetchSubFeatures2BySubFeature1,
} from "@/features/annotations/project/projectAnnotationSlice";
import { fetchUserInfo } from "@/features/user/userSlice";
import AlertBase from "../base/AlertBase";
import { logout } from "@/features/auth/authSlice";
import { useRouter } from "next/router";

const ProjectName: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { id: userId, status: userStatus } = useSelector(
    (state: RootState) => state.user
  );
  const {
    annotationFeatures = [],
    subAnnotationFeatures1ByFeature = [],
    subAnnotationFeatures2BySubFeature1 = [],
  } = useSelector((state: RootState) => state.projectAnnotations);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    project_photo_url: "",
    annotation_type: "",
    sub_feature_1_id: "",
    sub_feature_2_id: "",
  });

  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState<{
    show: boolean;
    type: "success" | "error" | "warning" | "info";
    message: string;
  }>({ show: false, type: "info", message: "" });
  
  useEffect(() => {
    if (userStatus === "idle") {
      dispatch(fetchUserInfo());
    }
    dispatch(fetchAnnotationFeatures());
  }, [dispatch, userStatus]);

  useEffect(() => {
    if (formData.annotation_type) {
      const selectedFeature = annotationFeatures.find(
        (type) => type.code_name === formData.annotation_type
      );

      if (selectedFeature) {
        dispatch(fetchSubFeatures1ByFeature(selectedFeature.id));
        setFormData((prev) => ({
          ...prev,
          sub_feature_1_id: "",
          sub_feature_2_id: "",
        }));
      } else {
        // Reset dependent fields if annotation type is invalid or empty
        setFormData((prev) => ({
          ...prev,
          sub_feature_1_id: "",
          sub_feature_2_id: "",
        }));
      }
    } else {
      // Reset dependent fields if annotation type is empty
      setFormData((prev) => ({
        ...prev,
        sub_feature_1_id: "",
        sub_feature_2_id: "",
      }));
    }
  }, [formData.annotation_type, annotationFeatures, dispatch]);

  useEffect(() => {
    if (formData.sub_feature_1_id) {
      dispatch(
        fetchSubFeatures2BySubFeature1(Number(formData.sub_feature_1_id))
      );
      setFormData((prev) => ({ ...prev, sub_feature_2_id: "" }));
    }
  }, [formData.sub_feature_1_id, dispatch]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("accessToken");
    if (!token) {
      setAlert({
        show: true,
        type: "error",
        message: "Access token is missing. Please log in again.",
      });
      dispatch(logout());
      router.push("/login");
      return;
    }

    setLoading(true);

    const payload = {
      name: formData.name,
      description: formData.description,
      project_photo_url: formData.project_photo_url,
      sub_feature_2_id: Number(formData.sub_feature_2_id),
    };

    try {
      await axios.post(
        "http://127.0.0.1:8000/annotations/annotation-project",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAlert({
        show: true,
        type: "success",
        message: "Project created successfully!",
      });

      setFormData({
        name: "",
        description: "",
        project_photo_url: "",
        annotation_type: "",
        sub_feature_1_id: "",
        sub_feature_2_id: "",
      });
    } catch (error: any) {
      if (error?.response?.status === 401) {
        setAlert({
          show: true,
          type: "error",
          message: "Unauthorized. Please log in again.",
        });
        dispatch(logout());
        router.push("/login");
      } else {
        setAlert({
          show: true,
          type: "error",
          message: `Failed to create project: ${error.message}`,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full p-6 flex flex-col justify-between">
      <form className="flex-grow" onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row sm:space-x-4 mb-4">
          <div className="flex-grow">
            <label className="block text-sm font-medium text-gray-700">
              Project Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="New Project Name"
              required
              className="mt-1 block w-full rounded-lg px-4 py-3 border border-gray-300 shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex-grow mt-4 sm:mt-0">
            <label className="block text-sm font-medium text-gray-700">
              Project Photo URL
            </label>
            <input
              type="text"
              name="project_photo_url"
              value={formData.project_photo_url}
              onChange={handleInputChange}
              placeholder="Add a URL for the project photo"
              required
              className="mt-1 block w-full rounded-lg px-4 py-3 border border-gray-300 shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:space-x-4 mb-4">
          <div className="flex-grow">
            <label className="block text-sm font-medium text-gray-700">
              Annotation Type
            </label>
            <select
              name="annotation_type"
              value={formData.annotation_type}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-lg px-4 py-3 border border-gray-300 shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select an annotation type</option>
              {annotationFeatures.map((type) => (
                <option key={type.id} value={type.code_name}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-grow">
            <label className="block text-sm font-medium text-gray-700">
              Sub Feature 1
            </label>
            <select
              name="sub_feature_1_id"
              value={formData.sub_feature_1_id}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-lg px-4 py-3 border border-gray-300 shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={!formData.annotation_type}
            >
              <option value="">Select a sub feature 1</option>
              {subAnnotationFeatures1ByFeature.map((subFeature) => (
                <option key={subFeature.id} value={subFeature.id}>
                  {subFeature.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-grow">
            <label className="block text-sm font-medium text-gray-700">
              Sub Feature 2
            </label>
            <select
              name="sub_feature_2_id"
              value={formData.sub_feature_2_id}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-lg px-4 py-3 border border-gray-300 shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={!formData.sub_feature_1_id}
            >
              <option value="">Select a sub feature 2</option>
              {subAnnotationFeatures2BySubFeature1.map((subFeature) => (
                <option key={subFeature.id} value={subFeature.id}>
                  {subFeature.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Optional description of your project"
            className="mt-1 block w-full rounded-lg px-4 py-3 border border-gray-300 shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={6}
          ></textarea>
        </div>

        <div className="mt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {loading ? "Creating Project..." : "Create Project"}
          </button>
        </div>
      </form>

      <AlertBase
        show={alert.show}
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert((prev) => ({ ...prev, show: false }))}
      />
    </div>
  );
};

export default ProjectName;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState, AppDispatch } from "@/store/store";
// import {
//   fetchAnnotationFeatures,
//   fetchSubFeatures1ByFeature,
//   fetchSubFeatures2BySubFeature1,
// } from "@/features/annotations/project/projectAnnotationSlice";
// import { fetchUserInfo } from "@/features/user/userSlice";
// import AlertBase from "../base/AlertBase";
// import { logout } from "@/features/auth/authSlice";
// import { useRouter } from "next/router";

// const ProjectName: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const router = useRouter();

//   // Fetching user ID from Redux
//   const { id: userId, status: userStatus } = useSelector(
//     (state: RootState) => state.user
//   );
//   const {
//     annotationFeatures = [],
//     subAnnotationFeatures1ByFeature = [],
//     subAnnotationFeatures2BySubFeature1 = [],
//   } = useSelector((state: RootState) => state.projectAnnotations);

//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     project_photo_url: "",
//     annotation_type: "",
//     sub_feature_1_id: "",
//     sub_feature_2_id: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [alert, setAlert] = useState<{
//     show: boolean;
//     type: "success" | "error" | "warning" | "info";
//     message: string;
//   }>({ show: false, type: "info", message: "" });

//   // Fetch dependencies on mount
//   useEffect(() => {
//     if (userStatus === "idle") {
//       dispatch(fetchUserInfo());
//     }
//     dispatch(fetchAnnotationFeatures());
//   }, [dispatch, userStatus]);

//   // Fetch Sub Features 1 when Annotation Type changes
//   useEffect(() => {
//     if (formData.annotation_type) {
//       const selectedFeature = annotationFeatures.find(
//         (type) => type.code_name === formData.annotation_type
//       );
//       if (selectedFeature) {
//         dispatch(fetchSubFeatures1ByFeature(selectedFeature.id));
//         setFormData((prev) => ({ ...prev, sub_feature_1_id: "", sub_feature_2_id: "" }));
//       }
//     }
//   }, [formData.annotation_type, annotationFeatures, dispatch]);

//   // Fetch Sub Features 2 when Sub Feature 1 changes
//   useEffect(() => {
//     if (formData.sub_feature_1_id) {
//       dispatch(
//         fetchSubFeatures2BySubFeature1(Number(formData.sub_feature_1_id))
//       );
//       setFormData((prev) => ({ ...prev, sub_feature_2_id: "" }));
//     }
//   }, [formData.sub_feature_1_id, dispatch]);

//   const handleInputChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const token = localStorage.getItem("accessToken");
//     console.log("Access Token:", token);
//     if (!token) {
//       setAlert({
//         show: true,
//         type: "error",
//         message: "Access token is missing. Please log in again.",
//       });
//       dispatch(logout());
//       router.push("/login");
//       return;
//     }

//     setLoading(true);

//     const payload = {
//       name: formData.name,
//       description: formData.description,
//       project_photo_url: formData.project_photo_url,
//       sub_feature_2_id: Number(formData.sub_feature_2_id),
//     };

//     try {
//       const response = await axios.post(
//         "http://127.0.0.1:8000/annotations/annotation-project",
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`, // Send token in Authorization header
//           },
//         }
//       );

//       setAlert({
//         show: true,
//         type: "success",
//         message: "Project created successfully!",
//       });

//       setFormData({
//         name: "",
//         description: "",
//         project_photo_url: "",
//         annotation_type: "",
//         sub_feature_1_id: "",
//         sub_feature_2_id: "",
//       });
//     } catch (error: any) {
//       console.error("Error creating project:", error);

//       if (error?.response?.status === 401) {
//         setAlert({
//           show: true,
//           type: "error",
//           message: "Unauthorized. Please log in again.",
//         });
//         dispatch(logout());
//         router.push("/login");
//       } else {
//         setAlert({
//           show: true,
//           type: "error",
//           message: `Failed to create project: ${error.message}`,
//         });
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="h-full p-6 flex flex-col justify-between">
//       {/* Form */}
//       <form className="flex-grow" onSubmit={handleSubmit}>
//         {/* Project Name and Photo URL */}
//         <div className="flex flex-col sm:flex-row sm:space-x-4 mb-4">
//           <div className="flex-grow">
//             <label className="block text-sm font-medium text-gray-700">
//               Project Name
//             </label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleInputChange}
//               placeholder="New Project Name"
//               required
//               className="mt-1 block w-full rounded-lg px-4 py-3 border border-gray-300 shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>

//           <div className="flex-grow mt-4 sm:mt-0">
//             <label className="block text-sm font-medium text-gray-700">
//               Project Photo URL
//             </label>
//             <input
//               type="text"
//               name="project_photo_url"
//               value={formData.project_photo_url}
//               onChange={handleInputChange}
//               placeholder="Add a URL for the project photo"
//               required
//               className="mt-1 block w-full rounded-lg px-4 py-3 border border-gray-300 shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>
//         </div>

//         {/* Dropdowns for Annotation Type, Sub Feature 1, and Sub Feature 2 */}
//         <div className="flex flex-col sm:flex-row sm:space-x-4 mb-4">
//           <div className="flex-grow">
//             <label className="block text-sm font-medium text-gray-700">
//               Annotation Type
//             </label>
//             <select
//               name="annotation_type"
//               value={formData.annotation_type}
//               onChange={handleInputChange}
//               required
//               className="mt-1 block w-full rounded-lg px-4 py-3 border border-gray-300 shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="">Select an annotation type</option>
//               {annotationFeatures.map((type) => (
//                 <option key={type.id} value={type.code_name}>
//                   {type.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="flex-grow">
//             <label className="block text-sm font-medium text-gray-700">
//               Sub Feature 1
//             </label>
//             <select
//               name="sub_feature_1_id"
//               value={formData.sub_feature_1_id}
//               onChange={handleInputChange}
//               required
//               className="mt-1 block w-full rounded-lg px-4 py-3 border border-gray-300 shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="">Select a sub feature 1</option>
//               {subAnnotationFeatures1ByFeature.map((subFeature) => (
//                 <option key={subFeature.id} value={subFeature.id}>
//                   {subFeature.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="flex-grow">
//             <label className="block text-sm font-medium text-gray-700">
//               Sub Feature 2
//             </label>
//             <select
//               name="sub_feature_2_id"
//               value={formData.sub_feature_2_id}
//               onChange={handleInputChange}
//               required
//               className="mt-1 block w-full rounded-lg px-4 py-3 border border-gray-300 shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="">Select a sub feature 2</option>
//               {subAnnotationFeatures2BySubFeature1.map((subFeature) => (
//                 <option key={subFeature.id} value={subFeature.id}>
//                   {subFeature.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Description Field */}
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">
//             Description
//           </label>
//           <textarea
//             name="description"
//             value={formData.description}
//             onChange={handleInputChange}
//             placeholder="Optional description of your project"
//             className="mt-1 block w-full rounded-lg px-4 py-3 border border-gray-300 shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             rows={6}
//           ></textarea>
//         </div>

//         {/* Submit Button */}
//         <div className="mt-4">
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-600 text-white py-3 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             {loading ? "Creating Project..." : "Create Project"}
//           </button>
//         </div>
//       </form>

//       {/* Alert */}
//       <AlertBase
//         show={alert.show}
//         type={alert.type}
//         message={alert.message}
//         onClose={() => setAlert((prev) => ({ ...prev, show: false }))}
//       />
//     </div>
//   );
// };

// export default ProjectName;

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState, AppDispatch } from "@/store/store";
// import {
//   createAnnotationProject,
//   fetchAnnotationFeatures,
//   fetchSubFeatures1ByFeature,
//   fetchSubFeatures2BySubFeature1,
// } from "@/features/annotations/project/projectAnnotationSlice";
// import { fetchUserInfo } from "@/features/user/userSlice";
// import AlertBase from "../base/AlertBase";

// const ProjectName: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();

//   // Fetching user ID from Redux
//   const { id: userId, status: userStatus } = useSelector(
//     (state: RootState) => state.user
//   );
//   const {
//     annotationFeatures = [],
//     subAnnotationFeatures1ByFeature = [],
//     subAnnotationFeatures2BySubFeature1 = [],
//   } = useSelector((state: RootState) => state.projectAnnotations);

//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     project_photo_url: "",
//     annotation_type: "",
//     sub_feature_1_id: "",
//     sub_feature_2_id: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [alert, setAlert] = useState<{
//     show: boolean;
//     type: "success" | "error" | "warning" | "info";
//     message: string;
//   }>({ show: false, type: "info", message: "" });

//   // Fetch dependencies on mount
//   useEffect(() => {
//     if (userStatus === "idle") {
//       dispatch(fetchUserInfo());
//     }
//     dispatch(fetchAnnotationFeatures());
//   }, [dispatch, userStatus]);

//   // Fetch Sub Features 1 when Annotation Type changes
//   useEffect(() => {
//     if (formData.annotation_type) {
//       const selectedFeature = annotationFeatures.find(
//         (type) => type.code_name === formData.annotation_type
//       );
//       if (selectedFeature) {
//         dispatch(fetchSubFeatures1ByFeature(selectedFeature.id));
//         setFormData((prev) => ({ ...prev, sub_feature_1_id: "", sub_feature_2_id: "" }));
//       }
//     }
//   }, [formData.annotation_type, annotationFeatures, dispatch]);

//   // Fetch Sub Features 2 when Sub Feature 1 changes
//   useEffect(() => {
//     if (formData.sub_feature_1_id) {
//       dispatch(
//         fetchSubFeatures2BySubFeature1(Number(formData.sub_feature_1_id))
//       );
//       setFormData((prev) => ({ ...prev, sub_feature_2_id: "" }));
//     }
//   }, [formData.sub_feature_1_id, dispatch]);

//   const handleInputChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!userId) {
//       setAlert({
//         show: true,
//         type: "error",
//         message: "User ID is not available. Please log in.",
//       });
//       return;
//     }

//     if (!formData.annotation_type || !formData.sub_feature_1_id || !formData.sub_feature_2_id) {
//       setAlert({
//         show: true,
//         type: "error",
//         message: "All fields are required. Please fill them out.",
//       });
//       return;
//     }

//     setLoading(true);

//     const payload = {
//       name: formData.name,
//       description: formData.description,
//       project_photo_url: formData.project_photo_url,
//       sub_feature_2_id: Number(formData.sub_feature_2_id),
//     };

//     try {
//       await dispatch(createAnnotationProject(payload)).unwrap();
//       setAlert({
//         show: true,
//         type: "success",
//         message: "Project created successfully!",
//       });
//       setFormData({
//         name: "",
//         description: "",
//         project_photo_url: "",
//         annotation_type: "",
//         sub_feature_1_id: "",
//         sub_feature_2_id: "",
//       });
//     } catch (error: any) {
//       setAlert({
//         show: true,
//         type: "error",
//         message: `Failed to create project: ${error.message}`,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="h-full p-6 flex flex-col justify-between">
//       {/* Form */}
//       <form className="flex-grow" onSubmit={handleSubmit}>
//         {/* Project Name and Photo URL */}
//         <div className="flex flex-col sm:flex-row sm:space-x-4 mb-4">
//           <div className="flex-grow">
//             <label className="block text-sm font-medium text-gray-700">
//               Project Name
//             </label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleInputChange}
//               placeholder="New Project Name"
//               required
//               className="mt-1 block w-full rounded-lg px-4 py-3 border border-gray-300 shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>

//           <div className="flex-grow mt-4 sm:mt-0">
//             <label className="block text-sm font-medium text-gray-700">
//               Project Photo URL
//             </label>
//             <input
//               type="text"
//               name="project_photo_url"
//               value={formData.project_photo_url}
//               onChange={handleInputChange}
//               placeholder="Add a URL for the project photo"
//               required
//               className="mt-1 block w-full rounded-lg px-4 py-3 border border-gray-300 shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>
//         </div>

//         {/* Dropdowns for Annotation Type, Sub Feature 1, and Sub Feature 2 */}
//         <div className="flex flex-col sm:flex-row sm:space-x-4 mb-4">
//           <div className="flex-grow">
//             <label className="block text-sm font-medium text-gray-700">
//               Annotation Type
//             </label>
//             <select
//               name="annotation_type"
//               value={formData.annotation_type}
//               onChange={handleInputChange}
//               required
//               className="mt-1 block w-full rounded-lg px-4 py-3 border border-gray-300 shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="">Select an annotation type</option>
//               {annotationFeatures.map((type) => (
//                 <option key={type.id} value={type.code_name}>
//                   {type.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="flex-grow">
//             <label className="block text-sm font-medium text-gray-700">
//               Sub Feature 1
//             </label>
//             <select
//               name="sub_feature_1_id"
//               value={formData.sub_feature_1_id}
//               onChange={handleInputChange}
//               required
//               className="mt-1 block w-full rounded-lg px-4 py-3 border border-gray-300 shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="">Select a sub feature 1</option>
//               {subAnnotationFeatures1ByFeature.map((subFeature) => (
//                 <option key={subFeature.id} value={subFeature.id}>
//                   {subFeature.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="flex-grow">
//             <label className="block text-sm font-medium text-gray-700">
//               Sub Feature 2
//             </label>
//             <select
//               name="sub_feature_2_id"
//               value={formData.sub_feature_2_id}
//               onChange={handleInputChange}
//               required
//               className="mt-1 block w-full rounded-lg px-4 py-3 border border-gray-300 shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="">Select a sub feature 2</option>
//               {subAnnotationFeatures2BySubFeature1.map((subFeature) => (
//                 <option key={subFeature.id} value={subFeature.id}>
//                   {subFeature.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Description Field */}
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">
//             Description
//           </label>
//           <textarea
//             name="description"
//             value={formData.description}
//             onChange={handleInputChange}
//             placeholder="Optional description of your project"
//             className="mt-1 block w-full rounded-lg px-4 py-3 border border-gray-300 shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             rows={6}
//           ></textarea>
//         </div>

//         {/* Submit Button */}
//         <div className="mt-4">
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-600 text-white py-3 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             {loading ? "Creating Project..." : "Create Project"}
//           </button>
//         </div>
//       </form>

//       {/* Alert */}
//       <AlertBase
//         show={alert.show}
//         type={alert.type}
//         message={alert.message}
//         onClose={() => setAlert((prev) => ({ ...prev, show: false }))}
//       />
//     </div>
//   );
// };

// export default ProjectName;

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState, AppDispatch } from "@/store/store";
// import {
//   createAnnotationProject,
//   fetchAnnotationFeatures,
//   fetchSubFeatures1ByFeature,
//   fetchSubFeatures2BySubFeature1,
// } from "@/features/annotations/project/projectAnnotationSlice";
// import { fetchUserInfo } from "@/features/user/userSlice";
// import AlertBase from "../base/AlertBase";

// const ProjectName: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();

//   // Fetching user ID from Redux
//   const { id: userId, status: userStatus } = useSelector(
//     (state: RootState) => state.user
//   );
//   const {
//     annotationFeatures = [], // Ensure default empty array
//     subAnnotationFeatures1ByFeature = [], // Ensure default empty array
//     subAnnotationFeatures2BySubFeature1 = [], // Ensure default empty array
//   } = useSelector((state: RootState) => state.projectAnnotations);

//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     project_photo_url: "",
//     annotation_type: "",
//     sub_feature_1_id: "",
//     sub_feature_2_id: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [alert, setAlert] = useState<{
//     show: boolean;
//     type: "success" | "error" | "warning" | "info";
//     message: string;
//   }>({ show: false, type: "info", message: "" });

//   // Fetch user info and annotation types on component mount
//   useEffect(() => {
//     if (userStatus === "idle") {
//       dispatch(fetchUserInfo());
//     }
//     dispatch(fetchAnnotationFeatures());
//   }, [dispatch, userStatus]);

//   // Fetch Sub Features 1 when Annotation Type is selected
//   useEffect(() => {
//     if (formData.annotation_type) {
//       const selectedFeature = annotationFeatures.find(
//         (type) => type.code_name === formData.annotation_type
//       );
//       if (selectedFeature) {
//         dispatch(fetchSubFeatures1ByFeature(selectedFeature.id));
//       }
//     }
//   }, [formData.annotation_type, annotationFeatures, dispatch]);

//   // Fetch Sub Features 2 when Sub Feature 1 is selected
//   useEffect(() => {
//     if (formData.sub_feature_1_id) {
//       dispatch(
//         fetchSubFeatures2BySubFeature1(Number(formData.sub_feature_1_id))
//       );
//     }
//   }, [formData.sub_feature_1_id, dispatch]);

//   const handleInputChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!userId) {
//       setAlert({
//         show: true,
//         type: "error",
//         message: "User ID is not available. Please log in.",
//       });
//       return;
//     }

//     setLoading(true);

//     const payload = {
//       ...formData,
//       menu_id: 14,
//       created_by: userId,
//     };

//     try {
//       await dispatch(createAnnotationProject(payload)).unwrap();
//       setAlert({
//         show: true,
//         type: "success",
//         message: "Project created successfully!",
//       });
//       setFormData({
//         name: "",
//         description: "",
//         project_photo_url: "",
//         annotation_type: "",
//         sub_feature_1_id: "",
//         sub_feature_2_id: "",
//       });
//     } catch (error: any) {
//       setAlert({
//         show: true,
//         type: "error",
//         message: `Failed to create project: ${error.message}`,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="h-full p-6 flex flex-col justify-between">
//       {/* Form */}
//       <form className="flex-grow" onSubmit={handleSubmit}>
//         {/* Project Name and Photo URL */}
//         <div className="flex flex-col sm:flex-row sm:space-x-4 mb-4">
//           <div className="flex-grow">
//             <label className="block text-sm font-medium text-gray-700">
//               Project Name
//             </label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleInputChange}
//               placeholder="New Project Name"
//               required
//               className="mt-1 block w-full rounded-lg px-4 py-3 border border-gray-300 shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>

//           <div className="flex-grow mt-4 sm:mt-0">
//             <label className="block text-sm font-medium text-gray-700">
//               Project Photo URL
//             </label>
//             <input
//               type="text"
//               name="project_photo_url"
//               value={formData.project_photo_url}
//               onChange={handleInputChange}
//               placeholder="Add a URL for the project photo"
//               required
//               className="mt-1 block w-full rounded-lg px-4 py-3 border border-gray-300 shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>
//         </div>

//         {/* Dropdowns for Annotation Type, Sub Feature 1, and Sub Feature 2 */}
//         <div className="flex flex-col sm:flex-row sm:space-x-4 mb-4">
//           <div className="flex-grow">
//             <label className="block text-sm font-medium text-gray-700">
//               Annotation Type
//             </label>
//             <select
//               name="annotation_type"
//               value={formData.annotation_type}
//               onChange={handleInputChange}
//               required
//               className="mt-1 block w-full rounded-lg px-4 py-3 border border-gray-300 shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="">Select an annotation type</option>
//               {annotationFeatures.map((type) => (
//                 <option key={type.id} value={type.code_name}>
//                   {type.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="flex-grow">
//             <label className="block text-sm font-medium text-gray-700">
//               Sub Feature 1
//             </label>
//             <select
//               name="sub_feature_1_id"
//               value={formData.sub_feature_1_id}
//               onChange={handleInputChange}
//               required
//               className="mt-1 block w-full rounded-lg px-4 py-3 border border-gray-300 shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="">Select a sub feature 1</option>
//               {subAnnotationFeatures1ByFeature.map((subFeature) => (
//                 <option key={subFeature.id} value={subFeature.id}>
//                   {subFeature.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="flex-grow">
//             <label className="block text-sm font-medium text-gray-700">
//               Sub Feature 2
//             </label>
//             <select
//               name="sub_feature_2_id"
//               value={formData.sub_feature_2_id}
//               onChange={handleInputChange}
//               required
//               className="mt-1 block w-full rounded-lg px-4 py-3 border border-gray-300 shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="">Select a sub feature 2</option>
//               {subAnnotationFeatures2BySubFeature1.map((subFeature) => (
//                 <option key={subFeature.id} value={subFeature.id}>
//                   {subFeature.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Description Field */}
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">
//             Description
//           </label>
//           <textarea
//             name="description"
//             value={formData.description}
//             onChange={handleInputChange}
//             placeholder="Optional description of your project"
//             className="mt-1 block w-full rounded-lg px-4 py-3 border border-gray-300 shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             rows={6}
//           ></textarea>
//         </div>

//         {/* Submit Button */}
//         <div className="mt-4">
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-600 text-white py-3 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             {loading ? "Creating Project..." : "Create Project"}
//           </button>
//         </div>
//       </form>

//       {/* Alert */}
//       <AlertBase
//         show={alert.show}
//         type={alert.type}
//         message={alert.message}
//         onClose={() => setAlert((prev) => ({ ...prev, show: false }))}
//       />
//     </div>
//   );
// };

// export default ProjectName;
