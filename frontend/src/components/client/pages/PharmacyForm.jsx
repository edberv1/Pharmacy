import { useState } from "react";

function PharmacyForm() {
  const [licenseId, setLicenseId] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [license, setLicense] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch("http://localhost:8081/users/submitLicense", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"), // assuming the token is stored in localStorage
      },
      body: JSON.stringify({
        licenseId,
        issueDate,
        expiryDate,
        license,
      }),
    });

    const data = await response.json();

    if (data.message) {
      alert(data.message);
    }
  };

  return (
    <div
      id="pharmacyForm"
      className="max-w-md mx-auto bg-white p-8 border border-gray-300 mt-20 rounded-lg shadow-md transition-opacity duration-300"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* ... */}
        <input
          type="number"
          name="licenseId"
          id="licenseId"
          placeholder="License Official 10 Numbers ID"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
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
        {/* ... */}
        <input
          type="file"
          name="license"
          id="license"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          accept=".pdf"
          onChange={(e) => {
            setLicense(e.target.files[0].name);
          }}
        />
        {/* ... */}
        <input
          type="date"
          name="issueDate"
          id="issueDate"
          placeholder="Start Date"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          onChange={(e) => {
            setIssueDate(e.target.value);
          }}
        />
        {/* ... */}
        <input
          type="date"
          name="expiryDate"
          id="expiryDate"
          placeholder="Expiry Date"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          onChange={(e) => {
            setExpiryDate(e.target.value);
          }}
        />
        {/* ... */}
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition-colors duration-300"
        >
          Submit
        </button>
        {/* ... */}
      </form>
    </div>
  );
}

export default PharmacyForm;
