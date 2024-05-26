import { useEffect, useState } from "react";

export default function CardStatistics() {
  const [mostSoldProduct, setMostSoldProduct] = useState({});
  const [totalSales, setTotalSales] = useState(0);
  const [leastSoldProduct, setLeastSoldProduct] = useState({});
  const [mostProfitableProduct, setMostProfitableProduct] = useState({});

  const fetchData = async () => {
    try {
      const mostSoldProductResponse = await fetch(
        "http://localhost:8081/admin/getMostSoldProduct",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (!mostSoldProductResponse.ok) {
        throw new Error(
          `HTTP error! status: ${mostSoldProductResponse.status}`
        );
      }
      const mostSoldProductData = await mostSoldProductResponse.json();
      setMostSoldProduct(mostSoldProductData);

      const totalSalesResponse = await fetch(
        "http://localhost:8081/admin/getTotalSales",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (!totalSalesResponse.ok) {
        throw new Error(`HTTP error! status: ${totalSalesResponse.status}`);
      }
      const totalSalesData = await totalSalesResponse.json();
      setTotalSales(totalSalesData.totalSales);

      const leastSoldProductResponse = await fetch(
        "http://localhost:8081/admin/getLeastSoldProduct",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (!leastSoldProductResponse.ok) {
        throw new Error(`HTTP error! status: ${leastSoldProductResponse.status}`);
      }
      const leastSoldProductData = await leastSoldProductResponse.json();
      setLeastSoldProduct(leastSoldProductData);

      const mostProfitableProductResponse = await fetch(
        "http://localhost:8081/admin/getMostProfitableProduct",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (!mostProfitableProductResponse.ok) {
        throw new Error(
          `HTTP error! status: ${mostProfitableProductResponse.status}`
        );
      }
      const mostProfitableProductData =
        await mostProfitableProductResponse.json();
      setMostProfitableProduct(mostProfitableProductData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container items-center px-4 py-8 m-auto mt-5">
      <div className="flex flex-wrap pb-3 mx-4 md:mx-24 lg:mx-0">
        <div className="w-full p-2 lg:w-1/4 md:w-1/2">
          <div className="flex flex-col px-6 py-10 overflow-hidden bg-white hover:bg-gradient-to-br hover:from-purple-400 hover:via-blue-400 hover:to-blue-500 rounded-xl shadow-lg duration-300 hover:shadow-2xl group">
            <div className="flex flex-row justify-between items-center">
            <div className="px-4 py-4 bg-gray-300  rounded-xl bg-opacity-30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 group-hover:text-gray-50"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" />
                </svg>
              </div>
              <div className="inline-flex text-sm text-gray-600 group-hover:text-gray-200 sm:text-base">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2 text-green-500 group-hover:text-gray-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                
                <p>Most sold product</p>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl xl:text-5xl font-bold text-gray-700 mt-12 group-hover:text-gray-50">
              {mostSoldProduct.productName}
            </h1>
            <div className="flex flex-row justify-between group-hover:text-gray-200">
            {mostSoldProduct.quantity} products
            </div>
          </div>
        </div>
        <div className="w-full p-2 lg:w-1/4 md:w-1/2">
          <div className="flex flex-col px-6 py-10 overflow-hidden bg-white hover:bg-gradient-to-br hover:from-purple-400 hover:via-blue-400 hover:to-blue-500 rounded-xl shadow-lg duration-300 hover:shadow-2xl group">
            <div className="flex flex-row justify-between items-center">
              <div className="px-4 py-4 bg-gray-300  rounded-xl bg-opacity-30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 group-hover:text-gray-50"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" />
                </svg>
              </div>
              <div className="inline-flex text-sm text-gray-600 group-hover:text-gray-200 sm:text-base">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2 text-green-500 group-hover:text-gray-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                
                <p>${totalSales}</p>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl xl:text-5xl font-bold text-gray-700 mt-12 group-hover:text-gray-50">
              Total Sales
            </h1>
            <div className="flex flex-row justify-between group-hover:text-gray-200">
            ${totalSales}
            </div>
          </div>
        </div>

        <div className="w-full p-2 lg:w-1/4 md:w-1/2">
          <div className="flex flex-col px-6 py-10 overflow-hidden bg-white hover:bg-gradient-to-br hover:from-purple-400 hover:via-blue-400 hover:to-blue-500 rounded-xl shadow-lg duration-300 hover:shadow-2xl group">
            <div className="flex flex-row justify-between items-center">
              <div className="px-4 py-4 bg-gray-300  rounded-xl bg-opacity-30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 group-hover:text-gray-50"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" />
                </svg>
              </div>
              <div className="inline-flex text-sm text-gray-600 group-hover:text-gray-200 sm:text-base">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2 text-red-500 group-hover:text-gray-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                
                <p>Least sold product</p>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl xl:text-5xl font-bold text-gray-700 mt-12 group-hover:text-gray-50">
              {leastSoldProduct.productName}
            </h1>
            <div className="flex flex-row justify-between group-hover:text-gray-200">
            {leastSoldProduct.quantitySold || 0} products sold
            </div>
          </div>
        </div>
        <div className="w-full p-2 lg:w-1/4 md:w-1/2">
          <div className="flex flex-col px-6 py-10 overflow-hidden bg-white hover:bg-gradient-to-br hover:from-purple-400 hover:via-blue-400 hover:to-blue-500 rounded-xl shadow-lg duration-300 hover:shadow-2xl group">
            <div className="flex flex-row justify-between items-center">
            <div className="px-4 py-4 bg-gray-300  rounded-xl bg-opacity-30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 group-hover:text-gray-50"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" />
                </svg>
              </div>
              <div className="inline-flex text-sm text-gray-600 group-hover:text-gray-200 sm:text-base">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2 text-green-500 group-hover:text-gray-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                
                <p>Most profitable product</p>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl xl:text-5xl font-bold text-gray-700 mt-12 group-hover:text-gray-50">
              {mostProfitableProduct.productName}
            </h1>
            <div className="flex flex-row justify-between group-hover:text-gray-200">
            ${mostProfitableProduct.profit}
            </div>  
          </div>
        </div>
      </div>
    </div>
  );
}
