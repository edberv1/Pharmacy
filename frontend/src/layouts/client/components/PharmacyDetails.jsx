/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */

import { Fragment, useState, useEffect } from "react";
import { Dialog, Disclosure, Menu, Transition } from "@headlessui/react";
import { Link, useParams } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
  Squares2X2Icon,
} from "@heroicons/react/20/solid";
import Pagination from "../../superadmin/components/Pagination";

// const sortOptions = [
//   { name: "Most Popular", href: "#", current: true },
//   { name: "Best Rating", href: "#", current: false },
//   { name: "Newest", href: "#", current: false },
//   { name: "Oldest", href: "#", current: false },
// ];
// const subCategories = [
//   { name: "Private", href: "#" },
//   { name: "Public", href: "#" },
//   { name: "Close to hospital", href: "#" },
//   { name: "Something", href: "#" },
//   { name: "Something else", href: "#" },
// ];
// const filters = [
//   // {
//   //   id: "type",
//   //   name: "Type",
//   //   options: [
//   //     { value: "white", label: "White", checked: false },
//   //     { value: "beige", label: "Beige", checked: false },
//   //     { value: "blue", label: "Blue", checked: false },
//   //     { value: "brown", label: "Brown", checked: false },
//   //     { value: "green", label: "Green", checked: false },
//   //     { value: "purple", label: "Purple", checked: false },
//   //   ],
//   // },
//   // {
//   //   id: "category",
//   //   name: "Category",
//   //   options: [
//   //     { value: "new-arrivals", label: "New Arrivals", checked: false },
//   //     { value: "sale", label: "Sale", checked: false },
//   //     { value: "travel", label: "Travel", checked: true },
//   //     { value: "organization", label: "Organization", checked: false },
//   //     { value: "accessories", label: "Accessories", checked: false },
//   //   ],
//   // },
//   {
//     id: "name",
//     name: "Name",
//     options: filterOptions,
//   },
// ];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Pharmacies() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Number of pharmacies to show per page
  const { id } = useParams(); // Access the pharmacy id from URL parameter
  const [pharmacy, setPharmacyDetails] = useState(null);
  const [products, setProducts] = useState([]);
  const [filterOptions, setFilterOptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  

  useEffect(() => {
    const fetchPharmacyDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:8081/users/pharmacies/${id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPharmacyDetails(data);
      } catch (error) {
        console.error("Error fetching pharmacy details:", error);
      }
    };

    fetchPharmacyDetails();
  }, [id]); // Make sure to include id in the dependency array to re-fetch details when id changes

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `http://localhost:8081/users/${id}/products`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Filter out products with duplicate names
        const uniqueProducts = [];
        const seenNames = new Set();
  
        data.forEach((product) => {
          if (!seenNames.has(product.name)) {
            seenNames.add(product.name);
            uniqueProducts.push(product);
          }
        });
  
        setProducts(uniqueProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
  
    fetchProducts();
  }, [id]);
  

  useEffect(() => {
    const uniqueNames = [...new Set(products.map(product => product.name))].sort();
    const options = uniqueNames.map(name => ({ value: name, label: name, checked: false }));
    
    setFilterOptions(options);
  }, [products]);

  const filters = [
    {
      id: "name",
      name: "Name",
      options: filterOptions,
    },
  ];

  if (!pharmacy) {
    return <div>Loading...</div>;
  }

  // Function to handle page changes
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate the total number of pages
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const filteredProducts = products.filter((product) => {
    // If no filter options are selected and no search query is entered, show all products
    if (
      filterOptions.every((option) => !option.checked) &&
      searchQuery.trim() === ""
    ) {
      return true;
    }
  
    // Check if the product name matches any selected filter option and search query
    return (
      (filterOptions.some(
        (option) => option.checked && option.value === product.name
      ) ||
        filterOptions.every((option) => !option.checked)) &&
      product.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );
  });
  


  // Get the products for the current page
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const clearFilters = () => {
    setFilterOptions(filterOptions.map(option => ({ ...option, checked: false })));
    setSearchQuery(""); // Clear the search query
  };

  return (
    <div className="bg-gray-100">
      <div>
        {/* Mobile filter dialog */}
        <Transition.Root show={mobileFiltersOpen} as={Fragment}>
          <Dialog
            className="relative z-40 lg:hidden"
            onClose={setMobileFiltersOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                  <div className="flex items-center justify-between px-4">
                    <h2 className="text-lg font-medium text-gray-900">
                      Filters
                    </h2>
                    <button
                      type="button"
                      className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Filters */}
                  <form className="mt-4 border-t border-gray-200">
                    <h3 className="sr-only">Categories</h3>

                    {filters.map((section) => (
                      <Disclosure
                        as="div"
                        key={section.id}
                        className="border-t border-gray-200 px-4 py-6"
                      >
                        {({ open }) => (
                          <>
                            <h3 className="-mx-2 -my-3 flow-root">
                              <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                                <span className="font-medium text-gray-900">
                                  {section.name}
                                </span>
                                <span className="ml-6 flex items-center">
                                  {open ? (
                                    <MinusIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  ) : (
                                    <PlusIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  )}
                                </span>
                              </Disclosure.Button>
                            </h3>
                            <Disclosure.Panel className="pt-6">
                              <div className="space-y-6">
                                {section.options.map((option, optionIdx) => (
                                  <div
                                    key={option.value}
                                    className="flex items-center"
                                  >
                                    <input
                                      id={`filter-mobile-${section.id}-${optionIdx}`}
                                      name={`${section.id}[]`}
                                      defaultValue={option.value}
                                      type="checkbox"
                                      defaultChecked={option.checked}
                                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <label
                                      htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                      className="ml-3 min-w-0 flex-1 text-gray-500"
                                    >
                                      {option.label}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    ))}
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                <li className="inline-flex items-center">
                  <Link
                    to="/"
                    className="inline-flex items-center text-sm font-medium text-gray-900 hover:text-blue-900 dark:text-gray-900 dark:hover:text-gray-600"
                  >
                    <svg
                      className="w-3 h-3 me-2.5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                    </svg>
                    Home
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg
                      className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 6 10"
                    >
                      <path stroke="currentColor" d="m1 9 4-4-4-4" />
                    </svg>
                    <Link
                      to="/pharmacies"
                      className="ms-1 text-sm font-medium text-gray-900 hover:text-blue-900 md:ms-2 dark:text-gray-900 dark:hover:text-gray-600"
                    >
                      Pharmacies
                    </Link>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg
                      className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 6 10"
                    >
                      <path stroke="currentColor" d="m1 9 4-4-4-4" />
                    </svg>
                    <a className="ms-1 text-sm font-medium text-gray-900 hover:text-blue-900 md:ms-2 dark:text-gray-900 dark:hover:text-gray-600">
                      {pharmacy ? pharmacy.name : "Loading..."}
                    </a>
                  </div>
                </li>
              </ol>
            </nav>

            <div className="flex items-center">
              <Menu as="div" className="relative inline-block text-left">
              <div>
                    <div className="relative pl-1">
                      <input
                        className="appearance-none border-2 pl-10 border-gray-300 hover:border-gray-400 transition-colors rounded-md w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-purple-600 focus:border-purple-600 focus:shadow-outline"
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />

                      <div className="absolute left-0 inset-y-0 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 ml-3 text-gray-400 hover:text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                {/* <div>
                  <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                    Sort
                    <ChevronDownIcon
                      className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                  </Menu.Button>
                </div> */}

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {/* <div className="py-1">
                      {sortOptions.map((option) => (
                        <Menu.Item key={option.name}>
                          {({ active }) => (
                            <a
                              href={option.href}
                              className={classNames(
                                option.current
                                  ? "font-medium text-gray-900"
                                  : "text-gray-500",
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm"
                              )}
                            >
                              {option.name}
                            </a>
                          )}
                        </Menu.Item>
                      ))}
                    </div> */}
                  </Menu.Items>
                </Transition>
              </Menu>
              <button
                type="button"
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pb-24 pt-6">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="flex flex-col lg:flex-row gap-x-8 gap-y-10">
              {/* Filters */}
              <div className="lg:w-1/4">
                <form className="hidden lg:block">
                  <h3 className="sr-only">Categories</h3>
                  {filters.map((section) => (
                    <Disclosure
                      as="div"
                      key={section.id}
                      className="border-b border-gray-200 py-6"
                    >
                      {({ open }) => (
                        <>
                          <h3 className="-my-3 flow-root">
                            <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                              <span className="font-medium text-gray-900">
                                {section.name}
                              </span>
                              <span className="ml-6 flex items-center">
                                {open ? (
                                  <MinusIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <PlusIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                )}
                              </span>
                            </Disclosure.Button>
                          </h3>
                          <Disclosure.Panel className="pt-6">
                            <div className="space-y-4">
                              {section.options.map((option, optionIdx) => (
                                <div
                                  key={option.value}
                                  className="flex items-center"
                                >
                                  <input
                                    id={`filter-${section.id}-${optionIdx}`}
                                    name={`${section.id}[]`}
                                    defaultValue={option.value}
                                    type="checkbox"
                                    onChange={(e) => {
                                      const updatedOptions = [...filterOptions];
                                      updatedOptions[optionIdx].checked = e.target.checked;
                                      setFilterOptions(updatedOptions);
                                    }}
                                    defaultChecked={option.checked}
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                  />
                                  <label
                                    htmlFor={`filter-${section.id}-${optionIdx}`}
                                    className="ml-3 text-sm text-gray-600"
                                  >
                                    {option.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  ))}
                </form>
              </div>
              <div className="lg:w-3/4">
                {currentProducts.map((product) => (
                  <div key={`${pharmacy.id}-${product.id}`} className="relative m-10 flex w-full max-w-xs flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md">
                    <a
                      className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl"
                      href="#"
                    >
                      {" "}
                      {product.stock <= 0 && (
                        <span className="py-1 min-[400px]:py-2 px-2 min-[400px]:px-4 cursor-pointer rounded-lg bg-red-600 font-medium text-base leading-7 text-white absolute top-3 right-3 z-10">
                          Out of stock
                        </span>
                      )}
                      <img
                        className="object-cover"
                        src={`http://localhost:8081/users/${product.image.replace(/\\/g, '/')}`}
                        alt="product image"
                      />
                    </a>
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
                      <div className="mt-2 mb-5 flex items-center justify-between">
                        <Link
                          to={`/pharmacies/${pharmacy.id}/products/${product.id}`}
                          className="flex items-center justify-center rounded-md bg-gray-200 px-5 py-2.5 text-center text-sm font-medium text-slate-900 hover:bg-gray-900 hover:text-white"
                        >
                          View Product
                        </Link>
                        <a
                          href="#"
                          className="flex items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  handlePageChange={handlePageChange}
                />
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}