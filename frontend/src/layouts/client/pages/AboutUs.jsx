/* eslint-disable no-unused-vars */
import React from 'react';
import About1 from '../components/About1';
import { Link } from 'react-router-dom';

function AboutUs() {
  return (
    <div className="bg-gray-100">
    <nav className="flex ml-10 pt-10" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                <li className="inline-flex items-center ">
                  <Link
                    to="/"
                    className="inline-flex items-center  text-xl font-medium text-gray-900 hover:text-blue-900 dark:text-gray-900 dark:hover:text-gray-600"
                  >
                    <svg
                      className="w-4 h-4 me-2.5"
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
                    <a className="ms-1 text-xl font-medium text-gray-900 hover:text-blue-900 md:ms-2 dark:text-gray-900 dark:hover:text-gray-600">
                      About Us
                    </a>
                  </div>
                </li>
              </ol>
            </nav>
            <hr className="ml-10 mt-2 bg-gray-300 h-1 w-4/5 rounded"/>
    <div >
    <About1  />
    </div>
    </div>
  )
}

export default AboutUs
