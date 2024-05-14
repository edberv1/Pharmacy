/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import MyPharmacyCard from "../components/MyPharmacyCard";

function MyPharmacies() {
  const [pharmacies, setPharmacies] = useState([]);

  useEffect(() => {
    const fetchPharmaciesforUser = async () => {
      try {
        const response = await fetch(
          "http://localhost:8081/admin/getPharmaciesForUser",
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

    fetchPharmaciesforUser();
  }, []);

  return (
    <>
      <div>
        <div className="container flex flex-wrap justify-around min-h-4">
          <h1>My Pharmacies</h1>
        </div>
        {pharmacies.length === 0 ? (
          <p>No pharmacies found for the user</p>
        ) : (
          <div className="flex flex-col min-h-screen">
            <div className="container flex flex-wrap justify-around px-6 pt-14 mx-auto">
              {pharmacies.map((pharmacy) => (
                <MyPharmacyCard key={pharmacy.id} id={pharmacy.id} name={pharmacy.name} location={pharmacy.location} />               
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default MyPharmacies;
