import React, { useState, useEffect } from "react";
import {
  ArrowPathIcon,
  EyeIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { api } from "@/services/apiConfig";

const GRAFANA_DASHBOARD_URL = "http://localhost:3000"; // Ubah dengan URL Grafana jika berbeda
const PROMETHEUS_API_URL = "http://localhost:9090/api/v1/query"; // API Prometheus untuk query metrik

interface MetricData {
  metric: Record<string, string>;
  value: [number, string];
}

const GrafanaPrometheusPage: React.FC = () => {
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Fetch metrik dari Prometheus
  const fetchMetrics = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(PROMETHEUS_API_URL, {
        params: { query: "up" }, // Contoh query, bisa disesuaikan
      });

      if (response.data && response.data.data) {
        setMetrics(response.data.data.result || []);
      } else {
        setError("No metrics found.");
      }
    } catch (err) {
      console.error("Error fetching metrics:", err);
      setError("Failed to fetch metrics from Prometheus.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return (
    <div className="p-6 bg-gray-100 max-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Grafana + Prometheus Monitoring
        </h1>
        <a
          href={GRAFANA_DASHBOARD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-blue-600 hover:text-blue-800 font-semibold"
        >
          Open Grafana Dashboard <EyeIcon className="h-5 w-5 ml-1" />
        </a>
      </div>

      {/* 🔹 Tombol Refresh */}
      <button
        onClick={fetchMetrics}
        className="mb-4 flex items-center px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all shadow-md"
        disabled={loading}
      >
        <ArrowPathIcon className={`h-5 w-5 mr-2 ${loading ? "animate-spin" : ""}`} />
        Refresh Metrics
      </button>

      {loading && <p className="text-gray-700">Loading metrics...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && metrics.length === 0 && (
        <p className="text-gray-500">No metrics found.</p>
      )}

      {/* 🔹 Tabel Metrics */}
      <div className="overflow-hidden rounded-lg shadow-lg">
        <table className="max-w-full divide-y divide-gray-300 bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Instance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Job
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Timestamp
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {metrics.map((metric, index) => (
              <tr
                key={index}
                className={`hover:bg-gray-50 transition ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="px-6 py-4 text-gray-700">
                  {metric.metric.instance || "N/A"}
                </td>
                <td className="px-6 py-4 font-semibold text-gray-800">
                  {metric.metric.job || "N/A"}
                </td>
                <td className="px-6 py-4 text-green-600 font-bold">
                  {metric.value[1]}
                </td>
                <td className="px-6 py-4 text-gray-700">
                  {new Date(metric.value[0] * 1000).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GrafanaPrometheusPage;
