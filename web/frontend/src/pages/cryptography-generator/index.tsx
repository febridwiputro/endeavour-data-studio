import React, { useState } from "react";
import {
  FaLock,
  FaKey,
  FaHistory,
  FaShieldAlt,
  FaCode,
  FaSearch,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";

const CryptographyGeneratorPage = () => {
  const features = [
    { name: "Highlights", icon: FaKey },
    { name: "Modern Encryption", icon: FaLock },
    { name: "Historical Encryption", icon: FaHistory },
    { name: "Checksums (Hashing)", icon: FaShieldAlt },
    { name: "Encoding/Decoding", icon: FaCode },
    { name: "Cryptanalysis", icon: FaSearch },
  ];

  const subFeatures: Record<
    | "Highlights"
    | "Modern Encryption"
    | "Historical Encryption"
    | "Checksums (Hashing)"
    | "Encoding/Decoding"
    | "Cryptanalysis",
    string[]
  > = {
    Highlights: ["OpenSSL", "CryptoBrief"],
    "Modern Encryption": [
      "RSA (Explained Step by Step)",
      "Private Polls (Demo)",
      "AES (Advanced Encryption Standard)",
      "ECC (Elliptic Curve Cryptography)",
      "ChaCha20",
    ],
    "Historical Encryption": [
      "Atbash",
      "Caesar / ROT13",
      "Monoalphabetic Substitution",
      "Railfence / Redefence",
      "Multiplicative",
      "Kamasutra",
      "Vigenère and Variants",
      "XOR",
      "Bit Shift",
    ],
    "Checksums (Hashing)": ["Certificate Verification", "SHA-256", "MD5"],
    "Encoding/Decoding": [
      "ASCII",
      "Bacon",
      "Base64",
      "URL Encoding",
      "Hexadecimal Encoding",
      "Binary Encoding",
      "ROT13",
      "Morse Code",
      "Custom Substitution Cipher",
    ],
    Cryptanalysis: [
      "Homophonic Substitution Analyzer",
      "Neural Cipher Identifier",
      "Frequency Analysis",
    ],
  };

  const [selectedFeature, setSelectedFeature] = useState<keyof typeof subFeatures>(
    "Highlights"
  );
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarMinimized(!isSidebarMinimized);
  };

  const getButtonClass = (featureName: string) =>
    `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all ${
      selectedFeature === featureName
        ? "bg-blue-100 text-blue-600 font-semibold shadow-lg"
        : "text-gray-700 hover:bg-gray-100 hover:shadow-md"
    }`;

  return (
    <div className="flex h-screen w-screen">
      {/* Sidebar */}
      <div
        className={`bg-white ${
          isSidebarMinimized ? "w-16" : "w-64"
        } flex flex-col border-r border-gray-200 shadow transition-all duration-300`}
      >
        {/* Header Section */}
        <div
          className={`flex items-center ${
            isSidebarMinimized ? "justify-center" : "justify-between"
          } p-4 bg-blue-100 border-b border-gray-200`}
        >
          {!isSidebarMinimized && (
            <h1 className="text-lg font-semibold text-blue-600">
              Cryptography Generator
            </h1>
          )}
          <button
            onClick={handleSidebarToggle}
            className="bg-white rounded-full p-2 text-blue-500 hover:text-blue-600 hover:bg-gray-100 transition-all"
            title={isSidebarMinimized ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isSidebarMinimized ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
        </div>

        {/* Menu Items */}
        <ul className="flex-1 space-y-2 mt-4 px-2">
          {features.map((feature) => (
            <li key={feature.name}>
              <button
                className={`${getButtonClass(feature.name)} ${
                  isSidebarMinimized
                    ? "justify-center flex-col h-10 w-10 mx-auto"
                    : "justify-start flex-row w-full"
                } flex items-center hover:shadow-lg`}
                onClick={() => setSelectedFeature(feature.name as keyof typeof subFeatures)}
                title={isSidebarMinimized ? feature.name : undefined}
              >
                <feature.icon
                  className={`${
                    isSidebarMinimized ? "w-5 h-5" : "w-6 h-6"
                  } text-blue-500`}
                />
                {!isSidebarMinimized && (
                  <span className="ml-3 text-sm">{feature.name}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
        <footer className="text-center p-4 text-gray-500 text-xs">
          Cryptography Generator © 2025
        </footer>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">{selectedFeature}</h1>
        <h2 className="text-lg font-semibold mb-4">Sub-Features:</h2>
        <ul className="list-disc list-inside space-y-2">
          {subFeatures[selectedFeature]?.map((subFeature, index) => (
            <li key={index} className="text-gray-700">
              {subFeature}
            </li>
          ))}
        </ul>
        <button className="mt-6 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
          Explore {selectedFeature}
        </button>
      </main>
    </div>
  );
};

export default CryptographyGeneratorPage;
