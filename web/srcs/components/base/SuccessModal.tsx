import React, { useEffect } from "react";

interface SuccessModalProps {
  show: boolean;
  message: string;
  duration: number; // duration in milliseconds
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  show,
  message,
  duration,
  onClose,
}) => {
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (show) {
      timer = setTimeout(() => {
        onClose();
      }, duration);
    }
    return () => clearTimeout(timer); // Cleanup timer
  }, [show, duration, onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-4 rounded-lg shadow-lg w-3/4 md:w-1/2 text-center">
        <h2 className="text-lg font-semibold text-green-700 mb-2">Success</h2>
        <p className="text-gray-700">{message}</p>
      </div>
    </div>
  );
};

export default SuccessModal;
