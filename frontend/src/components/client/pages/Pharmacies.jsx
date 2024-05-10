/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import PharmacyCard from "../components/PharmacyCard"; // Import PharmacyCard component
import Footer from "./Footer";

function Pharmacies() {
  const [pharmacies, setPharmacies] = useState([]);

  useEffect(() => {
    const fetchPharmacies = async () => {
      try {
        const response = await fetch(
          "http://localhost:8081/users/getAllPharmacies",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPharmacies(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching pharmacies: ", error); 
        // Handle error, e.g., set error state
      }
    };

    fetchPharmacies();
  }, []);

  return (
    <>
      <Navbar />

      <section className="min-h-screen bg-cover">
        <div className="flex flex-col min-h-screen bg-blue-400">
          <div className="container flex flex-col flex-1 px-6 py-12 mx-auto">
            {/* Map over pharmacies array and render PharmacyCard for each */}
            {pharmacies.map((pharmacy) => (
              <PharmacyCard key={pharmacy.id} id={pharmacy.id} name={pharmacy.name} location={pharmacy.location} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Pharmacies;
