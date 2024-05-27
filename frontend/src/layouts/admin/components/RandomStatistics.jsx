import { useEffect, useState } from 'react';

function RandomStatistics() {
  const [pharmacies, setPharmacies] = useState(0);
  const [balance, setBalance] = useState(0);
  const [products, setProducts] = useState(0);
  const [sales, setSales] = useState(0);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "http://localhost:8081/admin/getStatistics",
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
      setPharmacies(data.pharmacies);
      setBalance(data.balance);
      setProducts(data.products);
      setSales(data.sales);
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4 p-6">
      <div className="min-w-0 rounded-lg shadow-xs overflow-hidden bg-white dark:bg-gray-900">
        <div className="p-4 flex items-center">
          <div className="p-3 rounded-full text-orange-500 dark:text-orange-100 bg-orange-100 dark:bg-orange-500 mr-4">
            <svg fill="currentColor" viewBox="0 0 20 20" className="w-5 h-5">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
            </svg>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
              Pharmacies
            </p>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              {pharmacies}
            </p>
          </div>
        </div>
      </div>
      <div className="min-w-0 rounded-lg shadow-xs overflow-hidden bg-white dark:bg-gray-900">
        <div className="p-4 flex items-center">
          <div className="p-3 rounded-full text-green-500 dark:text-green-100 bg-green-100 dark:bg-green-500 mr-4">
            <svg fill="currentColor" viewBox="0 0 20 20" className="w-5 h-5">
              <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"></path>
            </svg>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
              Total value
            </p>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              $ {balance.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
      <div className="min-w-0 rounded-lg shadow-xs overflow-hidden bg-white dark:bg-gray-900">
        <div className="p-4 flex items-center">
          <div className="p-3 rounded-full text-blue-500 dark:text-blue-100 bg-blue-100 dark:bg-blue-500 mr-4">
            <svg fill="currentColor" viewBox="0 0 20 20" className="w-5 h-5">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
            </svg>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
              All Products
            </p>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              {products}
            </p>
          </div>
        </div>
      </div>
      <div className="min-w-0 rounded-lg shadow-xs overflow-hidden bg-white dark:bg-gray-900">
        <div className="p-4 flex items-center">
          <div className="p-3 rounded-full text-purple-500 dark:text-purple-100 bg-purple-100 dark:bg-purple-500 mr-4">
            <svg fill="currentColor" viewBox="0 0 20 20" className="w-5 h-5">
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13h2v4h-2V5zm0 6h2v4h-2v-4z"></path>
            </svg>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
              Orders Completed
            </p>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              {sales}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RandomStatistics;