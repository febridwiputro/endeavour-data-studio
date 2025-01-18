import React, { useEffect } from "react";

interface ModalBaseProps {
  show: boolean;
  message: string;
  duration: number; // Durasi dalam milidetik
  onClose: () => void;
}

const ModalBase: React.FC<ModalBaseProps> = ({ show, message, duration, onClose }) => {
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (show) {
      timer = setTimeout(() => {
        onClose();
      }, duration);
    }
    return () => clearTimeout(timer);
  }, [show, duration, onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-3/4 md:w-1/2 p-6 text-center">
        <p className="text-lg font-semibold text-green-600">{message}</p>
      </div>
    </div>
  );
};

export default ModalBase;
