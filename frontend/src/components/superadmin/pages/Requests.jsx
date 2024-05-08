/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Pagination from "../components/Pagination";

function Requests () {
 
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





