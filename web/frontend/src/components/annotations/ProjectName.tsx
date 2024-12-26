import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import {
  createAnnotationProject,
  fetchAnnotationTypes,
} from "@/features/annotations/project/projectAnnotationSlice";
import { fetchUserInfo } from "@/features/user/userSlice"; // Import user fetching action
import AlertBase from "../base/AlertBase";

const ProjectName: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Fetching user ID from Redux
  const { id: userId, status: userStatus } = useSelector(
    (state: RootState) => state.user
  );
  const { annotationTypes } = useSelector(
    (state: RootState) => state.projectAnnotations
  );

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    project_photo_url: "",
    annotation_type: "",
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    show: boolean;
    type: "success" | "error" | "warning" | "info";
    message: string;
  }>({ show: false, type: "info", message: "" });

  // Fetch user info and annotation types on component mount
  useEffect(() => {
    if (userStatus === "idle") {
      dispatch(fetchUserInfo());
    }
    dispatch(fetchAnnotationTypes());
  }, [dispatch, userStatus]);

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

    if (!userId) {
      setAlert({
        show: true,
        type: "error",
        message: "User ID is not available. Please log in.",
      });
      return;
    }

    setLoading(true);

    const payload = {
      ...formData,
      menu_id: 1,
      created_by: userId,
    };

    try {
      await dispatch(createAnnotationProject(payload)).unwrap();
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
      });
    } catch (error: any) {
      setAlert({
        show: true,
        type: "error",
        message: `Failed to create project: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full p-6 flex flex-col justify-between">
      {/* Form */}
      <form className="flex-grow" onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row sm:space-x-4 mb-4">
          {/* Project Name Field */}
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

          {/* Project Photo URL Field */}
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

        {/* Dropdown for Annotation Type */}
        <div className="mb-4">
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
            {annotationTypes.map((type) => (
              <option key={type.id} value={type.code_name}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        {/* Description Field */}
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

        {/* Tip Section */}
        <div className="mt-4 p-4 bg-gray-50 border rounded-lg flex items-center space-x-4">
          <img
            src="https://via.placeholder.com/50"
            alt="Tip"
            className="w-12 h-12"
          />
          <div>
            <p className="text-sm font-medium">
              Did you know? You can use or modify dozens of templates to
              configure your project easily.{" "}
              <a href="#" className="text-blue-500 hover:underline">
                Learn more
              </a>
            </p>
          </div>
        </div>

        {/* Submit Button */}
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

      {/* Alert */}
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