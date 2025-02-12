import React, { useState, useEffect } from "react";
import {
  ClockIcon,
  ArrowPathIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { api } from "@/services/apiConfig";

interface DVCCommit {
  commit_id: string;
  author: string;
  date: string;
  message: string;
}

interface DVCTrackedItem {
  name: string;
  type: "dataset" | "model";
  latest_version: string;
  last_modified: string;
}

const DataVersionControlPage: React.FC = () => {
  const [trackedItems, setTrackedItems] = useState<DVCTrackedItem[]>([]);
  const [commitHistory, setCommitHistory] = useState<DVCCommit[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Fetch daftar dataset dan model yang ditrack oleh DVC
  const fetchTrackedItems = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get("/dvc/tracked-items"); // API endpoint DVC
      setTrackedItems(response.data.data || []);
    } catch (err) {
      console.error("Error fetching DVC tracked items:", err);
      setError("Failed to fetch DVC tracked items.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch commit history dari DVC
  const fetchCommitHistory = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get("/dvc/commit-history"); // API endpoint DVC
      setCommitHistory(response.data.data || []);
    } catch (err) {
      console.error("Error fetching DVC commit history:", err);
      setError("Failed to fetch commit history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrackedItems();
    fetchCommitHistory();
  }, []);

  return (
    <div className="p-6 bg-gray-100 max-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Data Version Control (DVC)
        </h1>
      </div>

      {/* 🔹 Daftar Dataset & Model yang Ditrack */}
      <div className="bg-white shadow-md p-4 rounded-lg mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">Tracked Items</h2>
          <button
            onClick={fetchTrackedItems}
            className="flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-md"
          >
            <ArrowPathIcon className="h-5 w-5 mr-2" /> Refresh
          </button>
        </div>

        {loading ? (
          <p className="text-gray-700">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <table className="max-w-full divide-y divide-gray-300 bg-white rounded-lg shadow-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Latest Version
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Last Modified
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {trackedItems.map((item, index) => (
                <tr
                  key={index}
                  className={`hover:bg-gray-50 transition ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{item.type}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {item.latest_version}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(item.last_modified).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 🔹 Commit History */}
      <div className="bg-white shadow-md p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">Commit History</h2>
          <button
            onClick={fetchCommitHistory}
            className="flex items-center px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all shadow-md"
          >
            <ClockIcon className="h-5 w-5 mr-2" /> Refresh History
          </button>
        </div>

        {loading ? (
          <p className="text-gray-700">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <table className="max-w-full divide-y divide-gray-300 bg-white rounded-lg shadow-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Commit ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Message
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {commitHistory.map((commit, index) => (
                <tr
                  key={commit.commit_id}
                  className={`hover:bg-gray-50 transition ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-6 py-4 text-blue-600 hover:underline">
                    <a
                      href={`https://dvc.org/doc/start`} // Bisa diganti dengan commit detail page
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {commit.commit_id}
                    </a>
                  </td>
                  <td className="px-6 py-4">{commit.author}</td>
                  <td className="px-6 py-4">{new Date(commit.date).toLocaleString()}</td>
                  <td className="px-6 py-4">{commit.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DataVersionControlPage;
