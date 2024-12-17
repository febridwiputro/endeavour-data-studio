import React, { useEffect } from "react";
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

interface AlertBaseProps {
  show: boolean;
  type: "success" | "error" | "warning" | "info";
  message: string;
  duration?: number; // Optional duration in milliseconds
  onClose: () => void; // Callback to close alert
}

const AlertBase: React.FC<AlertBaseProps> = ({
  show,
  type,
  message,
  duration = 3000,
  onClose,
}) => {
  // Define colors and icons based on alert type
  const alertStyles = {
    success: {
      bgColor: "bg-green-100",
      textColor: "text-green-700",
      borderColor: "border-green-500",
      icon: <CheckCircleIcon className="w-5 h-5 text-green-600 mr-3" />,
    },
    error: {
      bgColor: "bg-red-100",
      textColor: "text-red-700",
      borderColor: "border-red-500",
      icon: <XCircleIcon className="w-5 h-5 text-red-600 mr-3" />,
    },
    warning: {
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-700",
      borderColor: "border-yellow-500",
      icon: (
        <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mr-3" />
      ),
    },
    info: {
      bgColor: "bg-blue-100",
      textColor: "text-blue-700",
      borderColor: "border-blue-500",
      icon: (
        <InformationCircleIcon className="w-5 h-5 text-blue-600 mr-3" />
      ),
    },
  };

  const { bgColor, textColor, borderColor, icon } = alertStyles[type];

  // Auto-close the alert after a specified duration
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer); // Cleanup on unmount
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 flex items-center max-w-sm rounded-lg shadow-lg ${bgColor} border-l-4 ${borderColor} p-4`}
    >
      {/* Icon */}
      {icon}

      {/* Message */}
      <div className="flex-1">
        <p className={`font-semibold ${textColor}`}>{message}</p>
      </div>

      {/* Close Button */}
      <button onClick={onClose} className="text-gray-700 hover:text-gray-900 ml-2">
        <XMarkIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default AlertBase;
