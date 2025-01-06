import React, { useEffect } from "react";

interface ModalBaseProps {
  show: boolean;
  title?: string; // Optional title
  message: string;
  duration?: number; // Duration in milliseconds
  onClose: () => void;
  onConfirm?: () => void; // Optional confirm callback
}

const ModalBase: React.FC<ModalBaseProps> = ({
  show,
  title = "Confirmation",
  message,
  duration = 0,
  onClose,
  onConfirm,
}) => {
  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
        {/* Title */}
        <div className="border-b border-gray-200 pb-4 mb-4">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        </div>

        {/* Message */}
        <div className="mb-6">
          <p className="text-gray-700">{message}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded-lg"
          >
            Cancel
          </button>
          {onConfirm && (
            <button
              onClick={onConfirm}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg"
            >
              Confirm
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalBase;