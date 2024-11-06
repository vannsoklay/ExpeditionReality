// src/components/Modal.tsx
import React from 'react';

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const Modal: React.FC<ModalProps> = ({ isVisible, onClose, onConfirm }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-lg font-semibold mb-4">Are you sure you want to go back to the home screen?</h2>
        <div className="flex justify-end">
          <button 
            onClick={onClose} 
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md mr-2 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm} 
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
