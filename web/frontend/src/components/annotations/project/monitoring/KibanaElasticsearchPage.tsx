import React, { useState, useEffect } from "react";
import { MagnifyingGlassIcon, ArrowPathIcon, EyeIcon } from "@heroicons/react/24/outline";
import { api } from "@/services/apiConfig";

const KIBANA_URL = "http://localhost:5601"; // Ubah dengan URL Kibana jika berbeda
const ELASTICSEARCH_INDEX = "logs-*"; // Ubah dengan index Elasticsearch yang digunakan

interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
}

const KibanaElasticsearchPage: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Fetch data log dari Elasticsearch
  const fetchLogs = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/elasticsearch/search", {
        index: ELASTICSEARCH_INDEX,
        query: query || "*",
        size: 50, // Ambil 50 log terbaru
      });

      setLogs(response.data.hits || []);
    } catch (err) {
      console.error("Error fetching logs:", err);
      setError("Failed to fetch logs from Elasticsearch.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Kibana + Elasticsearch Monitoring
        </h1>
        <a
          href={KIBANA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-blue-600 hover:text-blue-800 font-semibold"
        >
          Open Kibana Dashboard <EyeIcon className="h-5 w-5 ml-1" />
        </a>
      </div>

      {/* 🔹 Form Pencarian Log */}
      <div className="bg-white shadow-md p-4 rounded-lg mb-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchLogs();
          }}
          className="flex items-center space-x-4"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search logs (e.g., error, warning, request)"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="submit"
            className="flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-md"
          >
            <MagnifyingGlassIcon className="h-5 w-5 mr-2" /> Search
          </button>
        </form>
      </div>

      {/* 🔹 Tombol Refresh */}
      <button
        onClick={fetchLogs}
        className="mb-4 flex items-center px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all shadow-md"
        disabled={loading}
      >
        <ArrowPathIcon className={`h-5 w-5 mr-2 ${loading ? "animate-spin" : ""}`} />
        Refresh Logs
      </button>

      {loading && <p className="text-gray-700">Loading logs...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && logs.length === 0 && (
        <p className="text-gray-500">No logs found.</p>
      )}

      {/* 🔹 Tabel Log */}
      <div className="overflow-hidden rounded-lg shadow-lg">
        <table className="min-w-full divide-y divide-gray-300 bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Timestamp
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Message
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {logs.map((log, index) => (
              <tr
                key={index}
                className={`hover:bg-gray-50 transition ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="px-6 py-4 text-gray-700">{log.timestamp}</td>
                <td className="px-6 py-4 font-semibold text-gray-800">
                  <span
                    className={`px-2 py-1 text-xs rounded-md ${
                      log.level === "error"
                        ? "bg-red-600 text-white"
                        : log.level === "warning"
                        ? "bg-yellow-500 text-white"
                        : "bg-green-600 text-white"
                    }`}
                  >
                    {log.level}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-700">{log.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KibanaElasticsearchPage;
