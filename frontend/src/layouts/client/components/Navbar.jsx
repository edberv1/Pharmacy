import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../../contexts/UserContexts";
import { Menu, Transition } from "@headlessui/react";

function Navbar() {
  const { user, setUser } = useContext(UserContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [productSuggestions, setProductSuggestions] = useState([]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setProductSuggestions([]);
  };

  useEffect(() => {
    if (searchQuery !== "") {
      fetch(
        `http://localhost:8081/users/searchProducts?query=${encodeURIComponent(
          searchQuery
        )}`
      )
        .then((response) => response.json())
        .then((data) => setProductSuggestions(data))
        .catch((error) => console.error(error));
    } else {
      setProductSuggestions([]);
    }
  }, [searchQuery]);

  const handleLogout = () => {
    // Call the logout API
    fetch("http://localhost:8081/users/logoutUser", {
      method: "POST", // or 'DELETE'
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({ token: localStorage.getItem("token") }), // send the token in the request body
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.auth === false && data.token === null) {
          // Remove the token from local storage
          localStorage.removeItem("token");
          localStorage.removeItem("email");
          localStorage.removeItem("role");
          // Redirect the user to the login page (or wherever you want)
          window.location.href = "/";
        }
      });
  };

  useEffect(() => {
    // This function will run whenever the user state changes
  }, [user]);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-gray-900 text-white">
        <div className="flex flex-wrap justify-around items-center mx-auto max-w-screen-xl p-4">
          <Link
            to="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              className="h-8"
              alt="Flowbite Logo"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Pharmacy
            </span>
          </Link>
          {user.email ? (
            <div className="flex items-center w-3/4 space-x-2 rtl:space-x-reverse">
              <div className="w-full relative">
                <input
                  type="text"
                  id="search"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                {productSuggestions.length > 0 && (
                  <div className="absolute top-full mt-2 w-full bg-white z-50 border border-gray-200 rounded shadow-lg">
                    {productSuggestions.map((product) => (
                      <Link
                        to={`/pharmacies/${product.pharmacyId}/products/${product.id}`}
                        key={product.id}
                        className="p-2 border-b border-gray-200 flex items-start"
                        onClick={clearSearch}
                      >
                        <img
                          src={`http://localhost:8081/${product.image.replace(
                            "\\",
                            "/"
                          )}`}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="ml-4">
                          <h2 className="text-lg font-semibold text-black">
                            {product.name}
                          </h2>
                          <p className="text-sm text-gray-600">
                            {product.description}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 pl-2">
                <Link
                  to="/cart"
                  className="text-md text-white dark:text-white-500 hover:underline"
                >
                  <i className="fa-solid fa-cart-shopping"></i>
                </Link>

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={React.Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/profile"
                            className={`block px-4 py-2 text-sm text-gray-700 ${
                              active ? "bg-gray-100" : ""
                            }`}
                          >
                            Your Profile
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={`block px-4 py-2 text-sm text-gray-700 ${
                              active ? "bg-gray-100" : ""
                            }`}
                          >
                            Settings
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            onClick={handleLogout}
                            className={`block px-4 py-2 text-sm text-gray-700 ${
                              active ? "bg-gray-100" : ""
                            }`}
                          >
                            Sign out
                          </a>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          ) : (
            <div className="flex items-center w-3/4 space-x-2 rtl:space-x-reverse">
              <div className="w-3/4">
                <input
                  type="text"
                  id="email-adress-icon"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2"
                  placeholder="Search..."
                />
              </div>

              <div className="flex items-center space-x-6 rtl:space-x-reverse pl-4">
                <Link
                  to="/signup"
                  className="text-md  text-white dark:text-white-500 hover:underline"
                >
                  <i className="fa-solid fa-user pr-2"></i>
                  Sign Up
                </Link>

                <span>
                  <Link
                    to="/login"
                    className="text-md pl-2 text-white dark:text-white-500 hover:underline "
                  >
                    <i className="fa-solid text-white fa-right-to-bracket pr-2"></i>
                    Login
                  </Link>
                </span>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
