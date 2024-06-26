/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import CreateUserModal from "./UserModal/CreateUserModal";
import DeleteUserModal from "./UserModal/DeleteUserModal";
import EditUserModal from "./UserModal/EditUserModal";
import Pagination from "./Pagination";
import fetchWithTokenRefresh from "../../../../utils/fetchWithTokenRefresh";

function UserTable() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Added state for dropdown visibility
  const [roles, setRoles] = useState([]); // State to store fetched roles
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openEditModal = (user) => {
    setIsEditModalOpen(true);
    setSelectedUser(user);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  const openDeleteModal = (userId) => {
    setUserIdToDelete(userId);
  };

  const closeDeleteModal = () => {
    setUserIdToDelete(null);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetchWithTokenRefresh(
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
        setFilteredUsers(data);
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    };

    const fetchRoles = async () => {
      try {
        const response = await fetchWithTokenRefresh(
          "http://localhost:8081/superAdmin/getAllRoles",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );

        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage);
        }

        const dataRoles = await response.json();
        setRoles(dataRoles); // Assuming the backend returns an array of user objects with 'id' and 'name' fields
      } catch (error) {
        console.error("Failed to fetch roles ids:", error);
        // setError("Failed to fetch roles ids.");
      }
    };

    fetchUsers();
    fetchRoles();
  }, []);

  const roleOptions =
    roles && roles.length > 0
      ? roles.map((role, index) => (
          <button
            className="block px-4 py-2 text-sm w-full text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-white dark:hover:bg-gray-600"
            role="menuitem"
            onClick={() => setSelectedRole(role)}
            key={role.id} // Assuming role.id is unique
            value={role.id} // Assuming role.id is the value you want to assign
          >
            {role.role} {/* Assuming role.name contains the display name */}
          </button>
        ))
      : null;

  useEffect(() => {
    // Filter users based on search input and selected role
    let filtered = users.filter((user) =>
      `${user.firstname} ${user.lastname} ${user.email} ${user.id}`
        .toLowerCase()
        .includes(searchInput.toLowerCase())
    );

    if (selectedRole !== null) {
      // If a role is selected, filter users based on the selected role ID
      filtered = filtered.filter((user) => user.roleId === selectedRole.id); // Assuming selectedRole is an object with an 'id' field
    }

    setFilteredUsers(filtered);
  }, [searchInput, users, selectedRole]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

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
    setSelectedRole(null);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > Math.ceil(users.length / itemsPerPage)) return;
    setCurrentPage(newPage);
  };

  const usersToShow = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const downloadUsersExcel = async () => {
    try {
      const response = await fetchWithTokenRefresh(
        "http://localhost:8081/superAdmin/generateExcel",
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      let url = window.URL.createObjectURL(blob);
      let a = document.createElement("a");
      a.href = url;
      a.download = "Users.xlsx";
      a.click();
    } catch (error) {
      console.error("Error downloading users Excel: ", error);
    }
  };

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
          onClick={downloadUsersExcel}
          type="button"
          id="generate-excel"
          className="flex items-center justify-center text-white bg-yellow-700 hover:bg-yellow-800 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-yellow-600 dark:hover:bg-yellow-700 focus:outline-none dark:focus:ring-yellow-800"
        >
          <i className="fa-solid fa-download pr-2"></i>
          Generate Excel
        </button>
              <button
                type="button"
                id="create-user-button"
                onClick={openModal}
                className="flex items-center justify-center text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
              >
                <i className="fa-solid fa-user-plus pr-2"> </i>
                Create User
              </button>
              <CreateUserModal isOpen={isModalOpen} onClose={closeModal} />
              <div className="relative">
                <button
                  id="filterDropdownButton"
                  onClick={toggleDropdown}
                  className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-white bg-gray-800 rounded-lg border border-gray-200 hover:bg-gray-700 focus:outline-none dark:bg-gray-600 dark:border-gray-600 dark:hover:bg-gray-700"
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

                    {roleOptions}
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
                    User Details
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Email
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Verified
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Role
                  </th>
                  <th scope="col" className="px-4 py-3 flex justify-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {usersToShow.map((user) => (
                  <tr className="border-b dark:border-gray-700" key={user.id}>
                    <th
                      scope="row"
                      className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {user.id}
                    </th>
                    <td className="px-4 py-3">
                      {user.firstname} {user.lastname}
                    </td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">
                      {user.verified === 1 ? (
                        <span style={{ color: "green" }}>✔️</span>
                      ) : (
                        <span style={{ color: "red" }}>❌</span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {user.roleId
                        ? roles.find((role) => role.id === user.roleId)?.role ||
                          "Unknown"
                        : "No Role Assigned"}
                    </td>

                    <td className="px-4 py-3 flex items-center justify-evenly">
                      <div className="flex items-center space-x-4">
                        <button
                          type="button"
                          onClick={() => openEditModal(user)}
                          data-drawer-target="drawer-update-product"
                          data-drawer-show="drawer-update-product"
                          aria-controls="drawer-update-product"
                          className="py-2 px-3 flex items-center text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                          <i className="fa-solid fa-pen-to-square pr-2"></i>
                          Edit
                        </button>
                        {isEditModalOpen && selectedUser && (
                          <EditUserModal
                            isOpen={isEditModalOpen}
                            onClose={closeEditModal}
                            user={selectedUser}
                          />
                        )}

                        <DeleteUserModal
                          isOpen={userIdToDelete === user.id}
                          onClose={closeDeleteModal}
                          userId={user.id}
                        />
                        <button
                          type="button"
                          onClick={() => openDeleteModal(user.id)}
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
            totalPages={Math.ceil(users.length / itemsPerPage)}
            handlePageChange={handlePageChange}
          />
        </div>
      </div>
    </>
  );
}

export default UserTable;
