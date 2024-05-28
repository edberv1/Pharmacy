/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Pagination from "../../superadmin/components/Pagination";
import CreateProductModal from "./ProductModal/CreateProductModal";
import EditProductModal from "./ProductModal/EditProductModal";
import DeleteProductModal from "./ProductModal/DeleteProductModal";

function ProductsTable() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pharmacies, setPharmacies] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductName, setSelectedProductName] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openEditModal = (product) => {
    setIsEditModalOpen(true);
    setSelectedProduct(product);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedProduct(null);
  };

  const openDeleteModal = (productId) => {
    setProductIdToDelete(productId);
  };

  const closeDeleteModal = () => {
    setProductIdToDelete(null);
  };

  const handleShowAll = () => {
    setSelectedProductName(null);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:8081/admin/getAllProducts",
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
        setFilteredProducts(data);
      } catch (error) {
        console.error("Error fetching pharmacies: ", error);
      }
    };
    const fetchPharmacies = async () => {
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
      } catch (error) {
        console.error("Error fetching pharmacies: ", error);
      }
    };

    fetchProducts();
    fetchPharmacies();
  }, [products]);


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

  useEffect(() => {
    let filtered = products.filter((product) =>
      `${product.name} ${product.produced} ${product.id} ${product.pharmacyId} ${product.stock}`
        .toLowerCase()
        .includes(searchInput.toLowerCase())
    );
    if (selectedProductName !== null) {
      filtered = filtered.filter((product) => product.name === selectedProductName); // Filter by product name
    }
    setFilteredProducts(filtered);
  }, [searchInput, products, selectedProductName]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > Math.ceil(products.length / itemsPerPage))
      return;
    setCurrentPage(newPage);
  };
  const productsToShow = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <div className="mx-auto max-w-screen-xl pt-16">
        <div className="bg-white dark:bg-gray-900 relative shadow-md sm:rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
            <div className="w-full md:w-1/2">
              <form className="flex items-center">
                <label htmlFor="simple-search" className="sr-only">
                  Search
                </label>
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <i className="fa-solid text-white fa-magnifying-glass"></i>
                  </div>
                  <input
                    type="text"
                    id="simple-search"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Search"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    required=""
                  />
                </div>
              </form>
            </div>

            <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
              <button
                type="button"
                onClick={openModal}
                className="flex items-center justify-center text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
              >
                <i className="fa-solid fa-user-plus pr-2"></i>
                Create Product
              </button>
              <CreateProductModal isOpen={isModalOpen} onClose={closeModal} />
              <div className="relative">
                <button
                  id="filterDropdownButton"
                  onClick={toggleDropdown}
                  className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  type="button"
                >
                  Filter
                  <svg
                    className="-mr-1 ml-1.5 w-5 h-5"
                    fillRule="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
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
                  } origin-top-right absolute  right-0 mt-2 w-auto rounded-md bg-white shadow-lg dark:bg-gray-700 ring-1 ring-black ring-opacity-5`}
                >
                  <div
                    className="py-1"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="filterDropdownButton"
                  >
                    <button
                      onClick={handleShowAll}
                      className="block px-4 py-2 text-sm  w-full text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-white dark:hover:bg-gray-600"
                      role="menuitem"
                    >
                      Show All
                    </button>

                    {products
                      .reduce((uniqueNames, product) => {
                        if (!uniqueNames.includes(product.name)) {
                          uniqueNames.push(product.name);
                        }
                        return uniqueNames;
                      }, [])
                      .map((name, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedProductName(name)}
                          className="block px-4 py-2 text-sm  w-full text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-white dark:hover:bg-gray-600"
                          role="menuitem"
                        >
                          {name}
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-4 py-3">
                    ID
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Produced
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Pharmacy Name
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Stock
                  </th>
                  <th scope="col" className="px-4 py-3 flex justify-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {productsToShow.map((product) => (
                  <tr
                    className="border-b dark:border-gray-700"
                    key={product.id}
                  >
                    <th
                      scope="row"
                      className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {product.id}
                    </th>
                    <td className="px-4 py-3">{product.name}</td>

                    <td className="px-4 py-3">{product.produced}</td>
                    <td className="px-4 py-3">
                      {product.pharmacyId
                        ? pharmacies.find(
                            (pharmacy) => pharmacy.id === product.pharmacyId
                          )?.name || "Unknown"
                        : "No Pharmacy Assigned"}
                    </td>

                    <td className="px-4 py-3">{product.stock}</td>

                    <td className="px-4 py-3 flex items-center justify-evenly">
                      <div className="flex items-center space-x-4">
                        <button
                          type="button"
                          onClick={() => openEditModal(product)}
                          data-drawer-target="drawer-update-product"
                          data-drawer-show="drawer-update-product"
                          aria-controls="drawer-update-product"
                          className="py-2 px-3 flex items-center text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                          <i className="fa-solid fa-pen-to-square pr-2"></i>
                          Edit
                        </button>

                        {isEditModalOpen && selectedProduct && (
                          <EditProductModal
                            isOpen={isEditModalOpen}
                            onClose={closeEditModal}
                            product={selectedProduct}
                          />
                        )}

                         <DeleteProductModal
                          isOpen={productIdToDelete === product.id}
                          onClose={closeDeleteModal}
                          productId={product.id}
                        /> 
                        <button
                          type="button"
                          onClick={() => openDeleteModal(product.id)}
                          data-modal-target="delete-modal"
                          data-modal-toggle="delete-modal"
                          className="flex items-center text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                        >
                          <i className="fa-solid fa-trash pr-2"></i>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(products.length / itemsPerPage)}
            handlePageChange={handlePageChange}
          />
        </div>
      </div>
    </>
  );
}

export default ProductsTable;
