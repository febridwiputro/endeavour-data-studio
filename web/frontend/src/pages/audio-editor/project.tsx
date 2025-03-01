import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  FaPlay,
  FaPause,
  FaUndo,
  FaRedo,
  FaExpand,
  FaTrash,
  FaDownload,
  FaMusic,
  FaFont,
  FaImages,
  FaFilm,
  FaCogs,
  FaCut,
  FaPlus,
} from "react-icons/fa";

const ProjectPage = () => {
  const router = useRouter();
  const { name } = router.query;
  const [isPlaying, setIsPlaying] = useState(false);
  const [projectName, setProjectName] = useState(name || "Untitled Project");
  const [isRenaming, setIsRenaming] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      {/* 🔹 Top Navigation Bar */}
      <header className="flex justify-between items-center px-6 py-3 bg-gray-800">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/audio-editor")}
            className="text-sm text-gray-400 hover:text-white transition"
          >
            ← All Projects
          </button>
          <button className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600 transition">
            Import or Record
          </button>
        </div>

        {/* Editable Project Name */}
        {isRenaming ? (
          <input
            className="bg-gray-700 text-white px-2 py-1 rounded focus:outline-none"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            onBlur={() => setIsRenaming(false)}
            autoFocus
          />
        ) : (
          <h1
            className="text-lg font-bold cursor-pointer"
            onClick={() => setIsRenaming(true)}
          >
            {projectName} (click to rename)
          </h1>
        )}

        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-white transition">
            Options
          </button>
          <button className="text-gray-400 hover:text-white transition">
            History
          </button>
          <button className="bg-blue-500 px-4 py-1 rounded hover:bg-blue-600 transition">
            Export
          </button>
        </div>
      </header>

      {/* 🔹 Main Content */}
      <div className="flex flex-1">
        {/* 📌 Sidebar Menu */}
        <aside className="w-20 bg-gray-800 p-4 border-r border-gray-700 flex flex-col items-center space-y-6">
          {[
            { icon: <FaMusic />, label: "Audio" },
            { icon: <FaFilm />, label: "Motion" },
            { icon: <FaFont />, label: "Text" },
            { icon: <FaImages />, label: "Subtitles" },
            { icon: <FaImages />, label: "Shapes" },
            { icon: <FaFilm />, label: "Transitions" },
            { icon: <FaPlus />, label: "AI Tools", highlight: true },
          ].map((item, index) => (
            <button
              key={index}
              className={`flex flex-col items-center transition ${
                item.highlight
                  ? "text-pink-500 hover:text-pink-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <div className="text-2xl">{item.icon}</div>
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          ))}
        </aside>

        {/* 📌 Editor Area */}
        <main className="flex-1 flex flex-col">
          {/* 🎥 Video Preview Section */}
          <div className="flex-1 bg-black flex justify-center items-center">
            <h2 className="text-gray-500">Video Preview</h2>
          </div>

          {/* 🎮 Video Controls */}
          <div className="flex justify-center items-center gap-6 py-4 bg-gray-800 border-t border-gray-700">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 bg-gray-700 rounded hover:bg-gray-600 transition"
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            <button className="p-2 bg-gray-700 rounded hover:bg-gray-600 transition">
              <FaUndo />
            </button>
            <button className="p-2 bg-gray-700 rounded hover:bg-gray-600 transition">
              <FaRedo />
            </button>
            <button className="p-2 bg-gray-700 rounded hover:bg-gray-600 transition">
              <FaExpand />
            </button>
            <button className="p-2 bg-gray-700 rounded hover:bg-gray-600 transition text-red-500">
              <FaTrash />
            </button>
            <button className="p-2 bg-gray-700 rounded hover:bg-gray-600 transition">
              <FaCut />
            </button>
            <button className="p-2 bg-gray-700 rounded hover:bg-gray-600 transition text-green-500">
              <FaDownload />
            </button>
          </div>

          {/* 🎬 Timeline Section */}
          <div className="h-24 bg-gray-800 border-t border-gray-700 flex items-center px-6">
            <div className="flex-1 bg-gray-900 rounded h-12 flex items-center">
              <div className="w-1/12 text-center text-xs text-gray-400">
                00:00
              </div>
              <div className="w-11/12 border-l border-gray-600 h-4 mx-2"></div>
              <div className="w-1/12 text-center text-xs text-gray-400">
                00:10
              </div>
            </div>
          </div>
        </main>

        {/* ⚙️ Settings Panel */}
        <aside className="w-64 bg-gray-800 p-4 border-l border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Settings</h3>
          <div className="mb-4">
            <label className="text-sm text-gray-400">Resolution</label>
            <div className="border border-gray-700 p-2 rounded bg-gray-700">
              1920x1080 (16:9 Standard)
            </div>
          </div>
          <div className="mb-4">
            <label className="text-sm text-gray-400">Background Color</label>
            <div className="w-10 h-6 rounded bg-black border border-gray-600"></div>
          </div>
          <div className="mb-4">
            <label className="text-sm text-gray-400">Show Safe Zones</label>
            <div className="flex gap-2">
              {["None", "All", "Title Area", "Action Area"].map((zone) => (
                <button
                  key={zone}
                  className="px-3 py-1 bg-gray-700 rounded text-xs hover:bg-gray-600 transition"
                >
                  {zone}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ProjectPage;


// https://clideo.com/editor/cut-video
// https://www.kapwing.com/studio/editor/sidebar-audio/all
// https://editor.flixier.com/projects/437cdcc8-35e0-c7f9-9b7f-8180826a47dd
// https://audiomass.co
// https://editor.audio
// https://www.veed.io/edit/f82706ff-49b4-463c-a726-57fc99e56c53/media
// https://freshspectrum.com/wp-content/uploads/2018/08/Exploring-alternative-views-in-Tableau-1024x601.png
// https://jason-khu.com/wp-content/uploads/2022/10/1-1024x640.png
// https://learn.microsoft.com/en-us/power-bi/fundamentals/media/desktop-what-is-desktop/what-is-desktop-01.png
// https://app.datawrapper.de/edit/fFLY9/publish
// https://app.flourish.studio/templates?purpose=all&type=all
// https://app.rawgraphs.io
// https://www.datawrapper.de
// https://github.com/microsoft/data-formulator?tab=readme-ov-file
