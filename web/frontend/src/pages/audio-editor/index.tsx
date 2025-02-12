import React, { useState } from "react";
import {
  FaMusic,
  FaMicrophone,
  FaWaveSquare,
  FaTools,
  FaFileAudio,
  FaRobot,
  FaFileExport,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";

const AudioEditorPage = () => {
  // Define the type of keys for `subFeatures`
  type FeatureKeys =
    | "Basic Audio Editing"
    | "Audio Effects & Filters"
    | "Audio Conversion"
    | "Advanced Audio Editing"
    | "Audio Augmentation"
    | "Audio Clustering and Similarity"
    | "Audio Metadata and Analysis"
    | "AI-powered Audio Features"
    | "Audio Export & Format Features";

  const [selectedFeature, setSelectedFeature] =
    useState<FeatureKeys>("Basic Audio Editing");
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarMinimized(!isSidebarMinimized);
  };

  const features = [
    { name: "Basic Audio Editing", icon: FaMusic },
    { name: "Audio Effects & Filters", icon: FaWaveSquare },
    { name: "Audio Conversion", icon: FaFileAudio },
    { name: "Advanced Audio Editing", icon: FaTools },
    { name: "Audio Augmentation", icon: FaMicrophone },
    { name: "Audio Clustering and Similarity", icon: FaWaveSquare },
    { name: "Audio Metadata and Analysis", icon: FaFileAudio },
    { name: "AI-powered Audio Features", icon: FaRobot },
    { name: "Audio Export & Format Features", icon: FaFileExport },
  ];

  const subFeatures: Record<FeatureKeys, string[]> = {
    "Basic Audio Editing": [
      "Clip Audio",
      "Add Audio Overlay",
      "Add Text-to-Speech to Audio",
      "Remove Background Noise",
      "Change Audio Speed",
      "Adjust Volume",
      "Fade In/Fade Out",
      "Compress Audio",
      "Remove Silence",
      "Reverse Audio",
      "Equalizer",
    ],
    "Audio Effects & Filters": [
      "Echo Effect",
      "Reverb",
      "Pitch Shifting",
      "Distortion",
      "Low-pass/High-pass Filter",
      "Phaser/Flanger",
      "Chorus Effect",
      "Time Stretching",
      "Bass Boost",
      "Noise Gate",
    ],
    "Audio Conversion": [
      "Audio to Text Transcription",
      "Convert Audio Format",
      "Extract Audio from Video",
      "Batch Audio Conversion",
      "Audio to MIDI Conversion",
      "Text-to-Speech",
    ],
    "Advanced Audio Editing": [
      "Vocal Isolation/Removal",
      "Audio Restoration",
      "Audio Upscaling",
      "Dynamic Range Compression",
      "De-Essing",
      "Stereo to Mono Conversion",
      "Time Correction",
      "Drum Replacement",
      "Spectral Editing",
      "Pitch Correction (Auto-Tune)",
    ],
    "Audio Augmentation": [
      "Pitch Bending",
      "Speed Variation",
      "Noise Injection",
      "Looping",
      "Split Channels",
      "Sound Panning",
    ],
    "Audio Clustering and Similarity": [
      "Audio Clustering",
      "Similarity Analysis",
      "Content-Based Audio Retrieval",
      "Tag-Based Audio Organization",
    ],
    "Audio Metadata and Analysis": [
      "Audio Metadata Extraction",
      "Spectrogram Analysis",
      "Waveform Visualization",
      "Loudness Analysis",
      "Key and Tempo Detection",
      "Audio Fingerprinting",
    ],
    "AI-powered Audio Features": [
      "Automatic Speech Recognition (ASR)",
      "Voice Cloning",
      "Emotion Recognition in Audio",
      "AI-based Audio Denoising",
      "AI-based Music Generation",
      "Speaker Diarization",
      "Audio Scene Classification",
      "Sound Source Separation",
    ],
    "Audio Export & Format Features": [
      "Batch Audio Export",
      "Export for Podcasting",
      "Audio Compression for Web",
      "Audio Watermarking",
      "Export with Metadata",
      "Custom Bitrate and Sample Rate Export",
    ],
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
            <h1 className="text-lg font-semibold text-blue-600">Audio Editor</h1>
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
                onClick={() =>
                  setSelectedFeature(feature.name as FeatureKeys)
                }
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
          AudioEditor © 2025
        </footer>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">{selectedFeature}</h1>
        <h2 className="text-lg font-semibold mb-4">Sub-Features:</h2>
        <ul className="list-disc list-inside space-y-2">
          {subFeatures[selectedFeature]?.map((subFeature) => (
            <li key={subFeature} className="text-gray-700">
              {subFeature}
            </li>
          ))}
        </ul>
        <button className="mt-6 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
          Learn More
        </button>
      </main>
    </div>
  );
};

export default AudioEditorPage;
