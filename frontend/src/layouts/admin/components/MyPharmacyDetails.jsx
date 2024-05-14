/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Import useParams to access URL parameters
import fetchWithTokenRefresh from "../../../../utils/fetchWithTokenRefresh";

function MyPharmacyDetails() {
  const { id } = useParams(); // Access the pharmacy id from URL parameter
  const [pharmacy, setPharmacyDetails] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchPharmacyDetails = async () => {
      try {
        const response = await fetchWithTokenRefresh(
          `http://localhost:8081/admin/myPharmacies/${id}`,
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
        setPharmacyDetails(data);
      } catch (error) {
        console.error("Error fetching pharmacy details:", error);
        setPharmacyDetails(null); // Reset pharmacy details state in case of error
      }
    };

    const fetchPharmacyProducts = async () => {
      try {
        const response = await fetchWithTokenRefresh(
          `http://localhost:8081/admin/getPharmacyProducts/${id}`,
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
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      }
    };

    fetchPharmacyProducts();
    fetchPharmacyDetails();
  }, [id]); // Make sure to include id in the dependency array to re-fetch details when id changes

  // if (!pharmacy) {
  //   return <div>Loading...</div>;
  // }

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
              <strong>ID:</strong> {pharmacy ? pharmacy.id : "Loading..."}
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

        <h2 className="text-3xl font-bold mb-4 flex justify-center py-6">Products:</h2>

        <div className="flex place-items-center justify-around">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white p-8 rounded shadow-lg text-center mb-4"
            >
              <h2 className="text-3xl font-bold mb-4">Product Details</h2>
              <p className="text-lg">
                <strong>Name:</strong> {product ? product.name : "Loading..."}
              </p>
              <p className="text-lg">
                <strong>Produced:</strong>{" "}
                {product ? product.produced : "Loading..."}
              </p>
              <p className="text-lg">
                <strong>Stock:</strong> {product ? product.stock : "Loading..."}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default MyPharmacyDetails;
