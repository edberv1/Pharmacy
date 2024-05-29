/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const ShowProducts = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:8081/users/showAllProducts"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to fetch products. Please try again later.");
      }
    };

    fetchProducts();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex flex-wrap justify-center">
      
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-gray-200 relative m-10 flex w-full max-w-xs flex-col overflow-hidden rounded-lg border border-gray-100 shadow-xl"
        >
          <Link
            to={`/pharmacies/${product.pharmacyId}/products/${product.id}`}
            className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl"
          >
            {product.stock <= 0 && (
              <span className="py-1 min-[400px]:py-2 px-2 min-[400px]:px-4 cursor-pointer rounded-lg bg-red-600 font-medium text-base leading-7 text-white absolute top-3 right-3 z-10">
                Out of stock
              </span>
            )}
            <img
              className="object-cover"
              src={`http://localhost:8081/${product.image.replace("\\", "/")}`}
              alt="product image"
            />
          </Link>
          <div className="mt-4 px-5 pb-5">
            <a href="#">
              <h5 className="text-xl tracking-tight text-slate-900">
                {product.name}
              </h5>
            </a>
            <p>
              <span className="text-3xl font-bold text-slate-900">
                {product.price}€
              </span>
            </p>
            <p>
              <span className="text-slate-600">
                Pharmacy: {product.pharmacy_name}
              </span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShowProducts;
