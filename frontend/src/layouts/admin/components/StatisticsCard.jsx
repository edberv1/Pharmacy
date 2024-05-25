import { useEffect, useState } from "react";

function StatisticsCard() {
  const [products, setProducts] = useState([]);

  const fetchLowStockProducts = async () => {
    try {
      const response = await fetch(
        "http://localhost:8081/admin/getLowStock", // Replace with your actual API endpoint
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
      console.error("Error fetching low stock products: ", error);
    }
  };

  useEffect(() => {
    fetchLowStockProducts();
  }, []);

  return (
    <>
      <span className="pl-8 font-semibold text-xl text-blueGray-700">
        Low on stock products
      </span>
      <div className="flex flex-wrap">
        {products.map((product) => (
          <div
            key={product.id}
            className="mt-4 w-full lg:w-6/12 xl:w-3/12 px-5 mb-4"
          >
            <div className="relative flex flex-col min-w-0 break-words bg-white rounded mb-3 xl:mb-0 shadow-lg">
              <div className="flex-auto p-4">
                <div className="flex flex-wrap">
                  <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                    <h5 className="text-blueGray-400 uppercase font-bold text-xs">
                      {product.pharmacyName}
                    </h5>
                    <span className="font-semibold text-xl text-blueGray-700">
                      {product.name}
                    </span>
                  </div>
                  <div className="relative w-auto pl-4 flex-initial">
                    <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full bg-red-500">
                      <i className="fas fa-chart-bar"></i>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-red-600 mt-4">
                  <span className="text-red-600 mr-2">
                    <i className="fas fa-arrow-down"></i> {product.stock}
                  </span>
                  <span className="whitespace-nowrap"> Low on stock </span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default StatisticsCard;
