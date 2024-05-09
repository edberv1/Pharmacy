import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

function PharmacyForm({ onBack }) {
  const [formData, setFormData] = useState({
    pharmacyName: '',
    pharmacyLicense: null,
    startDate: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Fade-in effect when the component mounts
    const formElement = document.getElementById('pharmacyForm');
    formElement.style.opacity = 0;
    let opacity = 0.1;
    const timer = setInterval(() => {
      if (opacity >= 1) {
        clearInterval(timer);
      }
      formElement.style.opacity = opacity;
      opacity += opacity * 0.3; // Adjust the speed of opacity change
    }, 10); // Adjust the duration of each iteration
    return () => clearInterval(timer);
  }, []);

  // Handle input changes for text and date inputs
  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  // Handle file input change for image upload
  const handleFileChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.files[0]
    });
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    // Here, you might want to upload formData to a server or handle it accordingly
    console.log('Form Data:', formData);
    alert('Form submitted. Check the console for data.');
  };

  const handleBack = () => {
    navigate("/"); 
  };

  return (
    <div
      id="pharmacyForm"
      className="max-w-md mx-auto bg-white p-8 border border-gray-300 mt-20 rounded-lg shadow-md transition-opacity duration-300"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="pharmacyName" className="block text-sm font-medium text-gray-700">
            Pharmacy Name
          </label>
          <input
            type="text"
            name="pharmacyName"
            id="pharmacyName"
            placeholder="Pharmacy Name"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            value={formData.pharmacyName}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="pharmacyLicense" className="block text-sm font-medium text-gray-700">
            Pharmacy License (Image)
          </label>
          <input
            type="file"
            name="pharmacyLicense"
            id="pharmacyLicense"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            onChange={handleFileChange}
          />
        </div>
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            name="startDate"
            id="startDate"
            placeholder="Start Date"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            value={formData.startDate}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 transition-colors duration-300"
          >
            Back
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition-colors duration-300"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default PharmacyForm;