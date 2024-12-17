import React, { useState, useEffect, useRef } from "react";
import InputConfig from "./InputConfig";
import PredictionControls from "./PredictionControls";
import DeleteModal from "@/components/base/DeleteModal";
import AlertBase from "@/components/base/AlertBase";

const ExternalModel: React.FC = () => {
  const [modelName, setModelName] = useState<string>("");
  const [modelUrl, setModelUrl] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  const [isIntegrated, setIsIntegrated] = useState<boolean>(false);
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );

  const [inputType, setInputType] = useState<"file" | "url" | "paste">("file");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [pastedImage, setPastedImage] = useState<string>("");
  const [imageInput, setImageInput] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [predictionResults, setPredictionResults] = useState<any[]>([]);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isAlertVisible, setIsAlertVisible] = useState<boolean>(false);
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [alertMessage, setAlertMessage] = useState<string>("");

  const [isSuccessAlertVisible, setIsSuccessAlertVisible] = useState<boolean>(
    false
  );

  useEffect(() => {
    if (isIntegrated) {
      setIsEnabled(true);
    } else {
      setIsEnabled(false);
    }
  }, [isIntegrated]);

  const showAlert = (type: "success" | "error", message: string) => {
    setAlertType(type);
    setAlertMessage(message);
    setIsAlertVisible(true);
  };

  const handleTestConnection = async () => {
    setStatus("loading");
    setIsAlertVisible(false);

    try {
      const response = await fetch(modelUrl, {
        method: "GET",
        headers: { Authorization: `Bearer ${apiKey}` },
      });

      if (response.ok) {
        setStatus("success");
        showAlert("success", "API Connection successful!");
      } else {
        setStatus("error");
        showAlert("error", "Failed to connect. Please check the URL or API Key.");
      }
    } catch (error) {
      setStatus("error");
      showAlert("error", "An error occurred while connecting to the API.");
    }
  };

  const handleSaveIntegration = () => {
    if (status === "success") {
      setIsIntegrated(true);
      showAlert("success", "Integration saved successfully!");
    } else {
      showAlert("error", "Please ensure the API connection is successful.");
    }
  };

  const handleDeleteModel = () => {
    setIsModalOpen(true);
  };

  const confirmDeleteModel = () => {
    setIsIntegrated(false);
    setIsEnabled(false);
    setModelName("");
    setModelUrl("");
    setApiKey("");
    setPredictionResults([]);
    setImagePreview(null);
    setIsModalOpen(false);
    setIsSuccessAlertVisible(true);
  };

  const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageInput(file);
      setImagePreview(URL.createObjectURL(file));
      setPredictionResults([]);
    }
  };

  const handleImageUrlChange = () => {
    if (imageUrl) {
      setImagePreview(imageUrl);
      setPredictionResults([]);
    }
  };

  const handlePastedImageChange = () => {
    if (pastedImage) {
      setImagePreview(`data:image/jpeg;base64,${pastedImage}`);
      setPredictionResults([]);
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-semibold mb-4 text-gray-800">
        External Model Integration
      </h1>

      {!isIntegrated ? (
        <InputConfig
          modelName={modelName}
          modelUrl={modelUrl}
          apiKey={apiKey}
          status={status}
          onModelNameChange={(e) => setModelName(e.target.value)}
          onModelUrlChange={(e) => setModelUrl(e.target.value)}
          onApiKeyChange={(e) => setApiKey(e.target.value)}
          onTestConnection={handleTestConnection}
          onSaveIntegration={handleSaveIntegration}
        />
      ) : (
        <PredictionControls
          isEnabled={isEnabled}
          modelName={modelName}
          onToggleEnable={() => setIsEnabled((prev) => !prev)}
          onDeleteModel={handleDeleteModel}
          inputType={inputType}
          imageUrl={imageUrl}
          pastedImage={pastedImage}
          imagePreview={imagePreview}
          predictionResults={predictionResults}
          onInputTypeChange={(e) =>
            setInputType(e.target.value as "file" | "url" | "paste")
          }
          onImageInputChange={handleImageInputChange}
          onImageUrlChange={handleImageUrlChange}
          onPastedImageChange={handlePastedImageChange}
          onTestWithData={() => {}}
          setImageUrl={setImageUrl}
          setPastedImage={setPastedImage}
        />
      )}

      {/* Alert */}
      <AlertBase
        show={isAlertVisible}
        type={alertType}
        message={alertMessage}
        duration={3000}
        onClose={() => setIsAlertVisible(false)}
      />

      {/* Success Alert */}
      <AlertBase
        show={isSuccessAlertVisible}
        type="success"
        message="Model has been successfully deleted."
        duration={3000}
        onClose={() => setIsSuccessAlertVisible(false)}
      />

      {/* Delete Modal */}
      <DeleteModal
        show={isModalOpen}
        title="Delete Model"
        message="Are you sure you want to delete this model? This action cannot be undone."
        onConfirm={confirmDeleteModel}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ExternalModel;


// import React, { useState, useEffect, useRef } from "react";
// import InputConfig from "./InputConfig";
// import PredictionControls from "./PredictionControls";
// import DeleteModal from "@/components/base/DeleteModal";
// import SuccessModal from "@/components/base/SuccessModal";
// import AlertBase from "@/components/base/AlertBase";

// const ExternalModel: React.FC = () => {
//   const [modelName, setModelName] = useState<string>("");
//   const [modelUrl, setModelUrl] = useState<string>("");
//   const [apiKey, setApiKey] = useState<string>("");
//   const [isIntegrated, setIsIntegrated] = useState<boolean>(false);
//   const [isEnabled, setIsEnabled] = useState<boolean>(false);
//   const [status, setStatus] = useState<
//     "idle" | "loading" | "success" | "error"
//   >("idle");
//   const [responseMessage, setResponseMessage] = useState<string>("");

//   const [inputType, setInputType] = useState<"file" | "url" | "paste">("file");
//   const [imageUrl, setImageUrl] = useState<string>("");
//   const [pastedImage, setPastedImage] = useState<string>("");
//   const [imageInput, setImageInput] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [predictionResults, setPredictionResults] = useState<any[]>([]);
//   const [imageDimensions, setImageDimensions] = useState<{
//     width: number;
//     height: number;
//   } | null>(null);

//   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
//   const imageRef = useRef<HTMLImageElement>(null);
//   const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);

//   useEffect(() => {
//     if (isIntegrated) {
//       setIsEnabled(true);
//     } else {
//       setIsEnabled(false);
//     }
//   }, [isIntegrated]);

//   const handleTestConnection = async () => {
//     setStatus("loading");
//     setResponseMessage("");

//     try {
//       const response = await fetch(modelUrl, {
//         method: "GET",
//         headers: { Authorization: `Bearer ${apiKey}` },
//       });

//       if (response.ok) {
//         setStatus("success");
//         setResponseMessage("API Connection successful!");
//       } else {
//         setStatus("error");
//         setResponseMessage(
//           "Failed to connect. Please check the URL or API Key."
//         );
//       }
//     } catch (error) {
//       setStatus("error");
//       setResponseMessage("An error occurred while connecting to the API.");
//     }
//   };

//   const handleSaveIntegration = () => {
//     if (status === "success") {
//       setIsIntegrated(true);
//       alert("Integration saved successfully!");
//     } else {
//       alert("Please ensure the API connection is successful.");
//     }
//   };

//   const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       setImageInput(file);
//       setImagePreview(URL.createObjectURL(file));
//       setPredictionResults([]);
//     }
//   };

//   const handleImageUrlChange = () => {
//     if (imageUrl) {
//       setImagePreview(imageUrl);
//       setPredictionResults([]);
//     }
//   };

//   const handlePastedImageChange = () => {
//     if (pastedImage) {
//       setImagePreview(`data:image/jpeg;base64,${pastedImage}`);
//       setPredictionResults([]);
//     }
//   };

//   const handleToggleEnable = () => {
//     setIsEnabled((prev) => !prev);
//   };

//   const handleDeleteModel = () => {
//     setIsModalOpen(true); // Open the modal
//   };

//   const confirmDeleteModel = () => {
//     setIsIntegrated(false);
//     setIsEnabled(false);
//     setModelName("");
//     setModelUrl("");
//     setApiKey("");
//     setResponseMessage("");
//     setPredictionResults([]);
//     setImagePreview(null);
//     setImageDimensions(null);
//     setIsModalOpen(false); // Close the modal
//     setIsSuccessModalOpen(true);
//   };

//   const handleTestWithData = async () => {
//     const formData = new FormData();

//     if (inputType === "file" && imageInput) {
//       formData.append("file", imageInput);
//     } else if (inputType === "url" && imageUrl) {
//       formData.append("url", imageUrl);
//     } else if (inputType === "paste" && pastedImage) {
//       formData.append("pastedImage", pastedImage);
//     } else {
//       alert("Please provide valid image input.");
//       return;
//     }

//     try {
//       const response = await fetch(`${modelUrl}/predict`, {
//         method: "POST",
//         body: formData,
//       });

//       if (response.ok) {
//         const result = await response.json();
//         setPredictionResults(result);
//       } else {
//         alert("Prediction failed. Please check your input.");
//       }
//     } catch (error) {
//       console.error("Prediction Error:", error);
//       alert("An error occurred during prediction.");
//     }
//   };

//   return (
//     <div className="p-6 bg-white rounded shadow">
//       <h1 className="text-2xl font-semibold mb-4 text-gray-800">
//         External Model Integration
//       </h1>

//       {!isIntegrated ? (
//         <InputConfig
//           modelName={modelName}
//           modelUrl={modelUrl}
//           apiKey={apiKey}
//           status={status}
//           responseMessage={responseMessage}
//           onModelNameChange={(e) => setModelName(e.target.value)}
//           onModelUrlChange={(e) => setModelUrl(e.target.value)}
//           onApiKeyChange={(e) => setApiKey(e.target.value)}
//           onTestConnection={handleTestConnection}
//           onSaveIntegration={handleSaveIntegration}
//         />
//       ) : (
//         <PredictionControls
//           isEnabled={isEnabled}
//           modelName={modelName}
//           onToggleEnable={handleToggleEnable}
//           onDeleteModel={handleDeleteModel}
//           inputType={inputType}
//           imageUrl={imageUrl}
//           pastedImage={pastedImage}
//           imagePreview={imagePreview}
//           predictionResults={predictionResults}
//           onInputTypeChange={(e) =>
//             setInputType(e.target.value as "file" | "url" | "paste")
//           }
//           onImageInputChange={handleImageInputChange}
//           onImageUrlChange={handleImageUrlChange}
//           onPastedImageChange={handlePastedImageChange}
//           onTestWithData={handleTestWithData}
//           setImageUrl={setImageUrl}
//           setPastedImage={setPastedImage}
//         />
//       )}

//       {/* Modal for Deleting Model */}
//       <DeleteModal
//         show={isModalOpen}
//         title="Delete Model"
//         message="Are you sure you want to delete this model? This action cannot be undone."
//         onConfirm={confirmDeleteModel}
//         onClose={() => setIsModalOpen(false)}
//       />
//       {/* Success Modal */}
//       <AlertBase
//         show={isSuccessModalOpen}
//         type="success"
//         message="Model has been successfully deleted."
//         duration={3000}
//         onClose={() => setIsSuccessModalOpen(false)}
//       />
//     </div>
//   );
// };

// export default ExternalModel;