import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
      <div className="bg-white p-6 rounded shadow-lg mx-6">
        <FontAwesomeIcon
          icon={faInfoCircle}
          className="text-red-500 text-2xl"
        />
        <p className="text-start mt-3">{message}</p>
        <div className="flex gap-10 items-center mt-4">
          <button
            className="border-2 border-red-500 px-2 rounded px-6 text-red-500 hover:bg-red-500 hover:text-white"
            onClick={onConfirm}>
            Yes
          </button>
          <button
            className="border-2 border-primary px-2 rounded px-6 text-primary hover:bg-primary hover:text-white"
            onClick={onCancel}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
