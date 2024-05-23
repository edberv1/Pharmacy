/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import Alert from "../Alert";
import { AlertContext } from "../../../../contexts/AlertContext";

function DeletePharmacyModal({ isOpen, onClose, pharmacyId }) {
  const modalRef = useRef(null);
  const { showAlert, message, type } = useContext(AlertContext);

  const handleDeletePharmacy = async () => {
    try {
      // Make a DELETE request to your backend endpoint to delete the pharmacy
      const response = await fetch(`http://localhost:8081/admin/deletePharmacy/${pharmacyId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token")
        },
      });

      // Check if the request was successful
      if (!response.ok) {
        throw new Error("Failed to delete Pharmacy");
      }

      // If successful, log a success message and redirect
      showAlert("Pharmacy Deleted successfully", "success");
      onClose();
       

    } catch (error) {
      // Handle errors if the request fails
      showAlert("Error deleting Pharmacy", "error");
      // You can handle the error in the UI, display a notification, etc.
    }
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        isOpen &&
        modalRef.current &&
        !modalRef.current.contains(e.target)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-25 flex items-center justify-center">
      <Alert message={message} type={type} />
      <div className="bg-opacity-50 fixed inset-0"></div>
      <div className="bg-white rounded-lg w-1/3 p-6 relative" ref={modalRef}>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none z-10"
          >
            <span className="sr-only">Close</span>
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <h2 className="text-xl text-black font-semibold mb-4">Delete Pharmacy</h2>
        <p className="mb-4 text-black">
          Are you sure you want to delete this Pharmacy?
        </p>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation(); // Prevent event bubbling
              onClose();
            }}
            className="mr-2 px-4 py-2 text-sm rounded-md bg-gray-300 text-black hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation(); // Prevent event bubbling
              handleDeletePharmacy(); // Call the handleDeletePharmacy function
            }}
            className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeletePharmacyModal;
