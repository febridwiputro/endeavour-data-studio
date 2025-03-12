import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { ClockIcon, TrashIcon } from "@heroicons/react/24/outline";
import NoDataImage from "@/assets/http-response/storyset_no_data_5928293_2953960.svg";

const HistoryPage = () => {
  const router = useRouter();
  const [history, setHistory] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating fetch from local storage or API
    const storedHistory = JSON.parse(localStorage.getItem("userHistory") || "[]");
    setHistory(storedHistory);
    setLoading(false);
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("userHistory");
    setHistory([]);
  };

  const filteredHistory = history.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout
      menuData={[]} // Assume menu data is provided
      onMenuClick={(menuName) => router.push(`/${menuName.toLowerCase().replace(/ /g, "-")}`)}
      selectedMenu="History"
      breadcrumbItems={[{ label: "Home", href: "/" }, { label: "History", href: "/history", isActive: true }]}
    >
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-gray-800">History</h1>
          <button
            onClick={clearHistory}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center"
          >
            <TrashIcon className="w-5 h-5 mr-2" /> Clear All
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading history...</p>
        ) : filteredHistory.length > 0 ? (
          <div className="bg-white shadow-md rounded-lg p-4">
            {filteredHistory.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 border-b last:border-none hover:bg-gray-100 rounded-lg"
              >
                <div>
                  <p className="text-gray-800 font-medium">{item.title}</p>
                  <p className="text-sm text-gray-500">{item.timestamp}</p>
                </div>
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => router.push(item.url)}
                >
                  View
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center mt-10">
            <img src={NoDataImage.src} alt="No data available" className="w-80 h-80" />
            <p className="text-center text-gray-500 mt-4 text-lg">No history found.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default HistoryPage;