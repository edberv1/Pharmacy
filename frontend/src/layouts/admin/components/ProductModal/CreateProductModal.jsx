import { useEffect, useRef, useState } from "react";
import { useContext } from "react";
import Alert from "../Alert";
import { AlertContext } from "../../../../contexts/AlertContext";

function CreateProductModal({ isOpen, onClose, pharmacyId, pharmacyName }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    produced: "",
    price: "",
    pharmacyId: pharmacyId || "",
    stock: "",
  });
  const [image, setImage] = useState(null); // Ensure image is initialized as null

  const modalRef = useRef(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const { showAlert, message, type } = useContext(AlertContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Ensure this sets the actual File object
    console.log("Selected file:", e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a new FormData instance
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    if (image) {
      data.append('image', image); // Ensure the image is appended correctly
    } else {
      console.error("No image file selected");
    }

    console.log("FormData before sending:", Array.from(data.entries())); // Debugging log

    try {
      const response = await fetch(
        "http://localhost:8081/admin/createProduct",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: data, // Send the FormData instance as the request body
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      const responseData = await response.json();

      console.log(responseData);
      onClose();
      setFormSubmitted(true);

      showAlert("Product created successfully", "success");
      
    } catch (error) {
      showAlert("Error creating product", "error");
      setError(error.message);
      setFormSubmitted(false);
    }
  };

  const handleClose = () => {
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
    setFormData((prevData) => ({ ...prevData, pharmacyId }));
  }, [pharmacyId]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
      <Alert message={message} type={type} />
      <div className="bg-white rounded-lg w-1/2 p-6" ref={modalRef}>
        <div className="flex justify-end">
          <button
            onClick={handleClose}
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
        <h2 className="text-xl font-semibold mb-4">Create Product</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
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
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              LICENSE FILE
            </label>
            <input
              type="file"
              name="image"
              className="mt-4 mb-4 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              accept=".jpg,.jpeg,.png"
              onChange={handleImageChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Description
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Produced
            </label>
            <input
              type="text"
              name="produced"
              value={formData.produced}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Stocks
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">
                Pharmacy
              </label>
              <input
                type="text"
                value={pharmacyName}
                className="mt-1 p-2 w-full border rounded-md"
                readOnly
              />
            </div>
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
              className="px-4 py-2 text-sm rounded-md bg-green-600 text-white hover:bg-green-700"
            >
              Create Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateProductModal;
