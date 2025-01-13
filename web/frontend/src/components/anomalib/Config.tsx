import React, { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

// Enums for Config Options
enum TestSplitMode {
  FromDir = "from_dir",
  Synthetic = "synthetic",
}

enum ValSplitMode {
  SameAsTest = "same_as_test",
  FromTest = "from_test",
}

enum Normalization {
  None = "none",
  Imagenet = "imagenet",
}

enum NormalizationMethod {
  None = "none",
  MinMax = "min_max",
  CDF = "cdf",
}

enum TrainerDevice {
  CPU = "cpu",
  GPU = "gpu",
  TPU = "tpu",
  IPU = "ipu",
  HPU = "hpu",
  Auto = "auto",
}

// Interface for Configuration
interface Config {
  dataset: {
    name: string;
    format: string;
    path: string;
    task: string;
    category: string;
    train_batch_size: number;
    eval_batch_size: number;
    num_workers: number;
    image_size: number;
    center_crop?: number;
    normalization: Normalization;
    test_split_mode: TestSplitMode;
    test_split_ratio: number;
    val_split_mode: ValSplitMode;
    val_split_ratio: number;
  };
  model: {
    name: string;
    backbone: string;
    pre_trained: boolean;
    coreset_sampling_ratio: number;
    num_neighbors: number;
    normalization_method: NormalizationMethod;
  };
  trainer: {
    enable_checkpointing: boolean;
    max_epochs: number;
    devices: TrainerDevice;
  };
}

const ConfigEditor: React.FC = () => {
  const [config, setConfig] = useState<Config>({
    dataset: {
      name: "mvtec",
      format: "mvtec",
      path: "./datasets/MVTec",
      task: "segmentation",
      category: "bottle",
      train_batch_size: 32,
      eval_batch_size: 32,
      num_workers: 8,
      image_size: 256,
      center_crop: 224,
      normalization: Normalization.Imagenet,
      test_split_mode: TestSplitMode.FromDir,
      test_split_ratio: 0.2,
      val_split_mode: ValSplitMode.SameAsTest,
      val_split_ratio: 0.5,
    },
    model: {
      name: "patchcore",
      backbone: "wide_resnet50_2",
      pre_trained: true,
      coreset_sampling_ratio: 0.1,
      num_neighbors: 9,
      normalization_method: NormalizationMethod.MinMax,
    },
    trainer: {
      enable_checkpointing: true,
      max_epochs: 1,
      devices: TrainerDevice.Auto,
    },
  });

  // Update Config
  const handleInputChange = <
    Section extends keyof Config,
    Key extends keyof Config[Section]
  >(
    section: Section,
    key: Key,
    value: any
  ) => {
    setConfig((prevConfig) => ({
      ...prevConfig,
      [section]: {
        ...prevConfig[section],
        [key]: value,
      },
    }));
  };

  const renderInput = (
    section: keyof Config,
    key: keyof Config[typeof section],
    value: any
  ) => {
    if (Object.values(TestSplitMode).includes(value)) {
      return (
        <select
          value={value}
          onChange={(e) =>
            handleInputChange(section, key, e.target.value as TestSplitMode)
          }
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          {Object.values(TestSplitMode).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    if (Object.values(ValSplitMode).includes(value)) {
      return (
        <select
          value={value}
          onChange={(e) =>
            handleInputChange(section, key, e.target.value as ValSplitMode)
          }
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          {Object.values(ValSplitMode).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    if (Object.values(Normalization).includes(value)) {
      return (
        <select
          value={value}
          onChange={(e) =>
            handleInputChange(section, key, e.target.value as Normalization)
          }
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          {Object.values(Normalization).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    if (Object.values(TrainerDevice).includes(value)) {
      return (
        <select
          value={value}
          onChange={(e) =>
            handleInputChange(section, key, e.target.value as TrainerDevice)
          }
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          {Object.values(TrainerDevice).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    if (typeof value === "boolean") {
      return (
        <input
          type="checkbox"
          checked={value}
          onChange={(e) =>
            handleInputChange(section, key, e.target.checked)
          }
          className="w-5 h-5"
        />
      );
    }

    if (typeof value === "number") {
      return (
        <input
          type="number"
          value={value}
          onChange={(e) =>
            handleInputChange(section, key, +e.target.value)
          }
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      );
    }

    return (
      <input
        type="text"
        value={value}
        onChange={(e) =>
          handleInputChange(section, key, e.target.value)
        }
        className="w-full border border-gray-300 rounded px-3 py-2"
      />
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded space-y-6">
      <h2 className="text-xl font-semibold">Configuration Editor</h2>

      {/* Dataset Section */}
      <div>
        <h3 className="text-lg font-bold mb-2">Dataset</h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(config.dataset).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium capitalize">
                {key.replace(/_/g, " ")}
              </label>
              {renderInput("dataset", key as keyof Config["dataset"], value)}
            </div>
          ))}
        </div>
      </div>

      {/* Model Section */}
      <div>
        <h3 className="text-lg font-bold mb-2">Model</h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(config.model).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium capitalize">
                {key.replace(/_/g, " ")}
              </label>
              {renderInput("model", key as keyof Config["model"], value)}
            </div>
          ))}
        </div>
      </div>

      {/* Trainer Section */}
      <div>
        <h3 className="text-lg font-bold mb-2">Trainer</h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(config.trainer).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium capitalize">
                {key.replace(/_/g, " ")}
              </label>
              {renderInput("trainer", key as keyof Config["trainer"], value)}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => console.log("Config:", config)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Save Configuration
      </button>
    </div>
  );
};

export default ConfigEditor;
