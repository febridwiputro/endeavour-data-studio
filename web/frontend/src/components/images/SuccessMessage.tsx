import { useEffect } from "react";

interface SuccessMessageProps {
  message: string;
  onClose: () => void;
}

const SuccessMessage = ({ message, onClose }: SuccessMessageProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer); // Clear timeout on component unmount
  }, [onClose]);

  return (
    <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
      {message}
    </div>
  );
};

export default SuccessMessage;
