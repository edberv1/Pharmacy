import React, { useState, useEffect } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

export default function Header() {
  const [notificationCount, setNotificationCount] = useState(0);
  const [pendingUsers, setPendingUsers] = useState([]);

  useEffect(() => {
    // Fetch the number of pending licenses from the backend
    fetch("http://localhost:8081/superAdmin/pendingCount", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setNotificationCount(data.count);
      });

    // Fetch the emails of the users with pending licenses
    fetch("http://localhost:8081/superAdmin/fetchPendingLicenses", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setPendingUsers(data.data);
      });
  }, []);

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

  return (
    <Disclosure as="nav" className="dark:bg-gray-900 dark:border-gray-700">
      <>
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="flex flex-1 text-white items-center justify-center sm:items-stretch sm:justify-start">
              Welcome Superadmin
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              {/* Notification dropdown */}
              <Menu as="div" className="relative ml-3">
                <div>
                  <Menu.Button className="relative flex rounded-full text-sm">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-7 w-7 text-white" aria-hidden="true" />
                    {notificationCount > 0 && (
                      <span
                        className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full"
                      >
                        {notificationCount}
                      </span>
                    )}
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
                    {pendingUsers.map((user, index) => (
                      <Menu.Item key={index}>
                        {({ active }) => (
                          <Link
                            to="/superadmin/requests"
                            className={`block px-4 py-2 text-sm text-gray-700 ${
                              active ? "bg-gray-100" : ""
                            }`}
                          >
                            New Request From: {user.email}
                          </Link>
                        )}
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </Transition>
              </Menu>

              {/* Profile dropdown */}
              <Menu as="div" className="relative ml-6">
                <div>
                  <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm">
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
        </div>
      </>
    </Disclosure>
  );
}
