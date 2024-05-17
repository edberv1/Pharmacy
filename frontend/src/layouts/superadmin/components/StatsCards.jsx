import { useState, useEffect } from "react";

function StatsCards() {
  const [users, setUsers] = useState([]);
  const [growth, setGrowth] = useState(0);
  const [adminGrowth, setAdminGrowth] = useState(0);
  const [pharmacyCount, setPharmacyCount] = useState(0);
  const [pharmacyGrowth, setPharmacyGrowth] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [productsGrowth, setProductsGrowth] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "http://localhost:8081/superAdmin/getAllUsers",
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
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    };

    const getGrowth = async () => {
      try {
        const response = await fetch(
          "http://localhost:8081/superAdmin/getUserGrowth",
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
        setGrowth(data.growth); // Change this line
      } catch (error) {
        console.error("Error getting UserGrowth: ", error);
      }
    };

    const getAdminGrowth = async () => {
      try {
        const response = await fetch(
          "http://localhost:8081/superAdmin/getAdminGrowth",
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
        setAdminGrowth(data.growth);
      } catch (error) {
        console.error("Error getting AdminGrowth: ", error);
      }
    };
    const getPharmacyCountAndGrowth = async () => {
      try {
        const response = await fetch(
          "http://localhost:8081/superAdmin/getPharmacyCountAndGrowth",
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
        setPharmacyCount(data.totalPharmacies);
        setPharmacyGrowth(data.growth);
      } catch (error) {
        console.error("Error getting PharmacyCount and Growth: ", error);
      }
    };

    const getProductsCountAndGrowth = async () => {
      try {
        const response = await fetch(
          "http://localhost:8081/superAdmin/getProductGrowth",
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
        setProductsCount(data.totalProducts);
        setProductsGrowth(data.growth);
      } catch (error) {
        console.error("Error getting PharmacyCount and Growth: ", error);
      }
    };

    fetchUsers();
    getGrowth();
    getAdminGrowth();
    getPharmacyCountAndGrowth();
    getProductsCountAndGrowth();
  }, []);
  const adminCount = users.filter((user) => user.roleId === 2).length;

  return (
    <div className="flex flex-wrap">
      <div className="mt-4 w-full lg:w-6/12 xl:w-3/12 px-5 mb-4">
        <div className="relative flex flex-col min-w-0 break-words bg-gray-900 rounded mb-3 xl:mb-0 shadow-lg">
          <div className="flex-auto p-4">
            <div className="flex flex-wrap">
              <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                <h5 className="text-white uppercase font-bold text-xs">
                  {" "}
                  Users
                </h5>
                <span className="font-semibold text-xl text-white">
                  {users.length}
                </span>
              </div>
              <div className="relative w-auto pl-4 flex-initial">
                <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full  bg-red-500">
                  <i className="fas fa-users"></i>
                </div>
              </div>
            </div>
            <p className="text-sm text-white mt-4">
              <span
                className={
                  growth >= 0 ? "text-green-500 mr-2" : "text-red-500 mr-2"
                }
              >
                <i
                  className={
                    growth >= 0 ? "fas fa-arrow-up" : "fas fa-arrow-down"
                  }
                ></i>{" "}
                {Math.abs(growth).toFixed(2)}%{" "}
              </span>
              <span className="whitespace-nowrap"> Since yesterday </span>
            </p>
          </div>
        </div>
      </div>

      <div className=" mt-4 w-full lg:w-6/12 xl:w-3/12 px-5">
        <div className="relative flex flex-col min-w-0 break-words bg-gray-900 rounded mb-4 xl:mb-0 shadow-lg">
          <div className="flex-auto p-4">
            <div className="flex flex-wrap">
              <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                <h5 className="text-white uppercase font-bold text-xs">
                  Admins (Pharmacists)
                </h5>
                <span className="font-semibold text-xl text-white">
                  {adminCount}
                </span>
              </div>
              <div className="relative w-auto pl-4 flex-initial">
                <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full  bg-pink-500">
                  <i className="fas fa-user"></i>
                </div>
              </div>
            </div>
            <p className="text-sm text-white mt-4">
              <span
                className={
                  adminGrowth >= 0 ? "text-green-500 mr-2" : "text-red-500 mr-2"
                }
              >
                <i
                  className={
                    adminGrowth >= 0 ? "fas fa-arrow-up" : "fas fa-arrow-down"
                  }
                ></i>{" "}
                {Math.abs(adminGrowth).toFixed(2)}%{" "}
              </span>
              <span className="whitespace-nowrap"> Since yesterday </span>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 w-full lg:w-6/12 xl:w-3/12 px-5">
        <div className="relative flex flex-col min-w-0 break-words bg-gray-900 rounded mb-6 xl:mb-0 shadow-lg">
          <div className="flex-auto p-4">
            <div className="flex flex-wrap">
              <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                <h5 className="text-white uppercase font-bold text-xs">
                  Pharmacies
                </h5>
                <span className="font-semibold text-xl text-white">
                  {pharmacyCount}
                </span>
              </div>
              <div className="relative w-auto pl-4 flex-initial">
                <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full  bg-purple-500">
                  <i className="fa-solid fa-prescription-bottle-medical"></i>
                </div>
              </div>
            </div>
            <p className="text-sm text-white mt-4">
              <span
                className={
                  pharmacyGrowth >= 0
                    ? "text-green-500 mr-2"
                    : "text-red-500 mr-2"
                }
              >
                <i
                  className={
                    pharmacyGrowth >= 0
                      ? "fas fa-arrow-up"
                      : "fas fa-arrow-down"
                  }
                ></i>{" "}
                {Math.abs(pharmacyGrowth).toFixed(2)}%{" "}
              </span>
              <span className="whitespace-nowrap"> Since yesterday </span>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 w-full lg:w-6/12 xl:w-3/12 px-5">
        <div className="relative flex flex-col min-w-0 break-words bg-gray-900 rounded mb-6 xl:mb-0 shadow-lg">
          <div className="flex-auto p-4">
            <div className="flex flex-wrap">
              <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                <h5 className="text-white uppercase font-bold text-xs">
                  Products
                </h5>
                <span className="font-semibold text-xl text-white">
                {productsCount}
                </span>
              </div>
              <div className="relative w-auto pl-4 flex-initial">
                <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full  bg-emerald-500">
                  <i className="fa-solid fa-prescription-bottle"></i>
                </div>
              </div>
            </div>
            <p className="text-sm text-white mt-4">
            <span
                className={
                  productsGrowth >= 0
                    ? "text-green-500 mr-2"
                    : "text-red-500 mr-2"
                }
              >
                <i
                  className={
                    productsGrowth >= 0
                      ? "fas fa-arrow-up"
                      : "fas fa-arrow-down"
                  }
                ></i>{" "}
                {Math.abs(productsGrowth).toFixed(2)}%{" "}
              </span>
              <span className="whitespace-nowrap"> Since yesterday </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsCards;
