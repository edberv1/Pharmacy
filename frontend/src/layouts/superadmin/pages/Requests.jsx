/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import fetchWithTokenRefresh from "../../../../utils/fetchWithTokenRefresh";

function Requests() {
  const [licenses, setLicenses] = useState([]);

  const fetchLicenses = async () => {
    try {
      const response = await fetchWithTokenRefresh(
        "http://localhost:8081/superAdmin/fetchPendingLicenses",
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
      setLicenses(data.data); // Adjusted this line
    } catch (error) {
      console.error("Error fetching licenses: ", error);
    }
  };

  useEffect(() => {
    fetchLicenses();
  }, []);

  const handleApprove = async (userId, licenseId, fetchLicenses) => {
    try {
      console.log(JSON.stringify({ userId, licenseId }));
      const response = await fetchWithTokenRefresh(
        "http://localhost:8081/superAdmin/approveUser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({ userId, licenseId }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data.message); // Log the success message

      // Refresh the licenses
      fetchLicenses();
    } catch (error) {
      console.error("Error approving user: ", error);
    }
  };

  const handleDecline = async (userId, licenseId, fetchLicenses) => {
    try {
      console.log(JSON.stringify({ userId, licenseId }));
      const response = await fetchWithTokenRefresh(
        "http://localhost:8081/superAdmin/declineUser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({ userId, licenseId }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data.message); // Log the success message

      // Refresh the licenses
      fetchLicenses();
    } catch (error) {
      console.error("Error declining user: ", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date
      .getFullYear()
      .toString()
      .substr(-2)}`;
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
                  <th scope="col" className="px-4 py-3">
                    ID of License
                  </th>
                  <th scope="col" className="px-4 py-3">
                    User Details
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Email
                  </th>
                  <th scope="col" className="px-4 py-3">
                    License ID PDF
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Issue Date
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Expiry Date
                  </th>
                  <th scope="col" className="px-4 py-3">
                    License
                  </th>
                  <th scope="col" className="px-4 py-3 flex justify-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {licenses.map((license) => (
                  <tr key={license.licenseId}>
                    <td className="px-4 py-3">{license.licenseId}</td>
                    <td className="px-4 py-3">
                      {license.firstname} {license.lastname}
                    </td>
                    <td className="px-4 py-3">{license.email}</td>
                    <td className="px-4 py-3">
                      <a
                        href={`http://localhost:8081/superAdmin/downloadLicense/${license.id}`} // Use license.id, not license.licenseId
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View License
                      </a>
                    </td>

                    <td className="px-4 py-3">
                      {formatDate(license.issueDate)}
                    </td>
                    <td className="px-4 py-3">
                      {formatDate(license.expiryDate)}
                    </td>
                    <td className="px-4 py-3">{license.status}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() =>
                          handleApprove(
                            license.userId,
                            license.licenseId,
                            fetchLicenses
                          )
                        }
                      >
                        Approve
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() =>
                          handleDecline(
                            license.userId,
                            license.licenseId,
                            fetchLicenses
                          )
                        }
                      >
                        Decline
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* <Pagination
  currentPage={currentPage}
  totalPages={Math.ceil(users.length / itemsPerPage)}
  handlePageChange={handlePageChange}
/> */}
        </div>
      </div>
    </>
  );
}

export default Requests;
