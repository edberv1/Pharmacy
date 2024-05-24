import { useState, useEffect } from "react";
import Pagination from "../components/Pagination";
import DeleteContactModal from "../components/DeleteContactModal"; 

function ContactTable() {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedContact, setSelectedContact] = useState(null); // State for selected contact to be deleted
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/contact/getAllEmails",
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
        setContacts(data);
      } catch (error) {
        console.error("Error fetching emails: ", error);
      }
    };

    fetchEmails();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredContacts = contacts.filter((contact) =>
    contact.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate the index of the first and last items on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Select only the items for the current page
  const currentItems = filteredContacts.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > Math.ceil(contacts.length / itemsPerPage))
      return;
    setCurrentPage(newPage);
  };

  const handleDeleteClick = (contact) => {
    setSelectedContact(contact); // Set the contact to be deleted
    setIsModalOpen(true); // Open the modal
  };

  const confirmDelete = async () => {
    if (!selectedContact) return;

    try {
      const response = await fetch(
        `http://localhost:8080/contact/email/${selectedContact._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Remove the deleted contact from the contacts array
      setContacts(contacts.filter((contact) => contact._id !== selectedContact._id));
      setIsModalOpen(false); // Close the modal
      setSelectedContact(null); // Clear the selected contact
    } catch (error) {
      console.error("Error deleting contact: ", error);
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
                    value={searchTerm}
                    onChange={handleSearchChange}
                    required=""
                  />
                </div>
              </form>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-4 py-3">User Details</th>
                  <th scope="col" className="px-4 py-3">Email</th>
                  <th scope="col" className="px-4 py-3">Message</th>
                  <th scope="col" className="px-4 py-3 flex justify-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((contact) => (
                  <tr className="border-b dark:border-gray-700" key={contact._id}>
                    <td className="px-4 py-3">{contact.fullName}</td>
                    <td className="px-4 py-3">{contact.emailAddress}</td>
                    <td className="px-4 py-3">{contact.message}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDeleteClick(contact)}
                        className="flex items-center text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                      >
                        <i className="fa-solid fa-trash pr-2"></i>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(contacts.length / itemsPerPage)}
          handlePageChange={handlePageChange}
        />
        </div>
      </div>
      {isModalOpen && (
        <DeleteContactModal
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          confirmDelete={confirmDelete}
        />
      )}
    </>
  );
}

export default ContactTable;
