import React from 'react';
import './Modal.css';

const Modal = ({ title, onClose, onSave, children }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl leading-none">×</button>
        </div>
        <div className="space-y-4">
          {children}
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded">Cancel</button>
          <button onClick={onSave} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded">Save</button>
        </div>
      </div>
    </div>
  );

export default Modal;
