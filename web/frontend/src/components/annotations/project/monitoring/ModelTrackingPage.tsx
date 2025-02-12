import React, { useState, useEffect } from "react";
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  ArrowTopRightOnSquareIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { api } from "@/services/apiConfig";
import DeleteModal from "@/components/base/DeleteModal";
import AlertBase from "@/components/base/AlertBase";

const MLFLOW_UI_BASE = "http://127.0.0.1:8885";

interface MLflowExperiment {
  experiment_id: string;
  name: string;
}

interface MLflowRun {
  run_id: string;
  experiment_id: string;
  name: string;
  status: string;
  start_time: number;
  end_time?: number;
}

const ModelTrackingPage: React.FC = () => {
  const [experiments, setExperiments] = useState<MLflowExperiment[]>([]);
  const [selectedExperiment, setSelectedExperiment] = useState<string | null>(
    null
  );
  const [runs, setRuns] = useState<MLflowRun[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Modal & Alert States
  const [selectedRun, setSelectedRun] = useState<MLflowRun | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isAlertVisible, setIsAlertVisible] = useState<boolean>(false);
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [alertMessage, setAlertMessage] = useState("");

  const fetchExperiments = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get("/mlflow/experiments");
      const fetchedExperiments = response.data.data || [];

      if (fetchedExperiments.length === 0) {
        setError("No experiments found in MLflow.");
        return;
      }

      setExperiments(fetchedExperiments);
      setSelectedExperiment(fetchedExperiments[0].experiment_id);
    } catch (err) {
      console.error("Error fetching MLflow experiments:", err);
      setError("Failed to fetch MLflow experiments.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRuns = async (experimentId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/mlflow/runs/${experimentId}`);
      const fetchedRuns = response.data.data || [];

      setRuns(
        fetchedRuns.map((run: any) => ({
          run_id: run.info.run_id,
          experiment_id: run.info.experiment_id,
          name:
            run.data?.tags?.find((tag: any) => tag.key === "mlflow.runName")
              ?.value || "Unnamed Run",
          status: run.info.status,
          start_time: run.info.start_time,
          end_time: run.info.end_time || null,
        }))
      );
    } catch (err) {
      console.error("Error fetching MLflow runs:", err);
      setError("Failed to fetch MLflow runs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiments();
  }, []);

  useEffect(() => {
    if (selectedExperiment) {
      fetchRuns(selectedExperiment);
    }
  }, [selectedExperiment]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "FINISHED":
        return (
          <span className="px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-md flex items-center">
            <CheckCircleIcon className="h-4 w-4 mr-1" /> Succeeded
          </span>
        );
      case "RUNNING":
        return (
          <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-md flex items-center">
            <ClockIcon className="h-4 w-4 mr-1 animate-spin" /> Running
          </span>
        );
      case "FAILED":
        return (
          <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-md flex items-center">
            <XCircleIcon className="h-4 w-4 mr-1" /> Failed
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-gray-500 text-white text-xs font-semibold rounded-md">
            Unknown
          </span>
        );
    }
  };

  // 🔹 Delete Model Run
  const handleDelete = () => {
    if (!selectedRun) return;

    setRuns((prevRuns) =>
      prevRuns.filter((run) => run.run_id !== selectedRun.run_id)
    );
    setIsDeleteModalOpen(false);
    showAlert("success", "Run deleted successfully.");
  };

  // 🔹 Alert Handler
  const showAlert = (type: "success" | "error", message: string) => {
    setAlertType(type);
    setAlertMessage(message);
    setIsAlertVisible(true);
  };

  return (
    <div className="p-6 bg-gray-100 max-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2
        xl font-bold text-gray-800">Model Tracking</h1>
        <a
          href={`${MLFLOW_UI_BASE}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-blue-600 hover:text-blue-800 font-semibold"
        >
          Open MLflow UI <ArrowTopRightOnSquareIcon className="h-5 w-5 ml-1" />
        </a>
      </div>

      {/* Dropdown Eksperimen */}
      <div className="bg-white shadow-md p-4 rounded-lg mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Select Experiment:
        </label>
        <select
          className="mt-2 block w-full border border-gray-300 p-2 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          value={selectedExperiment || ""}
          onChange={(e) => setSelectedExperiment(e.target.value)}
        >
          {experiments.map((exp) => (
            <option key={exp.experiment_id} value={exp.experiment_id}>
              {exp.name} (ID: {exp.experiment_id})
            </option>
          ))}
        </select>
      </div>

      {/* Tombol Refresh */}
      <button
        onClick={() => selectedExperiment && fetchRuns(selectedExperiment)}
        className="mb-4 flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-md"
        disabled={!selectedExperiment || loading}
      >
        <ArrowPathIcon
          className={`h-5 w-5 mr-2 ${loading ? "animate-spin" : ""}`}
        />
        Refresh Runs
      </button>

      {loading && <p className="text-gray-700">Loading models...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && runs.length === 0 && (
        <p className="text-gray-500">No models found.</p>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-lg shadow-lg">
        <table className="max-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Run ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Experiment ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Model Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Start Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                End Time
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {runs.map((run) => (
              <tr key={run.run_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-blue-600 hover:underline">
                  <a
                    href={`${MLFLOW_UI_BASE}/#/experiments/${run.experiment_id}/runs/${run.run_id}`}
                    target="_blank"
                  >
                    {run.run_id}
                  </a>
                </td>
                <td className="px-6 py-4">{run.experiment_id}</td>
                <td className="px-6 py-4 font-semibold">{run.name}</td>
                <td className="px-6 py-4">{getStatusBadge(run.status)}</td>
                <td className="px-6 py-4">
                  {new Date(run.start_time).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  {run.end_time ? new Date(run.end_time).toLocaleString() : "-"}
                </td>
                <td className="px-6 py-4 text-right space-x-4">
                  <button className="text-green-600 hover:text-green-800">
                    <EyeIcon className="w-5 h-5 inline" />
                  </button>
                  <button className="text-blue-600 hover:text-blue-800">
                    <PencilIcon className="w-5 h-5 inline" />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => {
                      setSelectedRun(run);
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    <TrashIcon className="w-5 h-5 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Delete Confirmation Modal */}
      <DeleteModal
        show={isDeleteModalOpen}
        title="Delete Run"
        message="Are you sure you want to delete this run?"
        onConfirm={handleDelete}
        onClose={() => setIsDeleteModalOpen(false)}
      />

      {/* Alert Notification */}
      <AlertBase
        show={isAlertVisible}
        type={alertType}
        message={alertMessage}
        duration={3000}
        onClose={() => setIsAlertVisible(false)}
      />
    </div>
  );
};

export default ModelTrackingPage;
