/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";

function EditUserModal({ isOpen, onClose, user }) {
  const [formData, setFormData] = useState({
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    roleId: user.roleId.toString(),
    verified: user.verified.toString(), // Add this line
  });

  const [error, setError] = useState(null); // State for handling errors

  const modalRef = useRef(null);
  const contentRef = useRef(null);
  const [roles, setRoles] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you can add your logic to update a user
    try {
      // Make HTTP PUT request to update user with token included in headers
      const response = await fetch(
        `http://localhost:8081/superAdmin/editUser/${user.id}`, //userId
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
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

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch(
          "http://localhost:8081/superAdmin/getAllRoles",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + localStorage.getItem("token")
            },
          }
        );

        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage);
        }

        const data = await response.json();
        setRoles(data); // Assuming the backend returns an array of user objects with 'id' and 'name' fields
      } catch (error) {
        console.error("Failed to fetch role ids:", error);
        setError("Failed to fetch role ids.");
      }
    };
    fetchRoles();
  }, []);

  const roleOptions =
    roles && roles.length > 0
      ? roles.map((role) => (
          <option key={role.id} value={role.id}>
            {role.role}
          </option>
        ))
      : null;

  const handleClose = () => {
    onClose();
  };

  // useEffect(() => {
  //   const handleOutsideClick = (e) => {
  //     if (
  //       isOpen &&
  //       modalRef.current &&
  //       !modalRef.current.contains(e.target) &&
  //       contentRef.current &&
  //       !contentRef.current.contains(e.target)
  //     ) {
  //       onClose();
  //     }
  //   };

  //   document.addEventListener("mousedown", handleOutsideClick);

  //   return () => {
  //     document.removeEventListener("mousedown", handleOutsideClick);
  //   };
  // }, [isOpen, onClose]);

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
        <h2 className="text-xl font-semibold mb-4">Edit User</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              First Name
            </label>
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Last Name
            </label>
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Verified
            </label>
            <select
              name="verified"
              value={formData.verified}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            >
              <option value="" disabled>
                Select Verification Status
              </option>
              <option value="1">Verified</option>
              <option value="0">Not Verified</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Role
            </label>
            <select
              name="roleId"
              value={formData.roleId}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            >
              <option value="" disabled>
                Select Role
              </option>
              {roleOptions}
            </select>
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
              Update User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditUserModal;
