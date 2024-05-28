/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import MyPharmacyCard from "../components/MyPharmacyCard";
import CreatePharmacyAdminModal from "../components/PharmacyAdminModal/CreatePharmacyAdminModal";
import Alert from "../components/Alert"; 


function MyPharmacies() {
  const [pharmacies, setPharmacies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredPharmacies, setFilteredPharmacies] = useState([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [selectedPharmacyLocation, setSelectedPharmacyLocation] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Added state for dropdown visibility

  const [searchInput, setSearchInput] = useState("");

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

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
  }, [pharmacies]);

  useEffect(() => {
    let filtered = pharmacies.filter((pharmacy) =>
      `${pharmacy.name} ${pharmacy.location} ${pharmacy.id} ${pharmacy.userId}`
        .toLowerCase()
        .includes(searchInput.toLowerCase())
    );
    if (selectedPharmacyLocation !== null) {
      filtered = filtered.filter(
        (pharmacy) => pharmacy.location === selectedPharmacyLocation); // Filter by pharmacy.location === selectedPharmacy
    }
    setFilteredPharmacies(filtered);
  }, [searchInput, pharmacies, selectedPharmacyLocation]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      // Check if the click is outside the dropdown
      if (!event.target.closest("#filterDropdownButton")) {
        setIsDropdownOpen(false);
      }
    };

    // Add event listener when dropdown is open
    if (isDropdownOpen) {
      document.body.addEventListener("click", handleOutsideClick);
    } else {
      // Remove event listener when dropdown is closed
      document.body.removeEventListener("click", handleOutsideClick);
    }

    // Clean up event listener on component unmount
    return () => {
      document.body.removeEventListener("click", handleOutsideClick);
    };
  }, [isDropdownOpen]);

  const handleShowAll = () => {
    setSelectedPharmacyLocation(null);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <>
      <div>
        <div className="container font-light text-4xl flex flex-wrap py-6 justify-center min-h-4">
          <h1>My Pharmacies</h1>
        </div>
        <div className="flex pl-9 w-full">
                <div className="relative flex w-1/3 ml-6">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <i className="fa-solid text-white fa-magnifying-glass"></i>
                  </div>
                  <input
                    type="text"
                    id="simple-search"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Search"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    required=""
                  />
                </div>
                <div className="relative w-1/2 ml-4 ">
                <button
                  id="filterDropdownButton"
                  onClick={toggleDropdown}
                  className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-md font-medium text-white bg-gray-800 rounded-lg border border-gray-200 hover:bg-gray-700 focus:outline-none dark:bg-gray-600 dark:border-gray-600 dark:hover:bg-gray-700"
                  type="button"
                >
                  Filter
                  <svg
                    className="-mr-1 ml-1.5 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    />
                  </svg>
                </button>
                <div
                  className={`${
                    isDropdownOpen ? "" : "hidden"
                  } origin-top-right absolute  mt-2 w-32 rounded-md bg-white shadow-lg dark:bg-gray-700 ring-1 ring-black ring-opacity-5`}
                >
                  <div
                    className="py-1"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="filterDropdownButton"
                  >
                    <button
                      onClick={handleShowAll}
                      className="block  px-4 py-2 text-sm  w-full text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-white dark:hover:bg-gray-600"
                      role="menuitem"
                    >
                      Show All
                    </button>
                   
                    {pharmacies
                      .reduce((uniqueLocations, pharmacy) => {
                        if (!uniqueLocations.includes(pharmacy.location)) {
                          uniqueLocations.push(pharmacy.location);
                        }
                        return uniqueLocations;
                      }, [])
                      .map((location, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedPharmacyLocation(location)}
                          className="block px-4 py-2 text-sm  w-full text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-white dark:hover:bg-gray-600"
                          role="menuitem"
                        >
                          {location}
                        </button>
                      ))}
                  </div>
                </div>
              </div>
              
              <button
                type="button"
                onClick={openModal}
                className="flex items-center w-44 text-md justify-end text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg  px-4 py-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
              >
                <i className="fa-solid fa-prescription-bottle-medical pr-2"></i>
                Create Pharmacy
              </button>
              
              <CreatePharmacyAdminModal isOpen={isModalOpen} onClose={closeModal} />
              
              </div>
        {pharmacies.length === 0 ? (
          <p>No pharmacies found for the user</p>
        ) : (
          <div className="flex flex-col min-h-screen">
            <div className="container flex flex-wrap justify-around px-6 pt-14 mx-auto">
              {filteredPharmacies.map((pharmacy) => (
                <MyPharmacyCard key={pharmacy.id} id={pharmacy.id} name={pharmacy.name} location={pharmacy.location} street={pharmacy.street}/>               
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default MyPharmacies;
