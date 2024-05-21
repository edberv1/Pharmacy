import { useState } from "react";

function PharmacyForm() {
  const [licenseId, setLicenseId] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [license, setLicense] = useState("");

  // Get today's date
  const today = new Date().toISOString().split("T")[0];
  // Get the date 7 days from today
  const dateAfterSevenDays = new Date();
  dateAfterSevenDays.setDate(dateAfterSevenDays.getDate() + 7);
  const minExpiryDate = dateAfterSevenDays.toISOString().split("T")[0];

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Create a new FormData instance
    const formData = new FormData();

    // Append the form data
    formData.append("licenseId", licenseId);
    formData.append("issueDate", issueDate);
    formData.append("expiryDate", expiryDate);
    formData.append("license", license); // This should be the actual File object, not just the file name

    const response = await fetch("http://localhost:8081/users/submitLicense", {
      method: "POST",
      headers: {
        "x-access-token": localStorage.getItem("token"), // assuming the token is stored in localStorage
      },
      body: formData, // Send the FormData object, not a JSON string
    });

    const data = await response.json();

    if (data.message) {
      alert(data.message);
    }
  };

  return (
  <div>
    <div className="flex justify-center pt-6">
      <h1 className="text-3xl font-bold text-center  ">
  ENTER YOUR PHARMACY DATA HERE
</h1>

    </div>
    <div
      id="pharmacyForm"
      className="max-w-md mx-auto mb-20 bg-white p-8 border border-gray-300 mt-14 rounded-lg shadow-md transition-opacity duration-300"
    >
      <h1></h1>
      <form className="" onSubmit={handleSubmit}>
        <label>LICENSE ID</label>
        <input
          type="number"
          name="licenseId"
          id="licenseId"
          placeholder="License Official 10 Numbers ID"
          className="mt-4 mb-4 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          style={{
            MozAppearance: "textfield",
          }}
          onInput={(e) => {
            e.target.value = Math.max(0, parseInt(e.target.value))
              .toString()
              .slice(0, 10);
            setLicenseId(e.target.value);
          }}
        />
        <label className="mt-"  htmlFor="">LICENSE FILE</label>
        <input
          type="file"
          name="license"
          id="license"
          className="mt-4 mb-4 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          accept=".pdf"
          onChange={(e) => {
            setLicense(e.target.files[0]); // This should be the actual File object, not just the file name
          }}
        />
        <label htmlFor="">LICENSE ISSUED DATE</label> 
        <input
          type="date"
          name="issueDate"
          id="issueDate"
          placeholder="Start Date"
          className="mt-4 mb-4 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          max={today} // Restrict to dates before today
          onChange={(e) => {
            setIssueDate(e.target.value);
          }}
        />
        <label htmlFor="">LICENSE EXPIRY DATE</label> 
        <input
          type="date"
          name="expiryDate"
          id="expiryDate"
          placeholder="Expiry Date"
          className="mt-4 mb-6 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          min={minExpiryDate} // Restrict to dates after 7 days from today
          onChange={(e) => {
            setExpiryDate(e.target.value);
          }}
        />
        <div className="flex justify-center">
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-24 rounded-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition-colors duration-300"
        >
          Submit
        </button>
        </div>
      </form>
    </div>
    </div>
  );
}

export default PharmacyForm;
