import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../../contexts/UserContexts";
import { Menu, Transition } from "@headlessui/react";

function Navbar() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const handleLogout = () => {
    if (window.confirm("Confirm Logout?")) {
      setUser({ email: null, posts: [] });
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("email");
      localStorage.removeItem("userId");
      navigate("/");
    }
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
            <div className="w-full">
              <input
                type="text"
                id="email-adress-icon"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2"
                placeholder="Search..."
              />
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
