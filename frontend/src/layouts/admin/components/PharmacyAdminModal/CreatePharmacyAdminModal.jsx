/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import Locations from "../../../../../utils/Locations"; 
function CreatePharmacyAdminModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    street:"",
    userId: "",
  });

  const [formSubmitted, setFormSubmitted] = useState(false); // Track form submission
  const [error, setError] = useState(null); // State for handling errors

  const modalRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setFormSubmitted(false);
  };

  const handleLocationChange = (location) => {
    setFormData((prevData) => ({ ...prevData, location }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you can add your logic to create a user
    try {
      // Make HTTP POST request to create user with token included in headers
      const response = await fetch(
        "http://localhost:8081/admin/createPharmacy",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
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
      setFormSubmitted(true); // Set form submission status to true
    } catch (error) {
      setError(error.message); // Set error state
      setFormSubmitted(false); // Set form submission status to false
    }
  };

  const handleClose = () => {
    setFormData({
      //   roleId : "", ???
      name: "",
      location: "",
    });
    onClose();
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isOpen && modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    // Reload the page if form is submitted successfully
    if (formSubmitted) {
      window.location.reload();
    }
  }, [formSubmitted]);

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
        <h2 className="text-xl font-semibold mb-4">Create Pharmacy</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Name
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

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Location
            </label>
            <Locations value={formData.location} onChange={handleLocationChange} />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Street
            </label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>

          



          {error && <div className="text-red-500 mt-2">{error}</div>}
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={handleClose}
              className="mr-2 px-4 py-2 text-sm rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm rounded-md bg-green-600 text-white hover:bg-green-700"
            >
              Create Pharmacy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePharmacyAdminModal;
