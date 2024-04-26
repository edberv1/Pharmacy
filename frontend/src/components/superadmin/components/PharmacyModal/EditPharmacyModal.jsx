/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";

function EditPharmacyModal({ isOpen, onClose, pharmacy }) {
  const [formData, setFormData] = useState({
    name: pharmacy.name,
    location: pharmacy.location,
  });

  const [error, setError] = useState(null); // State for handling errors

  const modalRef = useRef(null);
  const contentRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you can add your logic to update a pharmacy
    try {
      // Retrieve the token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found.");
      }

      // Make HTTP PUT request to update pharmacy with token included in headers
      const response = await fetch(
        `http://localhost:8081/superAdmin/editPharmacy/${pharmacy.id}`, //pharmacy.id
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token, // Include the token in the headers
          },
          body: JSON.stringify(formData),
        }
      );

      // Check if the request was successful
      if (!response.ok) {
        // Handle non-200 response status
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log(data); // Log the response if needed
      onClose();
      window.location.reload();
    } catch (error) {
      setError(error.message); // Set error state
    }
  };

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isOpen && modalRef.current && !modalRef.current.contains(e.target) && contentRef.current && !contentRef.current.contains(e.target)) {
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
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-1/2 p-6" ref={modalRef}>
        <div className="flex justify-end">
          <button
            onClick={handleClose}
            className=" text-gray-500 hover:text-gray-700 focus:outline-none z-10"
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
        <h2 className="text-xl font-semibold mb-4">Edit Pharmacy</h2>
        <form onSubmit={handleSubmit}>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
                Pharmacy name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
                Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>

          {error && <div className="text-red-500 mt-2">{error}</div>}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="mr-2 px-4 py-2 text-sm rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              Update Pharmacy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 

export default EditPharmacyModal;