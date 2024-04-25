/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { useEffect, useState, useRef } from "react";
import CreateRoleModal from "./RoleModal/CreateRoleModal";
import EditRoleModal from "./RoleModal/EditRoleModal";
import DeleteRoleModal from "./RoleModal/DeleteRoleModal";

function RoleTable() {
  const [roles, setRoles] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roleIdToDelete, setRoleIdToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rolesPerPage] = useState(3);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openEditModal = (role) => {
    setIsEditModalOpen(true);
    setSelectedRole(role);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedRole(null);
  };

  const openDeleteModal = (roleId) => {
    setRoleIdToDelete(roleId);
  };

  const closeDeleteModal = () => {
    setRoleIdToDelete(null);
  };

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:8081/superAdmin/getAllRoles",
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
        setRoles(data);
        setFilteredRoles(data); // Initialize filteredRoles with all roles
      } catch (error) {
        console.error("Error fetching roles: ", error);
      }
    };

    fetchRoles();
  }, []);

  useEffect(() => {
    // Filter roles based on search query
    const filtered = roles.filter((role) =>
      role.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    setFilteredRoles(filtered);
  }, [searchQuery, roles]);
  
  useEffect(() => {
    // Filter roles based on selected role name
    let filtered = [];
    if (selectedFilter === "All") {
      filtered = roles;
    } else {
      filtered = roles.filter((role) => role.role === selectedFilter);
    }
    setFilteredRoles(filtered);
  }, [selectedFilter, roles]);
  

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    setIsFilterDropdownOpen(false);
  };

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsFilterDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);
  

  const roleOptions = roles && roles.length > 0 ? roles.map((role, index) => (
    <button
      className="block px-4 py-2 text-sm w-full text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-white dark:hover:bg-gray-600"
      role="menuitem"
      onClick={() => handleFilterChange(role.role)} // Update this line
      key={role.id} // Assuming role.id is unique
      value={role.id} // Assuming role.id is the value you want to assign
    >
      {role.role} {/* Assuming role.name contains the display name */}
    </button>
  )) : null;

  const indexOfLastRole = currentPage * rolesPerPage;
  const indexOfFirstRole = indexOfLastRole - rolesPerPage;
  const currentRoles = filteredRoles.slice(indexOfFirstRole, indexOfLastRole);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <div className="mx-auto max-w-screen-xl px-4 pb-32 pt-2 mr-4 rounded-xl bg-gray-200 lg:px-12">
      <div className=" rounded-sm flex " ><h1 className="text-3xl font-semibold ">Roles</h1></div>
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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    required=""
                  />
                </div>
              </form>
            </div>
            <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
              <button
                type="button"
                onClick={() => openModal()}
                className="flex items-center justify-center text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
              >
                <i className="fa-solid fa-user-plus pr-2"> </i>
                Create Role
              </button>
              <CreateRoleModal isOpen={isModalOpen} onClose={closeModal} />
              <div className="relative inline-block text-left">
                <button
                  type="button"
                  onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                  className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-white bg-gray-800 rounded-lg border border-gray-200 hover:bg-gray-700 focus:outline-none dark:bg-gray-600 dark:border-gray-600 dark:hover:bg-gray-700"
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
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {isFilterDropdownOpen && (
                  <div ref={dropdownRef} className="origin-top-right absolute  right-0 mt-2 w-auto rounded-md bg-white shadow-lg dark:bg-gray-700 ring-1 ring-black ring-opacity-5">
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="options-menu"
                    >
                      <button
                        onClick={() => handleFilterChange("All")}
                        className="block px-4 py-2 text-sm  w-full text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-white dark:hover:bg-gray-600"
                        role="menuitem"
                      >
                        Show All
                      </button>
                      {roleOptions}
                    </div>
                  </div>
                )}
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
                    Role
                  </th>
                  <th scope="col" className="px-4 py-3 flex justify-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentRoles.map((role) => (
                  <tr className="border-b dark:border-gray-700" key={role.id}>
                    <th
                      scope="row"
                      className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {role.id}
                    </th>
                    <td className="px-4 py-3">{role.role}</td>

                    <td className="px-4 py-3 flex items-center justify-evenly">
                      <div className="flex items-center space-x-4">
                        <button
                          type="button"
                          onClick={() => openEditModal(role)}
                          data-drawer-target="drawer-update-product"
                          data-drawer-show="drawer-update-product"
                          aria-controls="drawer-update-product"
                          className="py-2 px-3 flex items-center text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                          <i className="fa-solid fa-pen-to-square pr-2"></i>
                          Edit
                        </button>
                        {isEditModalOpen && selectedRole && (
                          <EditRoleModal
                            isOpen={isEditModalOpen}
                            onClose={closeEditModal}
                            role={selectedRole}
                          />
                        )}
                        <DeleteRoleModal
                          isOpen={roleIdToDelete === role.id}
                          onClose={closeDeleteModal}
                          roleId={role.id}
                        />
                        <button
                          type="button"
                          onClick={() => openDeleteModal(role.id)}
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
          <nav
            className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
            aria-label="Table navigation"
          >
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Showing{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {indexOfFirstRole + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {indexOfLastRole > filteredRoles.length
                  ? filteredRoles.length
                  : indexOfLastRole}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {filteredRoles.length}
              </span>{" "}
              entries
            </span>
            <ul className="inline-flex items-stretch -space-x-px">
              {currentPage > 1 && (
                <button
                  onClick={() => paginate(currentPage - 1)}
                  className="px-3 py-2 bg-gray-200 dark:bg-gray-600 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-l-md hover:bg-gray-300 dark:hover:bg-gray-700 focus:outline-none"
                >
                  Previous
                </button>
              )}
              {currentRoles.length === rolesPerPage && (
                <button
                  onClick={() => paginate(currentPage + 1)}
                  className="px-3 py-2 bg-gray-200 dark:bg-gray-600 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-300 dark:hover:bg-gray-700 focus:outline-none"
                >
                  Next
                </button>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}

export default RoleTable;
