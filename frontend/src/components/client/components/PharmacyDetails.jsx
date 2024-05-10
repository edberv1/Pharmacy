/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Import useParams to access URL parameters

function PharmacyDetails() {
  const { id } = useParams(); // Access the pharmacy id from URL parameter
  const [pharmacy, setPharmacyDetails] = useState(null);

  useEffect(() => {
    const fetchPharmacyDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:8081/users/pharmacies/${id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPharmacyDetails(data);
      } catch (error) {
        console.error("Error fetching pharmacy details:", error);
      }
    };

    fetchPharmacyDetails();
  }, [id]); // Make sure to include id in the dependency array to re-fetch details when id changes

  if (!pharmacy) {
    return <div>Loading...</div>;
  }

  return (
    <>
 

      <section className="min-h-screen bg-cover bg-blue-400 mb-10 pt-16">

        <div className="flex place-items-center justify-center">
          {/* Apply flexbox styles */}
          <div className="bg-white p-8 rounded shadow-lg text-center ">
            {/* Add background, padding, and shadow */}
            <h2 className="text-3xl font-bold mb-4">Pharmacy Details</h2>
            {/* Increase font size and add margin */}
            <p className="text-lg">
              <strong>ID:</strong> {id}
            </p>
            <p className="text-lg">
              <strong>Name:</strong> {pharmacy ? pharmacy.name : "Loading..."}
            </p>
            <p className="text-lg">
              <strong>Location:</strong>
              {pharmacy ? pharmacy.location : "Loading..."}
            </p>
            {/* Render other pharmacy details here */}
          </div>
        </div>
        
      </section>

    </>
  );
}

export default PharmacyDetails;
