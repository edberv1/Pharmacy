import { useEffect, useState } from "react";
import CreateUserModal from "./UserModal/CreateUserModal";
import DeleteUserModal from "./UserModal/DeleteUserModal";
import EditUserModal from "./UserModal/EditUserModal";

function UserTable() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Added state for dropdown visibility

  const itemsPerPage = 5;
  const roles = ["superadmin", "admin", "user"];

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
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:8081/superAdmin/getAllUsers",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-access-token": token,
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

    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = users.filter((user) =>
      `${user.firstname} ${user.lastname}`.toLowerCase().includes(searchInput.toLowerCase())
    );
    if (selectedRole) {
      filtered = filtered.filter((user) => user.roleId === selectedRole);
    }
    setFilteredUsers(filtered);
  }, [searchInput, users, selectedRole]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleShowAll = () => {
    setSelectedRole(null);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // eslint-disable-next-line no-unused-vars
  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <div className="mx-auto max-w-screen-xl mr-4 rounded-xl pb-32 pt-2 bg-gray-200  px-4 lg:px-12">
        <div className=" rounded-sm flex " ><h1 className="text-3xl font-semibold ">Users</h1></div>
        <hr className="size-1 flex w-full mb-4 bg-gray-800 rounded-full " />
        <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
            <div className="w-full md:w-1/2">
              <form className="flex items-center">
                <label htmlFor="simple-search" className="sr-only">
                  Search
                </label>
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5 text-gray-500 dark:text-gray-400"
                      fillRule="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
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
                  <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="filterDropdownButton">
                    <button
                      onClick={handleShowAll}
                      className="block px-4 py-2 text-sm  w-full text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-white dark:hover:bg-gray-600"
                      role="menuitem"
                    >
                      Show All
                    </button>
                    {roles.map((role, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedRole(index + 1)}
                        className="block px-4 py-2 text-sm w-full text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-white dark:hover:bg-gray-600"
                        role="menuitem"
                      >
                        {role}
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
                    User Details
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Email
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
                {currentItems.map((user) => (
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
                      {user.roleId === 1
                        ? "superadmin"
                        : user.roleId === 2
                        ? "admin"
                        : "user"}
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
          <nav className="flex justify-center my-4">
            <ul className="flex items-center space-x-2">
              <li>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <span className="sr-only">Previous</span>
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    fillRule="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10l-3.293-3.293a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </li>
              {[...Array(Math.ceil(filteredUsers.length / itemsPerPage)).keys()].map((number) => (
                <li key={number}>
                  <button
                    onClick={() => handlePageChange(number + 1)}
                    className={`flex items-center justify-center text-sm py-2 px-3 leading-tight ${currentPage === number + 1 ? 'text-primary-600 bg-primary-50 border border-primary-300 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white' : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'}`}
                  >
                    {number + 1}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <span className="sr-only">Next</span>
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    fillRule="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10l-3.293-3.293a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}

export default UserTable;
