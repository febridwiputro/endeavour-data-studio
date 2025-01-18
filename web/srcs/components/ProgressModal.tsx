import React from 'react';
import Modal from './Modal';

interface ProgressModalProps {
  progress: number;
  onClose: () => void;
}

const ProgressModal: React.FC<ProgressModalProps> = ({ progress, onClose }) => {
  return (
    <Modal show={true} title="Processing Video" message="Please wait while we split your video..." onClose={onClose}>
      <div className="w-full bg-gray-200 rounded-full h-6">
        <div
          className="bg-green-600 h-6 flex items-center justify-center text-white text-xs rounded-full"
          style={{ width: `${progress}%` }}
        >
          {progress.toFixed(2)}%
        </div>
      </div>
    </Modal>
  );
};

export default ProgressModal;
