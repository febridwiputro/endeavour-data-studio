import React from 'react';

interface ModalProps {
  show: boolean;
  title: string;
  message: string;
  onClose: () => void;
  children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ show, title, message, onClose, children }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-3/4 md:w-1/2 p-6 relative">
        {/* Title with solid black color */}
        <h2 className="text-xl font-semibold mb-4 text-black">{title}</h2>

        {/* Message with solid gray-900 for visibility */}
        <p className="mb-4 text-gray-900">{message}</p>

        {children}

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        >
          ✖️
        </button>
      </div>
    </div>
  );
};

export default Modal;
